'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<Question[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedQuery) {
        setSuggestions([])
        return
      }

      try {
        const { data, error } = await supabase
          .from('questions')
          .select('id, title')
          .ilike('title', `%${debouncedQuery}%`)
          .limit(5)

        if (error) throw error

        setSuggestions(data)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return

    const params = new URLSearchParams(searchParams)
    params.set('q', query)
    router.push(`/questions?${params.toString()}`)
    setIsOpen(false)
  }

  const handleSuggestionClick = (suggestion: Question) => {
    router.push(`/questions/${suggestion.id}`)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="질문 검색..."
          className="w-full rounded-lg border bg-background px-4 py-2 pl-10"
        />
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </form>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-background p-2 shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full rounded-md px-3 py-2 text-left hover:bg-secondary"
            >
              {suggestion.title}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 