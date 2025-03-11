'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AccountSettingsProps {
  profile: Profile
}

export function AccountSettings({ profile }: AccountSettingsProps) {
  const router = useRouter()
  const [email, setEmail] = useState(profile.email)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        email,
      })

      if (error) throw error

      toast.success('이메일이 업데이트되었습니다')
      router.refresh()
    } catch (error) {
      console.error('Error updating email:', error)
      toast.error('이메일 업데이트에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id)

      if (deleteError) throw deleteError

      router.push('/')
      toast.success('계정이 삭제되었습니다')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('계정 삭제에 실패했습니다')
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </form>

      <div className="border-t pt-8">
        <h3 className="text-lg font-medium text-destructive">위험 구역</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다
        </p>

        <button
          onClick={handleDeleteAccount}
          className="mt-4 btn btn-destructive"
        >
          계정 삭제
        </button>
      </div>
    </div>
  )
} 