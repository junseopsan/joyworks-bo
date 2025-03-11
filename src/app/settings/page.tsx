import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { SettingsTabs } from '@/components/settings/settings-tabs'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: '설정',
}

export default async function SettingsPage() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/')
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">설정</h1>
        </div>

        <SettingsTabs profile={profile} />
      </div>
    </MainLayout>
  )
} 