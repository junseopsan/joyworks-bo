<<<<<<< HEAD
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
=======
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { createClient } from '@/lib/supabase-server';

interface Tag {
  id: string;
  name: string;
}

interface TagOnQuestion {
  tag: Tag;
}

interface Question {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  is_notice: boolean;
  author: {
    name: string;
  };
  answers: any[];
  tags?: TagOnQuestion[];
}

async function getQuestions() {
  const supabase = await createClient();
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      answers(count),
      tags:tags_on_questions(tag:tags(*))
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  
  return questions as Question[] || [];
}

async function getPopularQuestions() {
  const supabase = await createClient();
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      answers(count),
      tags:tags_on_questions(tag:tags(*))
    `)
    .order('view_count', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error fetching popular questions:', error);
    return [];
  }
  
  return questions as Question[] || [];
}

async function getNoticeQuestions() {
  const supabase = await createClient();
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      tags:tags_on_questions(tag:tags(*))
    `)
    .eq('is_notice', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notice questions:', error);
    return [];
  }
  
  return questions as Question[] || [];
}

export default async function QuestionsPage() {
  const [questions, popularQuestions, noticeQuestions] = await Promise.all([
    getQuestions(),
    getPopularQuestions(),
    getNoticeQuestions(),
  ]);

  return (
    <MainLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">질문 목록</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              회사 내부 질문 및 답변 시스템
            </p>
          </div>
          <Link
            href="/questions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            질문하기
          </Link>
        </div>

        {noticeQuestions.length > 0 && (
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">공지사항</h2>
            <div className="space-y-4">
              {noticeQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-md p-4"
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
                    {question.tags?.map((tagItem) => (
                      <span
                        key={tagItem.tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {tagItem.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-5 sm:px-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">최근 질문</h2>
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white border border-gray-200 rounded-md p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex justify-between">
                      <Link
                        href={`/questions/${question.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600"
                      >
                        {question.title}
                      </Link>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{question.answers.length} 답변</span>
                        <span>•</span>
                        <span>{question.view_count} 조회</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {question.content}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tagItem) => (
                          <span
                            key={tagItem.tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {tagItem.tag.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {question.author?.name}
                        </span>
                        <span className="ml-2">
                          {new Date(question.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">아직 질문이 없습니다.</p>
                  <Link
                    href="/questions/new"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                  >
                    첫 질문 작성하기
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">인기 질문</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {popularQuestions.length > 0 ? (
                <ul className="space-y-3">
                  {popularQuestions.map((question) => (
                    <li key={question.id}>
                      <Link
                        href={`/questions/${question.id}`}
                        className="block hover:bg-gray-100 p-2 rounded"
                      >
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {question.title}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>{question.answers.length} 답변</span>
                          <span className="mx-1">•</span>
                          <span>{question.view_count} 조회</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-sm text-gray-500">
                  아직 인기 질문이 없습니다.
                </p>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">태그</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {/* 태그 목록은 실제 데이터로 대체 필요 */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    인사
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    회계
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    마케팅
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    개발
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    디자인
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
>>>>>>> 77ef2f57fd5a1fd90913989b938bfec3da466817
} 