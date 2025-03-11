import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { TagList } from '@/components/tags/tag-list'
import { TagForm } from '@/components/tags/tag-form'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: '태그 관리',
}

export default async function TagsPage() {
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

  const { data: tags } = await supabase
    .from('tags')
    .select('*, questions:question_tags(count)')
    .order('name')

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">태그 관리</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <TagList initialTags={tags || []} />
          <TagForm />
        </div>
      </div>
    </MainLayout>
  )
} 