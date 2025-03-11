'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'

interface NotificationListProps {
  userId: string
}

export function NotificationList({ userId }: NotificationListProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error

        setNotifications(data || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [userId])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('알림을 읽음 처리하는데 실패했습니다')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      )

      toast.success('모든 알림을 읽음 처리했습니다')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('알림을 읽음 처리하는데 실패했습니다')
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('알림 삭제에 실패했습니다')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-lg border p-4"
          >
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">알림이 없습니다</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          새로운 알림이 오면 여기에 표시됩니다
        </p>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          알림 {unreadCount > 0 && `(${unreadCount})`}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-secondary"
          >
            모두 읽음 처리
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start justify-between rounded-lg border p-4 ${
              !notification.is_read ? 'bg-secondary/20' : ''
            }`}
          >
            <div className="space-y-1">
              <Link
                href={notification.link}
                onClick={() => handleMarkAsRead(notification.id)}
                className="block font-medium hover:text-primary"
              >
                {notification.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {notification.content}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(notification.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(notification.id)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 