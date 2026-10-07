import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getDashboardSummary = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = Number(req.user?.id);
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ success: false, message: 'Người dùng chưa xác thực' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, role: true, phone: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng trong cơ sở dữ liệu' });
    }

    let studentCourses: any[] = [];
    let teacherCourses: any[] = [];
    let announcements: any[] = [];
    let totalCredits = 0;

    if (user.role === 'STUDENT' || user.role === 'ADMIN') {
      const enrollments = await prisma.studentEnrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              prerequisites: {
                include: { prerequisite: true }
              }
            }
          }
        },
        orderBy: [
          { course: { dayOfWeek: 'asc' } },
          { course: { timeSlot: 'asc' } }
        ]
      });

      studentCourses = enrollments.map((e, idx) => {
        totalCredits += e.course.credits;
        return {
          id: `sch_st_${e.course.id}`,
          courseId: e.course.id,
          title: e.course.name.toUpperCase(),
          code: e.course.code,
          credits: e.course.credits,
          dayOfWeek: e.course.dayOfWeek,
          dayName: e.course.dayName,
          timeSlot: e.course.timeSlot,
          room: e.course.room,
          time: `${e.course.dayName} • ${e.course.timeSlot}`,
          completed: idx % 5 === 0,
          roleScope: 'student',
          prerequisites: e.course.prerequisites.map((p) => p.prerequisite.code)
        };
      });
    }

    if (user.role === 'TEACHER' || user.role === 'ADMIN') {
      const tCourses = await prisma.teacherCourse.findMany({
        where: { teacherId: userId },
        include: {
          course: true
        },
        orderBy: [
          { course: { dayOfWeek: 'asc' } },
          { course: { timeSlot: 'asc' } }
        ]
      });

      let tCredits = 0;
      teacherCourses = tCourses.map((tc) => {
        tCredits += tc.course.credits;
        return {
          id: `sch_tc_${tc.course.id}`,
          courseId: tc.course.id,
          title: tc.course.name.toUpperCase(),
          code: tc.course.code,
          credits: tc.course.credits,
          dayOfWeek: tc.course.dayOfWeek,
          dayName: tc.course.dayName,
          timeSlot: tc.course.timeSlot,
          room: tc.course.room,
          time: `${tc.course.dayName} • ${tc.course.timeSlot}`,
          completed: false,
          roleScope: 'teacher'
        };
      });

      if (user.role === 'TEACHER') {
        totalCredits = tCredits;
      }
    }

    // Generate announcements based on enrolled/taught courses
    const activeCoursesList = user.role === 'TEACHER' ? teacherCourses : studentCourses;

    if (activeCoursesList.length > 0) {
      activeCoursesList.slice(0, 4).forEach((c, idx) => {
        announcements.push({
          id: `ann_db_${idx + 1}`,
          title: `Thông báo môn: ${c.code} (${c.title})`,
          subtitle: `Lịch học: ${c.dayName} (${c.timeSlot}) - ${c.room} [${c.credits} tín chỉ]`,
          time: `08:${15 + idx * 10} AM`,
          unread: idx < 2,
          roleScope: user.role.toLowerCase()
        });
      });
    }

    // Default global announcements
    announcements.push({
      id: 'ann_global_1',
      title: 'Lịch thi kết thúc học phần chính thức Học kỳ I (2026 - 2027)',
      subtitle: 'Phòng Đào tạo - Đại học ClassHub',
      time: '09:00 AM',
      unread: false,
      roleScope: 'all'
    });

    return res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      totalCredits,
      schedules: {
        student: studentCourses,
        teacher: teacherCourses
      },
      announcements
    });
  } catch (error: any) {
    console.error('Error in getDashboardSummary:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi tải dữ liệu Dashboard' });
  }
};
