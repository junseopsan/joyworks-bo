'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'

export function UserSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''

  const handleSearch = useDebounce((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`/admin/users?${params.toString()}`)
  }, 300)

  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="이름 또는 이메일로 검색"
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="flex-1 rounded-lg border bg-background px-3 py-2"
      />
    </div>
  )
} 