import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProfileForm } from '@/components/profile/profile-form'
import type { Profile } from '@/types'

export const metadata: Metadata = {
  title: '프로필',
}

export default async function ProfilePage() {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">프로필</h1>
      <ProfileForm profile={profile as Profile} />
    </div>
  )
} 