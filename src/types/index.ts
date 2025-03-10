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
} 