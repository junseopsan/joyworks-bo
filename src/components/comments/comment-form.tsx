'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface CommentFormProps {
  parentType: 'question' | 'answer'
  parentId: string
}

export function CommentForm({ parentType, parentId }: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('댓글 내용을 입력해주세요')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('로그인이 필요합니다')
        return
      }

      const { error } = await supabase
        .from('comments')
        .insert([
          {
            content: content.trim(),
            author_id: user.id,
            parent_type: parentType,
            parent_id: parentId,
          },
        ])

      if (error) throw error

      toast.success('댓글이 등록되었습니다')
      setContent('')
      router.refresh()
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('댓글 등록에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  )
} 