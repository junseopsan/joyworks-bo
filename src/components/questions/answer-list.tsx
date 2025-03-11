'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { CommentList } from '@/components/comments/comment-list'
import { CommentForm } from '@/components/comments/comment-form'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import type { Answer } from '@/types'

interface AnswerListProps {
  answers?: Answer[]
}

export function AnswerList({ answers = [] }: AnswerListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [acceptingAnswerId, setAcceptingAnswerId] = useState<string | null>(null)
  const [markingHelpfulId, setMarkingHelpfulId] = useState<string | null>(null)

  const handleDelete = async (answerId: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('로그인이 필요합니다')
        return
      }

      const { error } = await supabase
        .from('answers')
        .delete()
        .eq('id', answerId)

      if (error) throw error

      toast.success('답변이 삭제되었습니다')
      router.refresh()
    } catch (error) {
      console.error('Error deleting answer:', error)
      toast.error('답변 삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAccept = async (answerId: string) => {
    setAcceptingAnswerId(answerId)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('로그인이 필요합니다')
        return
      }

      const { error } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId)

      if (error) throw error

      toast.success('답변을 채택했습니다')
      router.refresh()
    } catch (error) {
      console.error('Error accepting answer:', error)
      toast.error('답변 채택에 실패했습니다')
    } finally {
      setAcceptingAnswerId(null)
    }
  }

  const handleMarkHelpful = async (answerId: string) => {
    setMarkingHelpfulId(answerId)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('로그인이 필요합니다')
        return
      }

      const { error } = await supabase
        .from('helpful_marks')
        .insert([
          {
            answer_id: answerId,
            user_id: user.id,
          },
        ])

      if (error) throw error

      toast.success('답변이 도움이 되었다고 표시했습니다')
      router.refresh()
    } catch (error) {
      console.error('Error marking answer as helpful:', error)
      toast.error('답변을 도움됨으로 표시하는데 실패했습니다')
    } finally {
      setMarkingHelpfulId(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        답변 {answers.length}개
      </h2>

      {answers.map((answer) => (
        <div
          key={answer.id}
          className={`border rounded-lg p-6 space-y-4 ${
            answer.is_accepted ? 'border-green-500 bg-green-50' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-x-2">
                <span className="font-medium">{answer.author?.name}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(answer.created_at).toLocaleDateString()}
                </span>
              </div>
              {answer.is_accepted && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  채택된 답변
                </span>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => handleAccept(answer.id)}
                disabled={answer.is_accepted || acceptingAnswerId === answer.id}
                className="btn btn-secondary"
              >
                {acceptingAnswerId === answer.id ? '채택 중...' : '채택하기'}
              </button>
              <button
                onClick={() => handleMarkHelpful(answer.id)}
                disabled={markingHelpfulId === answer.id}
                className="btn btn-secondary"
              >
                {markingHelpfulId === answer.id ? '처리 중...' : '도움됨'}
                <span className="ml-1">
                  {answer.helpful_marks?.length || 0}
                </span>
              </button>
              <button
                onClick={() => handleDelete(answer.id)}
                disabled={isDeleting}
                className="btn btn-danger"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXViewer content={answer.content} />
          </div>

          <div className="border-t pt-4">
            <CommentList
              comments={answer.comments}
              parentType="answer"
              parentId={answer.id}
            />
            <div className="mt-4">
              <CommentForm
                parentType="answer"
                parentId={answer.id}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 