'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface ProfileHeaderProps {
  profile: Profile
  isCurrentUser: boolean
}

export function ProfileHeader({ profile, isCurrentUser }: ProfileHeaderProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(profile.name)
  const [department, setDepartment] = useState(profile.department || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          department,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('프로필이 업데이트되었습니다')
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('프로필 업데이트에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{profile.name}님의 프로필</h1>
        {isCurrentUser && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
          >
            프로필 수정
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg border bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">부서</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 rounded-lg border bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">연락처</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-lg border bg-background"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">이메일</h2>
            <p>{profile.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">부서</h2>
            <p>{profile.department || '-'}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">연락처</h2>
            <p>{profile.phone || '-'}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">가입일</h2>
            <p>{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  )
} 