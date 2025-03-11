'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
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

      // 답변 등록
      const { error: answerError } = await supabase
        .from('answers')
        .insert({
          content,
          author_id: user.id,
          question_id: questionId,
          is_accepted: false,
        });

      if (answerError) {
        throw answerError;
      }

      // 알림 생성 (질문 작성자에게)
      const { data: questionData } = await supabase
        .from('questions')
        .select('author_id')
        .eq('id', questionId)
        .single();

      if (questionData && questionData.author_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: questionData.author_id,
          type: 'ANSWER',
          message: `회원님의 질문에 새로운 답변이 등록되었습니다.`,
          is_read: false,
        });
      }

      setContent('');
      router.refresh();
    } catch (error: any) {
      setError(error.message || '답변 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          id="answer-content"
          name="content"
          rows={6}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="답변을 작성해주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  );
} 