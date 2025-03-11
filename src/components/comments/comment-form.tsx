'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'

const commentSchema = z.object({
  content: z.string().min(1, '내용을 입력하세요'),
})

type CommentValues = z.infer<typeof commentSchema>

interface CommentFormProps {
  parentType: 'question' | 'answer'
  parentId: string
  onSuccess?: () => void
}

export function CommentForm({
  parentType,
  parentId,
  onSuccess,
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  })

  async function onSubmit(data: CommentValues) {
    setIsSubmitting(true)

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      const { error } = await supabase.from('comments').insert({
        content: data.content,
        author_id: user.id,
        parent_type: parentType,
        parent_id: parentId,
      })

      if (error) {
        throw error
      }

      form.reset()
      toast.success('댓글이 등록되었습니다')
      onSuccess?.()
    } catch (error) {
      toast.error('댓글 등록에 실패했습니다')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <textarea
          {...form.register('content')}
          disabled={isSubmitting}
          className="textarea h-20 w-full"
          placeholder="댓글을 입력하세요"
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

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