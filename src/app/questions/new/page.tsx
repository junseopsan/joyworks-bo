import { Metadata } from 'next'
import { QuestionForm } from '@/components/questions/question-form'

export const metadata: Metadata = {
  title: '질문하기',
}

export default function NewQuestionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">질문하기</h1>
        <p className="mt-2 text-muted-foreground">
          동료들에게 궁금한 점을 물어보세요
        </p>
      </div>
      <QuestionForm />
    </div>
  )
} 