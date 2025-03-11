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

  return (
    <div className="space-y-6">
      <QuestionDetail question={question} />
      <AnswerList answers={question.answers} />
      <AnswerForm questionId={question.id} />
    </div>
  )
} 