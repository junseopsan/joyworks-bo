'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  defaultValue?: string
  className?: string
}

export function SearchInput({
  placeholder = '검색...',
  defaultValue = '',
  className = '',
}: SearchInputProps) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const searchParams = new URLSearchParams(window.location.search)
    if (value) {
      searchParams.set('search', value)
    } else {
      searchParams.delete('search')
    }
    searchParams.delete('page')

    router.push(`/questions?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-4 pr-10 py-2 rounded-lg border bg-background"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-3 flex items-center"
        >
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  )
} 