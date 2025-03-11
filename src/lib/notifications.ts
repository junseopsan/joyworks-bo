import { supabase } from '@/lib/supabase'
import type { Question, Answer, Comment } from '@/types'

interface CreateNotificationParams {
  userId: string
  type: 'answer' | 'comment' | 'accept' | 'helpful'
  question?: Question
  answer?: Answer
  comment?: Comment
}

export async function createNotification({
  userId,
  type,
  question,
  answer,
  comment,
}: CreateNotificationParams) {
  let title = ''
  let content = ''
  let link = ''

  switch (type) {
    case 'answer':
      if (!question) throw new Error('Question is required for answer notification')
      title = '새로운 답변'
      content = `질문 "${question.title}"에 새로운 답변이 달렸습니다.`
      link = `/questions/${question.id}`
      break

    case 'comment':
      if (!question && !answer) throw new Error('Question or Answer is required for comment notification')
      if (question) {
        title = '새로운 댓글'
        content = `질문 "${question.title}"에 새로운 댓글이 달렸습니다.`
        link = `/questions/${question.id}`
      } else if (answer) {
        title = '새로운 댓글'
        content = '답변에 새로운 댓글이 달렸습니다.'
        link = `/questions/${answer.question_id}`
      }
      break

    case 'accept':
      if (!answer) throw new Error('Answer is required for accept notification')
      title = '답변 채택'
      content = '회원님의 답변이 채택되었습니다.'
      link = `/questions/${answer.question_id}`
      break

    case 'helpful':
      if (!answer) throw new Error('Answer is required for helpful notification')
      title = '도움이 되는 답변'
      content = '회원님의 답변이 도움이 된다고 표시되었습니다.'
      link = `/questions/${answer.question_id}`
      break

    default:
      throw new Error('Invalid notification type')
  }

  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    content,
    link,
  })

  if (error) {
    throw error
  }
} 