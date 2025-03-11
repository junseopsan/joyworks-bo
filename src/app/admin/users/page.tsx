import { UserList } from '@/components/admin/user-list'
import { UserSearch } from '@/components/admin/user-search'
import { supabase } from '@/lib/supabase'

export default async function UsersPage() {
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">사용자 관리</h2>
      </div>

      <UserSearch />
      <UserList users={users || []} />
    </div>
  )
} 