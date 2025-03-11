import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QuestionForm } from '@/components/questions/question-form'
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
      tags:question_tags(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !question) {
    return null
  }

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
    title: `${question.title} 수정`,
  }
}

export default async function EditQuestionPage({ params }: PageProps) {
  const question = await getQuestion(params.id)

  if (!question) {
    notFound()
  }

  const user = (await supabase.auth.getUser()).data.user
  if (!user || user.id !== question.author_id) {
    redirect('/questions')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">질문 수정</h1>
      <QuestionForm question={question} />
    </div>
  )
} 