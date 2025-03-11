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
}
