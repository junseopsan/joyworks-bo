export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  department?: string
  isAdmin?: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  title: string
  content: string
  author_id: string
  view_count: number
  is_notice?: boolean
  created_at: string
  updated_at: string
  author?: Profile
  tags?: QuestionTag[]
  answers?: Answer[]
  comments?: Comment[]
}

export interface QuestionTag {
  id: string
  question_id: string
  name: string
}

export interface Answer {
  id: string
  question_id: string
  author_id: string
  content: string
  is_accepted: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  author?: Profile
  question?: Question
  comments?: Comment[]
  helpful_marks?: HelpfulMark[]
  count?: number
}

export interface Comment {
  id: string
  content: string
  author_id: string
  parent_type: 'question' | 'answer'
  parent_id: string
  created_at: string
  updated_at: string
  author?: Profile
  question?: Question
  answer?: Answer
}

export interface HelpfulMark {
  id: string
  answer_id: string
  user_id: string
  created_at: string
  user?: Profile
  answer?: Answer
}

export interface Notification {
  id: string
  user_id: string
  type: 'answer' | 'comment' | 'accept' | 'helpful'
  title: string
  content: string
  link: string
  is_read: boolean
  created_at: string
  user?: Profile
} 