'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface SecuritySettingsProps {
  profile: Profile
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function SecuritySettings({ profile }: SecuritySettingsProps) {
  const router = useRouter()
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: form.newPassword,
      })

      if (error) throw error

      toast.success('비밀번호가 변경되었습니다')
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      router.refresh()
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('비밀번호 변경에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">현재 비밀번호</label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, currentPassword: e.target.value }))
          }
          className="w-full rounded-lg border bg-background px-3 py-2"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">새 비밀번호</label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          className="w-full rounded-lg border bg-background px-3 py-2"
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">새 비밀번호 확인</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
          className="w-full rounded-lg border bg-background px-3 py-2"
          required
          minLength={8}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? '변경 중...' : '비밀번호 변경'}
      </button>
    </form>
  )
} 