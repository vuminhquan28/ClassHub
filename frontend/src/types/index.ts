export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface CourseSummary {
  id: number;
  code: string;
  name: string;
  credits: number;
  dayName: string;
  timeSlot: string;
  room: string;
}

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string | null;
  studentCode?: string | null;
  lecturerCode?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  faculty?: string | null;
  className?: string | null;
  academicTitle?: string | null;
  courses?: CourseSummary[];
  createdAt?: string;
  updatedAt?: string;
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
