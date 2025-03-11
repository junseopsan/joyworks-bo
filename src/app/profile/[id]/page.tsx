import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileActivity } from '@/components/profile/profile-activity'
import type { Profile } from '@/types'

interface PageProps {
  params: {
    id: string
  }
}

async function getProfile(id: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile as Profile
}

async function getCurrentUser() {
  const headersList = headers()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const profile = await getProfile(params.id)

  if (!profile) {
    return {
      title: '프로필을 찾을 수 없습니다',
    }
  }

  return {
    title: `${profile.name}님의 프로필`,
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const profile = await getProfile(params.id)

  if (!profile) {
    notFound()
  }

  const currentUser = await getCurrentUser()
  const isCurrentUser = currentUser?.id === profile.id

  return (
    <div className="space-y-8">
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <ProfileActivity userId={profile.id} />
    </div>
  )
} 