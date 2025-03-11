import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { AdminNav } from '@/components/admin/admin-nav'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: '관리자 대시보드',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.isAdmin) {
    redirect('/')
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        </div>

        <div className="flex gap-8">
          <AdminNav />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </MainLayout>
  )
} 