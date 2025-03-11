import { Metadata } from 'next'
import Link from 'next/link'
import { QuestionList } from '@/components/questions/question-list'
import { QuestionFilter } from '@/components/questions/question-filter'
import { SearchInput } from '@/components/ui/search-input'

export const metadata: Metadata = {
  title: '질문 목록',
}

interface PageProps {
  searchParams: {
    page?: string
    sort?: string
    filter?: string
    search?: string
    tag?: string
  }
}

export default function QuestionsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'latest'
  const filter = searchParams.filter || 'all'
  const search = searchParams.search || ''
  const tag = searchParams.tag || ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">질문 목록</h1>
        <Link href="/questions/new" className="btn btn-primary">
          질문하기
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="질문 검색..."
          className="flex-1"
          defaultValue={search}
        />
        <QuestionFilter
          sort={sort}
          filter={filter}
          tag={tag}
        />
      </div>

      <QuestionList
        page={page}
        sort={sort}
        filter={filter}
        search={search}
        tag={tag}
      />
    </div>
  )
} 