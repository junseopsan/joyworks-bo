'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

interface QuestionListProps {
  page: number
  sort: string
  filter: string
  search: string
  tag: string
}

export function QuestionList({ page, sort, filter, search, tag }: QuestionListProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true)

      try {
        let query = supabase
          .from('questions')
          .select(`
            *,
            author:profiles(*),
            answers(count),
            tags:question_tags(*)
          `)

        // 검색어가 있는 경우
        if (search) {
          query = query.textSearch('title', search, {
            type: 'websearch',
            config: 'english',
          })
        }

        // 태그 필터링
        if (tag) {
          query = query.contains('tags', [{ name: tag }])
        }

        // 필터링
        switch (filter) {
          case 'no-answer':
            query = query.eq('answers.count', 0)
            break
          case 'has-answer':
            query = query.gt('answers.count', 0)
            break
        }

        // 정렬
        switch (sort) {
          case 'latest':
            query = query.order('created_at', { ascending: false })
            break
          case 'oldest':
            query = query.order('created_at', { ascending: true })
            break
          case 'most-viewed':
            query = query.order('view_count', { ascending: false })
            break
          case 'most-answered':
            query = query.order('answers.count', { ascending: false })
            break
        }

        // 페이지네이션
        const start = (page - 1) * ITEMS_PER_PAGE
        const end = start + ITEMS_PER_PAGE - 1
        query = query.range(start, end)

        const { data: questions, error, count } = await query

        if (error) throw error

        setQuestions(questions || [])
        setTotalCount(count || 0)
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [page, sort, filter, search, tag])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-lg border p-4"
          >
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-6 w-16 bg-gray-200 rounded-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">질문을 찾을 수 없습니다</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          다른 검색어나 필터를 사용해보세요
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {questions.map((question) => (
          <Link
            key={question.id}
            href={`/questions/${question.id}`}
            className="block rounded-lg border p-4 hover:border-foreground transition-colors"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{question.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {question.content}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-x-4 text-sm text-muted-foreground">
              <span>{question.author?.name}</span>
              <span>조회 {question.view_count}</span>
              <span>답변 {question.answers?.[0]?.count || 0}</span>
              <div className="flex gap-2">
                {question.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1
            const isCurrentPage = pageNumber === page
            const href = new URL(window.location.href)
            href.searchParams.set('page', pageNumber.toString())

            return (
              <Link
                key={pageNumber}
                href={href.toString()}
                className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-3 text-sm ${
                  isCurrentPage
                    ? 'border-foreground bg-foreground text-background'
                    : 'hover:bg-accent'
                }`}
              >
                {pageNumber}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
} 