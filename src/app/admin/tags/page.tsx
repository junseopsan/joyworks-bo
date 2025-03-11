import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { TagList } from '@/components/admin/tag-list'
import { TagForm } from '@/components/admin/tag-form'
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
    .select(`
      *,
      questions:question_tags(count)
    `)
    .order('name')

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">태그 관리</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TagList tags={tags || []} />
          </div>
          <div>
            <TagForm />
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 