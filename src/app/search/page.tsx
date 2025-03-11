import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { SearchForm } from '@/components/search/search-form'
import { QuestionList } from '@/components/questions/question-list'
import type { Question } from '@/types'

interface PageProps {
  searchParams: {
    q?: string
    tag?: string
  }
}

export const metadata: Metadata = {
  title: '검색',
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, tag } = searchParams
  let query = supabase.from('questions').select(
    `
    *,
    author:profiles(*),
    answers(count),
    comments(count),
    tags:question_tags(*)
  `
  )

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,content.ilike.%${q}%`
    )
  }

  if (tag) {
    query = query
      .eq('question_tags.name', tag)
  }

  const { data: questions } = await query
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">검색</h1>
      <SearchForm initialQuery={q} initialTag={tag} />
      <QuestionList questions={questions as Question[]} />
    </div>
  )
} 