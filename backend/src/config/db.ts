import { User, ClassItem, Assignment, Submission, Announcement } from '../types/index.js';

interface Database {
  users: User[];
  classes: ClassItem[];
  assignments: Assignment[];
  submissions: Submission[];
  announcements: Announcement[];
}

export const db: Database = {
  users: [
    {
      id: "usr_1",
      name: "Cô Nguyễn Thu Hà",
      email: "teacher@classhub.edu.vn",
      passwordHash: "$2a$10$wN9QdZ9Tj8zQ8J3...mock",
      role: "TEACHER",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr_2",
      name: "Trần Minh Quân",
      email: "student@classhub.edu.vn",
      passwordHash: "$2a$10$wN9QdZ9Tj8zQ8J3...mock",
      role: "STUDENT",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString()
    }
  ],
  classes: [
    {
      id: "cls_101",
      code: "MATH101",
      name: "Toán Hoàn Chỉnh - Lớp 12A1",
      subject: "Toán Học",
      section: "Học Kỳ 1 - 2026",
      room: "Phòng A.204",
      description: "Chương trình Đại số & Hình học nâng cao ôn thi THPT Quốc gia.",
      teacherId: "usr_1",
      teacherName: "Cô Nguyễn Thu Hà",
      themeColor: "indigo",
      bannerImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
      membersCount: 35,
      createdAt: new Date().toISOString()
    },
    {
      id: "cls_102",
      code: "PHYS202",
      name: "Vật Lý Đại Cương & Thí Nghiệm",
      subject: "Vật Lý",
      section: "Khóa Hè 2026",
      room: "Phòng Lab B.102",
      description: "Tìm hiểu cơ học, quang học và các thí nghiệm vật lý tương tác.",
      teacherId: "usr_1",
      teacherName: "Cô Nguyễn Thu Hà",
      themeColor: "cyan",
      bannerImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80",
      membersCount: 28,
      createdAt: new Date().toISOString()
    },
    {
      id: "cls_103",
      code: "ENG301",
      name: "Tiếng Anh Giao Tiếp & IELTS",
      subject: "Ngoại Ngữ",
      section: "Lớp Chiều T3-T5",
      room: "Phòng C.301",
      description: "Rèn luyện kỹ năng Speaking & Writing chuẩn quốc tế.",
      teacherId: "usr_1",
      teacherName: "Cô Nguyễn Thu Hà",
      themeColor: "emerald",
      bannerImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
      membersCount: 42,
      createdAt: new Date().toISOString()
    }
  ],
  assignments: [
    {
      id: "asg_1",
      classId: "cls_101",
      title: "Bài tập tuần 3: Đạo hàm & Tiệm cận hàm số",
      description: "Giải các bài tập trong SGK trang 45-48 và chụp ảnh bài làm nộp dưới dạng PDF hoặc Image.",
      dueDate: "2026-09-25T23:59:00.000Z",
      maxPoints: 10,
      createdAt: new Date().toISOString()
    },
    {
      id: "asg_2",
      classId: "cls_102",
      title: "Báo cáo Thí nghiệm: Con lắc đơn",
      description: "Đo chu kỳ dao động T của con lắc đơn với các chiều dài dây khác nhau và tính g.",
      dueDate: "2026-09-28T23:59:00.000Z",
      maxPoints: 100,
      createdAt: new Date().toISOString()
    }
  ],
  submissions: [
    {
      id: "sub_1",
      assignmentId: "asg_1",
      studentId: "usr_2",
      studentName: "Trần Minh Quân",
      content: "Em gửi bài làm đạo hàm tuần 3 ạ.",
      fileUrl: "https://example.com/bai_lam_quan.pdf",
      submittedAt: new Date().toISOString(),
      grade: 9.5,
      feedback: "Bài làm rất tốt, lập luận chặt chẽ!"
    }
  ],
  announcements: [
    {
      id: "ann_1",
      classId: "cls_101",
      authorName: "Cô Nguyễn Thu Hà",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      content: "Chào cả lớp, tuần này chúng ta sẽ kiểm tra 15 phút phần Tiệm cận hàm số vào tiết thứ 2 nhé!",
      createdAt: new Date().toISOString(),
      comments: [
        {
          id: "cmt_1",
          authorName: "Trần Minh Quân",
          content: "Dạ cô cho tụi em xin file đề ôn tập trước được không ạ?",
          createdAt: new Date().toISOString()
        }
      ]
    }
  ]
};
