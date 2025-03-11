'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  const router = useRouter()

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) {
        throw error
      }

      router.refresh()
    } catch (error) {
      toast.error('알림을 읽음 처리하는데 실패했습니다')
      console.error(error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      router.refresh()
    } catch (error) {
      toast.error('알림을 삭제하는데 실패했습니다')
      console.error(error)
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-gray-500">
        알림이 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start justify-between rounded-lg border p-4 ${
            notification.read ? 'bg-white' : 'bg-blue-50'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{notification.title}</span>
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-500">{notification.content}</p>
            <div className="flex items-center gap-4">
              <Link
                href={notification.link}
                className="text-sm text-blue-500 hover:underline"
              >
                바로가기
              </Link>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  읽음 처리
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 