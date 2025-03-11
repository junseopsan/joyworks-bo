'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const sortOptions = [
  { value: 'recent', label: '최신순' },
  { value: 'views', label: '조회순' },
  { value: 'answers', label: '답변순' },
]

export function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'recent'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    router.push(`/questions?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">정렬:</span>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border bg-background px-2 py-1 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 