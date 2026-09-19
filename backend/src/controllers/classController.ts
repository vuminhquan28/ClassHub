import { Response } from 'express';
import { db } from '../config/db.js';
import { ClassItem } from '../types/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getAllClasses = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    count: db.classes.length,
    classes: db.classes
  });
};

export const getClassById = (req: AuthenticatedRequest, res: Response): any => {
  const { id } = req.params;
  const foundClass = db.classes.find(c => c.id === id || c.code === id);

  if (!foundClass) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy lớp học' });
  }

  const classAssignments = db.assignments.filter(a => a.classId === foundClass.id);
  const classAnnouncements = db.announcements.filter(a => a.classId === foundClass.id);

  return res.json({
    success: true,
    class: {
      ...foundClass,
      assignments: classAssignments,
      announcements: classAnnouncements
    }
  });
};

export const createClass = (req: AuthenticatedRequest, res: Response): any => {
  const { name, subject, section, room, description } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ success: false, message: 'Tên lớp học và Môn học là bắt buộc' });
  }

  const newClass: ClassItem = {
    id: `cls_${Date.now()}`,
    code: `CLASS${Math.floor(100 + Math.random() * 900)}`,
    name,
    subject,
    section: section || 'Học kỳ 1 - 2026',
    room: room || 'Phòng Học',
    description: description || '',
    teacherId: req.user?.id || 'usr_1',
    teacherName: req.user?.name || 'Giáo viên ClassHub',
    themeColor: ['indigo', 'emerald', 'cyan', 'amber', 'rose'][Math.floor(Math.random() * 5)],
    bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    membersCount: 1,
    createdAt: new Date().toISOString()
  };

  db.classes.unshift(newClass);

  return res.status(201).json({
    success: true,
    message: 'Tạo lớp học mới thành công',
    class: newClass
  });
};

export const joinClass = (req: AuthenticatedRequest, res: Response): any => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập Mã lớp học' });
  }

  const targetClass = db.classes.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!targetClass) {
    return res.status(404).json({ success: false, message: 'Mã lớp học không tồn tại' });
  }

  targetClass.membersCount += 1;

  return res.json({
    success: true,
    message: `Đã tham gia lớp học ${targetClass.name} thành công!`,
    class: targetClass
  });
};
