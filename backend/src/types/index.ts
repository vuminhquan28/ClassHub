export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  subject: string;
  section: string;
  room?: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  themeColor: string;
  bannerImage: string;
  membersCount: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description?: string;
  dueDate: string;
  maxPoints: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  fileUrl?: string | null;
  submittedAt: string;
  grade?: number | null;
  feedback?: string | null;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  classId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
