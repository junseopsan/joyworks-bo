'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { MDXEditor } from '@mdxeditor/editor'

const answerSchema = z.object({
  content: z.string().min(1, '답변 내용을 입력해주세요.'),
})

type AnswerFormData = z.infer<typeof answerSchema>

interface AnswerFormProps {
  questionId: string
  onSuccess?: () => void
}

export default function AnswerForm({ questionId, onSuccess }: AnswerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
  })

  const onSubmit = async (data: AnswerFormData) => {
    try {
      setIsSubmitting(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error('로그인이 필요합니다.')
        return
      }

      const { error } = await supabase.from('answers').insert({
        content: data.content,
        question_id: questionId,
        author_id: user.id,
      })

      if (error) throw error

      toast.success('답변이 등록되었습니다.')
      reset()
      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('답변 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <div className="rounded-lg border">
          <MDXEditor
            markdown=""
            onChange={(value) => {
              register('content').onChange({
                target: { value },
              })
            }}
            placeholder="답변을 작성해주세요..."
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  )
} 