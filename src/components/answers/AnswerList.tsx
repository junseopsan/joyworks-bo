'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

// 임시 컴포넌트 (실제 컴포넌트가 구현될 때까지 사용)
const CommentList = ({ comments }: { comments: any[] }) => (
  <div className="space-y-2 mt-2">
    {comments.length === 0 ? (
      <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
    ) : (
      comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-2 rounded-md text-sm">
          <p>{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {comment.author?.name} • {new Date(comment.created_at).toLocaleDateString()}
          </div>
        </div>
      ))
    )}
  </div>
);

const CommentForm = ({ answerId }: { answerId: string }) => (
  <div className="mt-2">
    <textarea
      className="w-full p-2 border border-gray-300 rounded-md"
      placeholder="댓글을 작성하세요..."
      rows={2}
    ></textarea>
    <button className="mt-2 px-3 py-1 bg-primary-600 text-white rounded-md text-sm">
      댓글 등록
    </button>
  </div>
);

interface Answer {
  id: string;
  content: string;
  is_accepted: boolean;
  created_at: string;
  author: {
    id: string;
    name: string;
    department?: string;
  };
  helpful_votes: {
    count: number;
  }[];
  comments: any[];
}

interface AnswerListProps {
  answers: Answer[];
  questionId: string;
}

export default function AnswerList({ answers, questionId }: AnswerListProps) {
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const supabase = createClient();

  const toggleComments = (answerId: string) => {
    setExpandedComments((prev) =>
      prev.includes(answerId)
        ? prev.filter((id) => id !== answerId)
        : [...prev, answerId]
    );
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [answerId]: true }));

      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 질문 작성자 확인
      const { data: question } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

      if (!question || question.author_id !== user.id) {
        alert('질문 작성자만 답변을 채택할 수 있습니다.');
        return;
      }

      // 기존 채택된 답변이 있으면 해제
      await supabase
        .from('answers')
        .update({ is_accepted: false })
        .eq('question_id', questionId)
        .eq('is_accepted', true);

      // 새 답변 채택
      const { error } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId);

      if (error) {
        throw error;
      }

      // 알림 생성 (답변 작성자에게)
      const { data: answerData } = await supabase
        .from('answers')
        .select('author_id')
        .eq('id', answerId)
        .single();

      if (answerData && answerData.author_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: answerData.author_id,
          type: 'ACCEPTED',
          message: '회원님의 답변이 채택되었습니다.',
          is_read: false,
        });
      }

      router.refresh();
    } catch (error) {
      console.error('답변 채택 중 오류:', error);
      alert('답변 채택 중 오류가 발생했습니다.');
    } finally {
      setLoading((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  const handleHelpfulVote = async (answerId: string) => {
    try {
      setLoading((prev) => ({ ...prev, [answerId]: true }));

      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 이미 투표했는지 확인
      const { data: existingVote } = await supabase
        .from('helpful_votes')
        .select('id')
        .eq('user_id', user.id)
        .eq('answer_id', answerId)
        .maybeSingle();

      if (existingVote) {
        // 이미 투표한 경우 취소
        const { error } = await supabase
          .from('helpful_votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) {
          throw error;
        }
      } else {
        // 새로 투표
        const { error } = await supabase.from('helpful_votes').insert({
          user_id: user.id,
          answer_id: answerId,
        });

        if (error) {
          throw error;
        }

        // 알림 생성 (답변 작성자에게)
        const { data: answerData } = await supabase
          .from('answers')
          .select('author_id')
          .eq('id', answerId)
          .single();

        if (answerData && answerData.author_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: answerData.author_id,
            type: 'HELPFUL',
            message: '회원님의 답변이 도움이 되었다는 평가를 받았습니다.',
            is_read: false,
          });
        }
      }

      router.refresh();
    } catch (error) {
      console.error('도움이 됨 투표 중 오류:', error);
      alert('투표 중 오류가 발생했습니다.');
    } finally {
      setLoading((prev) => ({ ...prev, [answerId]: false }));
    }
  };

  if (answers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 답변이 없습니다. 첫 번째 답변을 작성해보세요!
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {answers.map((answer) => (
        <div
          key={answer.id}
          className={`bg-white border rounded-lg overflow-hidden ${
            answer.is_accepted ? 'border-green-500' : 'border-gray-200'
          }`}
        >
          {answer.is_accepted && (
            <div className="bg-green-100 px-4 py-2 text-green-800 text-sm font-medium">
              채택된 답변
            </div>
          )}
          <div className="p-4">
            <div className="prose max-w-none">{answer.content}</div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => handleHelpfulVote(answer.id)}
                  disabled={loading[answer.id]}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4 mr-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  도움이 됨 ({answer.helpful_votes[0]?.count || 0})
                </button>

                <button
                  type="button"
                  onClick={() => toggleComments(answer.id)}
                  className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  댓글 ({answer.comments?.length || 0})
                </button>

                {!answer.is_accepted && (
                  <button
                    type="button"
                    onClick={() => handleAcceptAnswer(answer.id)}
                    disabled={loading[answer.id]}
                    className="inline-flex items-center text-xs text-gray-500 hover:text-green-700"
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    답변 채택
                  </button>
                )}
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500">
                    <span className="text-sm font-medium leading-none text-white">
                      {answer.author.name.charAt(0)}
                    </span>
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {answer.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(answer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {expandedComments.includes(answer.id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">댓글</h4>
                <CommentList comments={answer.comments} />
                <div className="mt-2">
                  <CommentForm answerId={answer.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 