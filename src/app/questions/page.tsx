import { Metadata } from 'next'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { SearchInput } from '@/components/search/search-input'
import { SearchFilter } from '@/components/search/search-filter'
import { SearchResults } from '@/components/search/search-results'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

interface PageProps {
  searchParams: {
    q?: string
    tag?: string
    sort?: string
  }
}

export const metadata: Metadata = {
  title: '질문 검색',
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const { q, tag, sort = 'recent' } = searchParams

  let initialResults: Question[] = []

  if (q || tag) {
    let queryBuilder = supabase
      .from('questions')
      .select('*, tags:question_tags(*), author:profiles(*)')

    if (q) {
      queryBuilder = queryBuilder.ilike('title', `%${q}%`)
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

    const { data } = await queryBuilder.limit(20)
    initialResults = data || []
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">질문 검색</h1>
          <Link href="/questions/new" className="btn btn-primary">
            질문하기
          </Link>
        </div>

        <div className="space-y-4">
          <SearchInput />
          <SearchFilter />
        </div>

        <SearchResults initialResults={initialResults} />
      </div>
    </MainLayout>
  )
} 