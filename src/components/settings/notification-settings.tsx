'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface NotificationSettingsProps {
  profile: Profile
}

interface NotificationPreferences {
  newAnswer: boolean
  newComment: boolean
  answerAccepted: boolean
  answerHelpful: boolean
}

export function NotificationSettings({ profile }: NotificationSettingsProps) {
  const router = useRouter()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    newAnswer: true,
    newComment: true,
    answerAccepted: true,
    answerHelpful: true,
    ...profile.notification_preferences,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      toast.success('알림 설정이 업데이트되었습니다')
      router.refresh()
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      toast.error('알림 설정 업데이트에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">새로운 답변</h3>
            <p className="text-sm text-muted-foreground">
              내 질문에 새로운 답변이 달렸을 때 알림을 받습니다
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('newAnswer')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${preferences.newAnswer ? 'bg-primary' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                transition duration-200 ease-in-out
                ${preferences.newAnswer ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">새로운 댓글</h3>
            <p className="text-sm text-muted-foreground">
              내 질문이나 답변에 새로운 댓글이 달렸을 때 알림을 받습니다
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('newComment')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${preferences.newComment ? 'bg-primary' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                transition duration-200 ease-in-out
                ${preferences.newComment ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">답변 채택</h3>
            <p className="text-sm text-muted-foreground">
              내 답변이 채택되었을 때 알림을 받습니다
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('answerAccepted')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${preferences.answerAccepted ? 'bg-primary' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                transition duration-200 ease-in-out
                ${preferences.answerAccepted ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">도움이 되는 답변</h3>
            <p className="text-sm text-muted-foreground">
              내 답변이 도움이 된다고 표시되었을 때 알림을 받습니다
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('answerHelpful')}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${preferences.answerHelpful ? 'bg-primary' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                transition duration-200 ease-in-out
                ${preferences.answerHelpful ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? '저장 중...' : '저장'}
      </button>
    </form>
  )
} 