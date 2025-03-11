import { QuestionList } from '@/components/admin/question-list'
import { QuestionSearch } from '@/components/admin/question-search'
import { supabase } from '@/lib/supabase'

export default async function QuestionsPage() {
  const { data: questions } = await supabase
    .from('questions')
    .select(`
      *,
      author:profiles(*),
      tags:question_tags(*),
      answers(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">질문/답변 관리</h2>
      </div>

      <QuestionSearch />
      <QuestionList questions={questions || []} />
    </div>
  )
} 