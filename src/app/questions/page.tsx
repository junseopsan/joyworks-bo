import { Metadata } from 'next'
import Link from 'next/link'
import { QuestionList } from '@/components/questions/question-list'
import { QuestionFilter } from '@/components/questions/question-filter'
import { SearchInput } from '@/components/ui/search-input'
import { supabase } from '@/lib/supabase'
import type { QuestionTag } from '@/types'

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

async function getNoticeQuestions() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      tags:question_tags(*)
    `)
    .eq('is_notice', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notice questions:', error)
    return []
  }

  return questions || []
}

export default async function QuestionsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const sort = searchParams.sort || 'latest'
  const filter = searchParams.filter || 'all'
  const search = searchParams.search || ''
  const tag = searchParams.tag || ''

  const noticeQuestions = await getNoticeQuestions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">질문 목록</h1>
        <Link 
          href="/questions/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          질문하기
        </Link>
      </div>

      {noticeQuestions.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-yellow-800 mb-4">공지사항</h2>
          <div className="space-y-4">
            {noticeQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-white border border-yellow-200 rounded-md p-4"
              >
                <div className="flex justify-between">
                  <Link
                    href={`/questions/${question.id}`}
                    className="text-lg font-medium text-yellow-800 hover:underline"
                  >
                    {question.title}
                  </Link>
                  <span className="text-sm text-yellow-600">
                    {new Date(question.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.tags?.map((tag: QuestionTag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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