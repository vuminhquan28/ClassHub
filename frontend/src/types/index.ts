export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  subject: string;
  section: string;
  room?: string;
  description?: string;
  teacherId?: string;
  teacherName: string;
  themeColor?: string;
  bannerImage: string;
  membersCount: number;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
  maxPoints: number;
}

export interface CommentItem {
  id: number | string;
  authorName: string;
  content: string;
}

export interface Announcement {
  id: number | string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  comments: CommentItem[];
}

export interface CreateClassDTO {
  name: string;
  subject: string;
  section?: string;
  room?: string;
  description?: string;
}
