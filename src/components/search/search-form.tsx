'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchFormProps {
  initialQuery?: string
  initialTag?: string
}

export function SearchForm({ initialQuery = '', initialTag = '' }: SearchFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState(initialQuery)
  const [selectedTag, setSelectedTag] = React.useState(initialTag)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    if (selectedTag) {
      params.set('tag', selectedTag)
    } else {
      params.delete('tag')
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleTagChange = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag('')
    } else {
      setSelectedTag(tag)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input flex-1"
          placeholder="검색어를 입력하세요"
        />
        <button type="submit" className="btn btn-primary">
          검색
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js'].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagChange(tag)}
              className={`badge ${
                selectedTag === tag ? 'badge-primary' : 'badge-secondary'
              }`}
            >
              {tag}
            </button>
          )
        )}
      </div>
    </form>
  )
} 