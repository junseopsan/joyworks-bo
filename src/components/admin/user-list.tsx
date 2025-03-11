'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface UserListProps {
  users: Profile[]
}

export function UserList({ users: initialUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers)

  const handleToggleAdmin = async (user: Profile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          isAdmin: !user.isAdmin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u
        )
      )

      toast.success('관리자 권한이 변경되었습니다')
    } catch (error) {
      console.error('Error toggling admin:', error)
      toast.error('관리자 권한 변경에 실패했습니다')
    }
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">이름</th>
              <th className="px-4 py-3 text-left text-sm font-medium">이메일</th>
              <th className="px-4 py-3 text-left text-sm font-medium">부서</th>
              <th className="px-4 py-3 text-left text-sm font-medium">가입일</th>
              <th className="px-4 py-3 text-left text-sm font-medium">관리자</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-3 text-sm">{user.name}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.department || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleToggleAdmin(user)}
                    className={`
                      rounded-full px-2 py-1 text-xs font-medium
                      ${
                        user.isAdmin
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {user.isAdmin ? '관리자' : '일반'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 