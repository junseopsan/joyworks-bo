<<<<<<< HEAD
export interface Profile {
  id: string
  name: string
  phone: string | null
  email: string
  department: string
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  title: string
  content: string
  author_id: string
  view_count: number
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
  comments?: Comment[]
  helpful_marks?: HelpfulMark[]
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
}

export interface HelpfulMark {
  id: string
  answer_id: string
  user_id: string
  created_at: string
  user?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: 'answer' | 'comment' | 'accept' | 'helpful'
  title: string
  content: string
  link: string
  read: boolean
  created_at: string
=======
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  department?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  isNotice: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  answers?: Answer[];
  comments?: Comment[];
  tags?: Tag[];
}

export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  questionId: string;
  question?: Question;
  comments?: Comment[];
  helpfulVotes?: HelpfulVote[];
  helpfulCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  questionId?: string;
  question?: Question;
  answerId?: string;
  answer?: Answer;
}

export interface Tag {
  id: string;
  name: string;
  questions?: Question[];
}

export interface HelpfulVote {
  id: string;
  createdAt: Date;
  userId: string;
  user?: User;
  answerId: string;
  answer?: Answer;
}

export interface Notification {
  id: string;
  type: 'ANSWER' | 'COMMENT' | 'ACCEPTED' | 'HELPFUL';
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  user?: User;
>>>>>>> 77ef2f57fd5a1fd90913989b938bfec3da466817
} 