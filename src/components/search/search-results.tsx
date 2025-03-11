'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

interface SearchResultsProps {
  initialResults?: Question[]
}

export function SearchResults({ initialResults = [] }: SearchResultsProps) {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Question[]>(initialResults)
  const [isLoading, setIsLoading] = useState(false)
  const query = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const sort = searchParams.get('sort') || 'recent'

  useEffect(() => {
    async function fetchResults() {
      if (!query && !tag) {
        setResults([])
        return
      }

      setIsLoading(true)

      try {
        let queryBuilder = supabase
          .from('questions')
          .select('*, tags:question_tags(*), author:profiles(*)')

        if (query) {
          queryBuilder = queryBuilder.ilike('title', `%${query}%`)
        }

        if (tag) {
          queryBuilder = queryBuilder.eq('question_tags.name', tag)
        }

        switch (sort) {
          case 'views':
            queryBuilder = queryBuilder.order('view_count', { ascending: false })
            break
          case 'answers':
            queryBuilder = queryBuilder.order('answer_count', { ascending: false })
            break
          default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false })
        }

        const { data, error } = await queryBuilder.limit(20)

        if (error) throw error

        setResults(data || [])
      } catch (error) {
        console.error('Error fetching search results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, tag, sort])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-lg border p-4"
          >
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">검색 결과가 없습니다</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          다른 검색어나 태그로 시도해보세요
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((question) => (
        <Link
          key={question.id}
          href={`/questions/${question.id}`}
          className="block rounded-lg border p-4 hover:border-foreground transition-colors"
        >
          <h3 className="font-medium">{question.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {question.content}
          </p>
          <div className="mt-2 flex items-center gap-x-4 text-sm text-muted-foreground">
            <span>조회수 {question.view_count}</span>
            <span>답변 {question.answer_count}</span>
            <span>
              {new Date(question.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            {question.tags?.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
} 