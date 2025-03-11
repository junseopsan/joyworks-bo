'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { MDXEditor } from '@/components/ui/mdx-editor'
import type { Answer } from '@/types'

const answerSchema = z.object({
  content: z.string().min(20, '답변은 최소 20자 이상이어야 합니다'),
})

type AnswerValues = z.infer<typeof answerSchema>

interface AnswerFormProps {
  questionId?: string
  answer?: Answer
}

export function AnswerForm({ questionId, answer }: AnswerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AnswerValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      content: answer?.content || '',
    },
  })

  async function onSubmit(data: AnswerValues) {
    setIsSubmitting(true)

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      if (answer) {
        // 수정
        const { error } = await supabase
          .from('answers')
          .update({
            content: data.content,
          })
          .eq('id', answer.id)

        if (error) {
          throw error
        }

        toast.success('답변이 수정되었습니다')
        router.push(`/questions/${answer.question_id}`)
      } else {
        // 생성
        const { error } = await supabase.from('answers').insert({
          content: data.content,
          author_id: user.id,
          question_id: questionId,
        })

        if (error) {
          throw error
        }

        form.reset()
        toast.success('답변이 등록되었습니다')
      }

      router.refresh()
    } catch (error) {
      toast.error(
        answer ? '답변 수정에 실패했습니다' : '답변 등록에 실패했습니다'
      )
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="content"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {answer ? '답변 수정' : '답변 작성'}
        </label>
        <MDXEditor
          value={form.watch('content')}
          onChange={(value) => form.setValue('content', value)}
          disabled={isSubmitting}
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
          {isSubmitting
            ? answer
              ? '수정 중...'
              : '등록 중...'
            : answer
            ? '답변 수정'
            : '답변 등록'}
        </button>
      </div>
    </form>
  )
} 