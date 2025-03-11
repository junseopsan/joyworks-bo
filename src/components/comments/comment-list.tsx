'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Comment } from '@/types'

interface CommentListProps {
  comments?: Comment[]
  parentType: 'question' | 'answer'
  parentId: string
}

export function CommentList({ comments = [], parentType, parentId }: CommentListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (commentId: string) => {
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
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      toast.success('댓글이 삭제되었습니다')
      router.refresh()
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('댓글 삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  if (comments?.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        아직 댓글이 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start justify-between gap-x-4 text-sm"
        >
          <div>
            <div className="flex items-center gap-x-2">
              <span className="font-medium">{comment.author?.name}</span>
              <span className="text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1">{comment.content}</p>
          </div>
          <button
            onClick={() => handleDelete(comment.id)}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-foreground"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  )
} 