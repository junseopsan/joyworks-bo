'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

interface CommentFormProps {
  questionId?: string;
  answerId?: string;
}

export default function CommentForm({ questionId, answerId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      // 댓글 등록
      const { error: commentError } = await supabase
        .from('comments')
        .insert({
          content,
          author_id: user.id,
          question_id: questionId,
          answer_id: answerId,
        });

      if (commentError) {
        throw commentError;
      }

      // 알림 생성
      if (answerId) {
        // 답변에 대한 댓글인 경우 답변 작성자에게 알림
        const { data: answerData } = await supabase
          .from('answers')
          .select('author_id')
          .eq('id', answerId)
          .single();

        if (answerData && answerData.author_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: answerData.author_id,
            type: 'COMMENT',
            message: '회원님의 답변에 새로운 댓글이 등록되었습니다.',
            is_read: false,
          });
        }
      } else if (questionId) {
        // 질문에 대한 댓글인 경우 질문 작성자에게 알림
        const { data: questionData } = await supabase
          .from('questions')
          .select('author_id')
          .eq('id', questionId)
          .single();

        if (questionData && questionData.author_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: questionData.author_id,
            type: 'COMMENT',
            message: '회원님의 질문에 새로운 댓글이 등록되었습니다.',
            is_read: false,
          });
        }
      }

      setContent('');
      router.refresh();
    } catch (error: any) {
      setError(error.message || '댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-start space-x-3">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <textarea
              id="comment"
              name="comment"
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="댓글을 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '등록 중...' : '등록'}
        </button>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </form>
  );
} 