'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

interface AnswerFormProps {
  questionId: string
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('답변 내용을 입력해주세요')
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
        .from('answers')
        .insert([
          {
            question_id: questionId,
            content,
            author_id: user.id,
          },
        ])

      if (error) throw error

      toast.success('답변이 등록되었습니다')
      setContent('')
      router.refresh()
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('답변 등록에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">답변 작성</h2>
        <div ref={(el) => {
          if (el && !el.querySelector('.toastui-editor-defaultUI')) {
            new Editor({
              el,
              height: '400px',
              initialValue: content,
              initialEditType: 'markdown',
              previewStyle: 'vertical',
              onChange: () => {
                const editorInstance = el.querySelector('.toastui-editor-defaultUI') as any
                if (editorInstance) {
                  setContent(editorInstance.getInstance().getMarkdown())
                }
              },
            })
          }
        }} />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? '등록 중...' : '답변 등록'}
        </button>
      </div>
    </form>
  )
} 