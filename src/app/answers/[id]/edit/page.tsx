import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AnswerForm } from '@/components/questions/answer-form'
import type { Answer } from '@/types'

interface PageProps {
  params: {
    id: string
  }
}

async function getAnswer(id: string) {
  const { data: answer, error } = await supabase
    .from('answers')
    .select(
      `
      *,
      author:profiles(*),
      question:questions(*)
    `
    )
    .eq('id', id)
    .single()

  if (error || !answer) {
    return null
  }

  return answer as Answer
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const answer = await getAnswer(params.id)

  if (!answer) {
    return {
      title: '답변을 찾을 수 없습니다',
    }
  }

  return {
    title: '답변 수정',
  }
}

export default async function EditAnswerPage({ params }: PageProps) {
  const answer = await getAnswer(params.id)

  if (!answer) {
    notFound()
  }

  const user = (await supabase.auth.getUser()).data.user
  if (!user || user.id !== answer.author_id) {
    redirect('/questions')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">답변 수정</h1>
      <AnswerForm answer={answer} />
    </div>
  )
} 