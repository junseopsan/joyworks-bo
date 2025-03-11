import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { NotificationList } from '@/components/notifications/notification-list'

export const metadata: Metadata = {
  title: '알림',
}

export default async function NotificationsPage() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container max-w-4xl py-8">
      <NotificationList userId={user.id} />
    </div>
  )
} 