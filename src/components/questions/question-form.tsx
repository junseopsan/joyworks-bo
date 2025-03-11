'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { MDXEditor } from '@/components/ui/mdx-editor'
import type { Question } from '@/types'

const questionSchema = z.object({
  title: z.string().min(5, '제목은 최소 5자 이상이어야 합니다'),
  content: z.string().min(20, '내용은 최소 20자 이상이어야 합니다'),
  tags: z.array(z.string()).min(1, '태그를 최소 1개 이상 선택해주세요'),
})

type QuestionValues = z.infer<typeof questionSchema>

interface QuestionFormProps {
  question?: Question
}

export function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [tags, setTags] = React.useState<string[]>(
    question?.tags?.map((tag) => tag.name) || []
  )

  const form = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question?.title || '',
      content: question?.content || '',
      tags: question?.tags?.map((tag) => tag.name) || [],
    },
  })

  async function onSubmit(data: QuestionValues) {
    setIsSubmitting(true)

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      if (question) {
        // 수정
        const { error } = await supabase
          .from('questions')
          .update({
            title: data.title,
            content: data.content,
          })
          .eq('id', question.id)

        if (error) {
          throw error
        }

        // 기존 태그 삭제
        await supabase
          .from('question_tags')
          .delete()
          .eq('question_id', question.id)

        // 새로운 태그 추가
        await supabase.from('question_tags').insert(
          data.tags.map((tag) => ({
            question_id: question.id,
            name: tag,
          }))
        )

        toast.success('질문이 수정되었습니다')
        router.push(`/questions/${question.id}`)
      } else {
        // 생성
        const { data: newQuestion, error } = await supabase
          .from('questions')
          .insert({
            title: data.title,
            content: data.content,
            author_id: user.id,
          })
          .select()
          .single()

        if (error || !newQuestion) {
          throw error
        }

        // 태그 추가
        await supabase.from('question_tags').insert(
          data.tags.map((tag) => ({
            question_id: newQuestion.id,
            name: tag,
          }))
        )

        toast.success('질문이 등록되었습니다')
        router.push(`/questions/${newQuestion.id}`)
      }

      router.refresh()
    } catch (error) {
      toast.error(
        question ? '질문 수정에 실패했습니다' : '질문 등록에 실패했습니다'
      )
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (e.target.checked) {
      setTags([...tags, value])
      form.setValue('tags', [...tags, value])
    } else {
      setTags(tags.filter((tag) => tag !== value))
      form.setValue(
        'tags',
        tags.filter((tag) => tag !== value)
      )
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          제목
        </label>
        <input
          {...form.register('title')}
          type="text"
          className="input w-full"
          placeholder="질문의 제목을 입력하세요"
          disabled={isSubmitting}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-500">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          내용
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

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          태그
        </label>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js'].map(
            (tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={tag}
                  checked={tags.includes(tag)}
                  onChange={handleTagChange}
                  disabled={isSubmitting}
                  className="checkbox"
                />
                <span className="text-sm">{tag}</span>
              </label>
            )
          )}
        </div>
        {form.formState.errors.tags && (
          <p className="text-sm text-red-500">
            {form.formState.errors.tags.message}
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
            ? question
              ? '수정 중...'
              : '등록 중...'
            : question
            ? '질문 수정'
            : '질문 등록'}
        </button>
      </div>
    </form>
  )
} 