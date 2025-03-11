<<<<<<< HEAD
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Question } from '@/types'

async function getPopularQuestions() {
  const { data } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      answers(count),
      tags:question_tags(*)
    `)
    .order('view_count', { ascending: false })
    .limit(5)

  return data as (Question & {
    answers: { count: number }[]
  })[]
}

export default async function HomePage() {
  const popularQuestions = await getPopularQuestions()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          사내 질문과 답변 플랫폼
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          동료들과 함께 지식을 공유하고 성장하세요
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/questions" className="btn btn-primary">
            질문 목록 보기
          </Link>
          <Link href="/questions/new" className="btn btn-secondary">
            질문하기
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">인기 질문</h2>
        <div className="grid gap-4">
          {popularQuestions.map((question) => (
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
      </div>
    </div>
  )
=======
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-secondary-50">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            사내 QnA 시스템
          </h1>
          <p className="text-lg text-gray-600 text-center mb-8">
            회사 내부 질문과 답변을 공유하고 협업하는 공간입니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-primary-800 mb-3">질문하기</h2>
              <p className="text-gray-600 mb-4">
                업무 관련 질문을 등록하고 동료들의 답변을 받아보세요.
              </p>
              <Link 
                href="/questions/new" 
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                질문 작성하기
              </Link>
            </div>
            
            <div className="bg-secondary-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-secondary-800 mb-3">답변하기</h2>
              <p className="text-gray-600 mb-4">
                동료들의 질문에 답변하고 지식을 공유해보세요.
              </p>
              <Link 
                href="/questions" 
                className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                질문 목록 보기
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link 
              href="/auth/login" 
              className="inline-block bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-md transition-colors text-center"
            >
              로그인
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-md transition-colors text-center"
            >
              회원가입
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">주요 기능</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              질문 및 답변 작성
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              댓글을 통한 추가 질문
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              도움이 된 답변 표시
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              유사 질문 추천
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
>>>>>>> 77ef2f57fd5a1fd90913989b938bfec3da466817
}
