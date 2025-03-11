'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  const router = useRouter()
  const [value, setValue] = React.useState(props.defaultValue || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (value.trim()) {
      const searchParams = new URLSearchParams({
        search: value.trim(),
      })
      router.push(`/questions?${searchParams.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          className="input pl-9"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
      </div>
    </form>
  )
} 