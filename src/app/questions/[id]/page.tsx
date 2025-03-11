import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QuestionDetail } from '@/components/questions/question-detail'
import { AnswerList } from '@/components/questions/answer-list'
import { AnswerForm } from '@/components/questions/answer-form'
import type { Question } from '@/types'

interface PageProps {
  params: {
    id: string
  }
}

async function getQuestion(id: string) {
  const { data: question, error } = await supabase
    .from('questions')
    .select(
      `
      *,
      author:profiles(*),
      answers(
        *,
        author:profiles(*),
        comments(
          *,
          author:profiles(*)
        ),
        helpful_marks(
          *,
          user:profiles(*)
        )
      ),
      comments(
        *,
        author:profiles(*)
      ),
      tags:question_tags(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !question) {
    return null
  }

  // 조회수 증가
  await supabase
    .from('questions')
    .update({ view_count: (question.view_count || 0) + 1 })
    .eq('id', id)

  return question as Question
}

async function getSimilarQuestions(questionId: string, title: string) {
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id,
      title,
      created_at,
      view_count,
      answers(count)
    `)
    .neq('id', questionId)
    .textSearch('title', title, {
      type: 'websearch',
      config: 'english',
    })
    .limit(5)

  if (error) {
    console.error('Error fetching similar questions:', error)
    return []
  }

  return questions || []
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const question = await getQuestion(params.id)

  if (!question) {
    return {
      title: '질문을 찾을 수 없습니다',
    }
  }

  return {
    title: question.title,
  }
}

export default async function QuestionPage({ params }: PageProps) {
  const question = await getQuestion(params.id)

  if (!question) {
    notFound()
  }

  const similarQuestions = await getSimilarQuestions(params.id, question.title)

  return (
    <div className="space-y-6">
      <QuestionDetail question={question} />
      <AnswerList answers={question.answers} />
      <AnswerForm questionId={question.id} />

      {similarQuestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">유사한 질문</h2>
          <div className="space-y-2">
            {similarQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <a href={`/questions/${q.id}`} className="hover:text-primary">
                  {q.title}
                </a>
                <div className="mt-2 text-sm text-gray-500">
                  <span>조회 {q.view_count}</span>
                  <span className="mx-2">•</span>
                  <span>답변 {q.answers[0].count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 