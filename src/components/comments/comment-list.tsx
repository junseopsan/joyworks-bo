'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

interface CommentListProps {
  comments?: Comment[]
  parentType: 'question' | 'answer'
  parentId: string
}

export function CommentList({
  comments = [],
  parentType,
  parentId,
}: CommentListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

  const user = React.useMemo(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }, [])

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(commentId)

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        throw error
      }

      toast.success('댓글이 삭제되었습니다')
      router.refresh()
    } catch (error) {
      toast.error('댓글 삭제에 실패했습니다')
      console.error(error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (comments.length === 0) {
    return <div className="text-sm text-muted-foreground">댓글이 없습니다.</div>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start justify-between gap-4 rounded-lg border p-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-x-2 text-sm">
              <span className="font-medium">{comment.author?.name}</span>
              <span className="text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>

          {user?.id === comment.author_id && (
            <button
              onClick={() => handleDelete(comment.id)}
              disabled={isDeleting === comment.id}
              className="text-sm text-muted-foreground hover:text-red-500"
            >
              {isDeleting === comment.id ? '삭제 중...' : '삭제'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
} 