'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Question, Answer } from '@/types'

interface ProfileActivityProps {
  userId: string
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActivity() {
      setIsLoading(true)

      try {
        const [questionsResponse, answersResponse] = await Promise.all([
          supabase
            .from('questions')
            .select('*, tags:question_tags(*)')
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('answers')
            .select('*, question:questions(*)')
            .eq('author_id', userId)
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (questionsResponse.error) throw questionsResponse.error
        if (answersResponse.error) throw answersResponse.error

        setQuestions(questionsResponse.data || [])
        setAnswers(answersResponse.data || [])
      } catch (error) {
        console.error('Error fetching activity:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-lg border p-4"
          >
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">최근 질문</h2>
        {questions.length === 0 ? (
          <p className="text-muted-foreground">아직 작성한 질문이 없습니다</p>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link
                key={question.id}
                href={`/questions/${question.id}`}
                className="block rounded-lg border p-4 hover:border-foreground transition-colors"
              >
                <h3 className="font-medium">{question.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {question.content}
                </p>
                <div className="mt-2 flex gap-2">
                  {question.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">최근 답변</h2>
        {answers.length === 0 ? (
          <p className="text-muted-foreground">아직 작성한 답변이 없습니다</p>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <Link
                key={answer.id}
                href={`/questions/${answer.question_id}#answer-${answer.id}`}
                className="block rounded-lg border p-4 hover:border-foreground transition-colors"
              >
                <h3 className="font-medium">{answer.question?.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {answer.content}
                </p>
                <div className="mt-2 flex items-center gap-x-4 text-sm text-muted-foreground">
                  {answer.is_accepted && (
                    <span className="text-green-600">채택된 답변</span>
                  )}
                  <span>도움됨 {answer.helpful_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 