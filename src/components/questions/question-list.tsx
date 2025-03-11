'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'
import { Pagination } from '@/components/ui/pagination'

interface QuestionListProps {
  page: number
  sort: string
  filter: string
  search: string
  tag: string
}

export function QuestionList({
  page,
  sort,
  filter,
  search,
  tag,
}: QuestionListProps) {
  const router = useRouter()
  const [questions, setQuestions] = React.useState<Question[]>([])
  const [totalPages, setTotalPages] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true)

      try {
        let query = supabase
          .from('questions')
          .select(
            `
            *,
            author:profiles(*),
            answers(count),
            tags:question_tags(*)
          `,
            { count: 'exact' }
          )

        // 검색어 필터링
        if (search) {
          query = query.or(
            `title.ilike.%${search}%,content.ilike.%${search}%`
          )
        }

        // 태그 필터링
        if (tag) {
          query = query.eq('question_tags.name', tag)
        }

        // 상태 필터링
        if (filter === 'unsolved') {
          query = query.eq('is_solved', false)
        } else if (filter === 'solved') {
          query = query.eq('is_solved', true)
        }

        // 정렬
        if (sort === 'latest') {
          query = query.order('created_at', { ascending: false })
        } else if (sort === 'oldest') {
          query = query.order('created_at', { ascending: true })
        } else if (sort === 'most_viewed') {
          query = query.order('view_count', { ascending: false })
        } else if (sort === 'most_answered') {
          query = query.order('answers.count', { ascending: false })
        }

        // 페이지네이션
        const itemsPerPage = 10
        const from = (page - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        const { data, count, error } = await query.range(from, to)

        if (error) {
          throw error
        }

        setQuestions(data as Question[])
        setTotalPages(Math.ceil((count || 0) / itemsPerPage))
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [page, sort, filter, search, tag])

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams({
      page: newPage.toString(),
      sort,
      filter,
      ...(search && { search }),
      ...(tag && { tag }),
    })

    router.push(`/questions?${searchParams.toString()}`)
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (questions.length === 0) {
    return <div>질문이 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {questions.map((question) => (
          <Link
            key={question.id}
            href={`/questions/${question.id}`}
            className="group relative rounded-lg border p-4 hover:border-foreground"
          >
            <h3 className="font-semibold text-foreground group-hover:underline">
              {question.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {question.content}
            </p>
            <div className="mt-4 flex items-center gap-x-4 text-sm text-muted-foreground">
              <span>{question.author?.name}</span>
              <span>조회 {question.view_count}</span>
              <span>답변 {question.answers[0].count}</span>
              <div className="flex gap-2">
                {question.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="badge badge-secondary"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
} 