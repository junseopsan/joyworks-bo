'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { CommentList } from '@/components/comments/comment-list'
import { CommentForm } from '@/components/comments/comment-form'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import type { Question } from '@/types'

interface QuestionDetailProps {
  question: Question
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showCommentForm, setShowCommentForm] = React.useState(false)

  const handleDelete = async () => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      if (error) {
        throw error
      }

      toast.success('질문이 삭제되었습니다')
      router.push('/questions')
      router.refresh()
    } catch (error) {
      toast.error('질문 삭제에 실패했습니다')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  const user = React.useMemo(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }, [])

  return (
    <article className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{question.title}</h1>
          {user?.id === question.author_id && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/questions/${question.id}/edit`)}
                className="btn btn-ghost"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-ghost text-red-500"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
          <span>{question.author?.name}</span>
          <span>조회 {question.view_count}</span>
          <span>
            {new Date(question.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <div className="flex gap-2">
            {question.tags?.map((tag) => (
              <span
                key={tag.id}
                className="badge badge-secondary"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MDXViewer content={question.content} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">댓글</h2>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="btn btn-ghost"
          >
            {showCommentForm ? '취소' : '댓글 작성'}
          </button>
        </div>

        {showCommentForm && (
          <CommentForm
            parentType="question"
            parentId={question.id}
            onSuccess={() => {
              setShowCommentForm(false)
              router.refresh()
            }}
          />
        )}

        <CommentList
          comments={question.comments}
          parentType="question"
          parentId={question.id}
        />
      </div>
    </article>
  )
} 