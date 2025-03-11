'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
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

      if (user.id !== question.author_id) {
        toast.error('삭제 권한이 없습니다')
        return
      }

      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id)

      if (error) throw error

      toast.success('질문이 삭제되었습니다')
      router.push('/questions')
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('질문 삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{question.title}</h1>
          <div className="mt-2 flex items-center gap-x-4 text-sm text-muted-foreground">
            <span>{question.author?.name}</span>
            <span>조회 {question.view_count}</span>
            <span>
              {new Date(question.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            href={`/questions/${question.id}/edit`}
            className="btn btn-secondary"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-danger"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXViewer content={question.content} />
      </div>

      <div className="flex flex-wrap gap-2">
        {question.tags?.map((tag) => (
          <Link
            key={tag.id}
            href={`/questions?tag=${tag.name}`}
            className="inline-block bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium hover:bg-secondary/80"
          >
            {tag.name}
          </Link>
        ))}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">댓글</h2>
        <CommentList 
          comments={question.comments} 
          parentType="question" 
          parentId={question.id}
        />
        <div className="mt-4">
          <CommentForm parentType="question" parentId={question.id} />
        </div>
      </div>
    </div>
  )
} 