
export enum FeedbackStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export interface Feedback {
  id: string;
  fullName: string;
  phoneNumber: string;
  department: string;
  date: string;
  time: string;
  content: string;
  images: string[];
  status: FeedbackStatus;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface User {
  role: 'PUBLIC' | 'ADMIN';
  username?: string;
}
