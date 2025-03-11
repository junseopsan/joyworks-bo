'use client'

import * as React from 'react'
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
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [showCommentForm, setShowCommentForm] = React.useState<string | null>(null)

  const user = React.useMemo(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }, [])

  const handleDelete = async (answerId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(answerId)

    try {
      const { error } = await supabase
        .from('answers')
        .delete()
        .eq('id', answerId)

      if (error) {
        throw error
      }

      toast.success('답변이 삭제되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('답변 삭제에 실패했습니다')
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleAccept = async (answerId: string) => {
    try {
      const { error } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId)

      if (error) {
        throw error
      }

      toast.success('답변이 채택되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('답변 채택에 실패했습니다')
      console.error(error)
    }
  }

  const handleHelpful = async (answerId: string) => {
    try {
      const currentUser = (await supabase.auth.getUser()).data.user
      if (!currentUser) {
        throw new Error('로그인이 필요합니다')
      }

      const { data: existingMark } = await supabase
        .from('helpful_marks')
        .select()
        .eq('answer_id', answerId)
        .eq('user_id', currentUser.id)
        .single()

      if (existingMark) {
        const { error } = await supabase
          .from('helpful_marks')
          .delete()
          .eq('id', existingMark.id)

        if (error) {
          throw error
        }

        toast.success('도움이 됐어요를 취소했습니다')
      } else {
        const { error } = await supabase.from('helpful_marks').insert({
          answer_id: answerId,
          user_id: currentUser.id,
        })

        if (error) {
          throw error
        }

        toast.success('도움이 됐어요를 표시했습니다')
      }

      router.refresh()
    } catch (error) {
      toast.error('도움이 됐어요 표시에 실패했습니다')
      console.error(error)
    }
  }

  if (answers.length === 0) {
    return <div className="text-sm text-muted-foreground">답변이 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        답변 {answers.length}개
      </h2>

      <div className="space-y-6">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="rounded-lg border p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-4 text-sm">
                <span className="font-medium">{answer.author?.name}</span>
                <span className="text-muted-foreground">
                  {new Date(answer.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {user?.id === answer.author_id && (
                  <>
                    <button
                      onClick={() => router.push(`/answers/${answer.id}/edit`)}
                      className="btn btn-ghost"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(answer.id)}
                      disabled={isDeleting === answer.id}
                      className="btn btn-ghost text-red-500"
                    >
                      {isDeleting === answer.id ? '삭제 중...' : '삭제'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MDXViewer content={answer.content} />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleHelpful(answer.id)}
                className="btn btn-ghost text-sm"
              >
                도움이 됐어요 ({answer.helpful_count})
              </button>
              {!answer.is_accepted && (
                <button
                  onClick={() => handleAccept(answer.id)}
                  className="btn btn-ghost text-sm text-green-500"
                >
                  답변 채택하기
                </button>
              )}
              {answer.is_accepted && (
                <span className="text-sm text-green-500">채택된 답변</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">댓글</h3>
                <button
                  onClick={() =>
                    setShowCommentForm(
                      showCommentForm === answer.id ? null : answer.id
                    )
                  }
                  className="btn btn-ghost"
                >
                  {showCommentForm === answer.id ? '취소' : '댓글 작성'}
                </button>
              </div>

              {showCommentForm === answer.id && (
                <CommentForm
                  parentType="answer"
                  parentId={answer.id}
                  onSuccess={() => {
                    setShowCommentForm(null)
                    router.refresh()
                  }}
                />
              )}

              <CommentList
                comments={answer.comments}
                parentType="answer"
                parentId={answer.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 