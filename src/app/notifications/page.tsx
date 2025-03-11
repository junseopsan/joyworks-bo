import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { NotificationList } from '@/components/notifications/notification-list'
import type { Notification } from '@/types'

export const metadata: Metadata = {
  title: '알림',
}

export default async function NotificationsPage() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    redirect('/login')
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select()
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">알림</h1>
      <NotificationList notifications={notifications as Notification[]} />
    </div>
  )
} 