'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

interface QuestionListProps {
  questions: Question[]
}

export function QuestionList({ questions: initialQuestions }: QuestionListProps) {
  const [questions, setQuestions] = useState(initialQuestions)

  const handleToggleNotice = async (question: Question) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          is_notice: !question.is_notice,
          updated_at: new Date().toISOString(),
        })
        .eq('id', question.id)

      if (error) throw error

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, is_notice: !q.is_notice } : q
        )
      )

      toast.success('공지사항 설정이 변경되었습니다')
    } catch (error) {
      console.error('Error toggling notice:', error)
      toast.error('공지사항 설정 변경에 실패했습니다')
    }
  }

  const handleDelete = async (question: Question) => {
    if (!confirm('정말 이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      if (error) throw error

      setQuestions((prev) => prev.filter((q) => q.id !== question.id))
      toast.success('질문이 삭제되었습니다')
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('질문 삭제에 실패했습니다')
    }
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium">작성자</th>
              <th className="px-4 py-3 text-left text-sm font-medium">태그</th>
              <th className="px-4 py-3 text-left text-sm font-medium">답변</th>
              <th className="px-4 py-3 text-left text-sm font-medium">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium">공지</th>
              <th className="px-4 py-3 text-left text-sm font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-b">
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/questions/${question.id}`}
                    className="hover:text-primary"
                  >
                    {question.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">
                  {question.author?.name || '알 수 없음'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-1">
                    {question.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-muted px-2 py-1 text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {question.answers?.[0]?.count || 0}
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(question.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleToggleNotice(question)}
                    className={`
                      rounded-full px-2 py-1 text-xs font-medium
                      ${
                        question.is_notice
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {question.is_notice ? '공지' : '일반'}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDelete(question)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 