import { supabase } from './supabase'
import type { Profile } from '@/types'

interface CreateNotificationParams {
  userId: string
  title: string
  content: string
  link: string
}

export async function createNotification({
  userId,
  title,
  content,
  link,
}: CreateNotificationParams) {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      content,
      link,
      is_read: false,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

export async function createAnswerNotification(
  questionAuthorId: string,
  answerAuthorProfile: Profile,
  questionTitle: string,
  questionId: string
) {
  await createNotification({
    userId: questionAuthorId,
    title: '새로운 답변이 달렸습니다',
    content: `${answerAuthorProfile.name}님이 "${questionTitle}" 질문에 답변을 작성했습니다`,
    link: `/questions/${questionId}`,
  })
}

export async function createCommentNotification(
  parentAuthorId: string,
  commentAuthorProfile: Profile,
  questionTitle: string,
  questionId: string,
  isAnswer: boolean
) {
  await createNotification({
    userId: parentAuthorId,
    title: '새로운 댓글이 달렸습니다',
    content: `${commentAuthorProfile.name}님이 ${
      isAnswer ? '답변' : '질문'
    }에 댓글을 작성했습니다`,
    link: `/questions/${questionId}`,
  })
}

export async function createAcceptNotification(
  answerAuthorId: string,
  questionAuthorProfile: Profile,
  questionTitle: string,
  questionId: string
) {
  await createNotification({
    userId: answerAuthorId,
    title: '답변이 채택되었습니다',
    content: `${questionAuthorProfile.name}님이 "${questionTitle}" 질문의 답변을 채택했습니다`,
    link: `/questions/${questionId}`,
  })
}

export async function createHelpfulNotification(
  answerAuthorId: string,
  userProfile: Profile,
  questionTitle: string,
  questionId: string
) {
  await createNotification({
    userId: answerAuthorId,
    title: '답변이 도움이 되었습니다',
    content: `${userProfile.name}님이 "${questionTitle}" 질문의 답변이 도움이 되었다고 평가했습니다`,
    link: `/questions/${questionId}`,
  })
} 