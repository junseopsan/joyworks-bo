'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export function TagForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from('tags').insert({
        name,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setName('')
      setDescription('')
      toast.success('태그가 생성되었습니다')
      router.refresh()
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('태그 생성에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-6">
      <h3 className="text-lg font-medium">새 태그 생성</h3>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? '생성 중...' : '태그 생성'}
        </button>
      </div>
    </form>
  )
} 