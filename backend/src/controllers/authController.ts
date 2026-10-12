import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền email và mật khẩu' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    const avatar = user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.fullName)}`;
    const secret = process.env.JWT_SECRET || 'classhub_super_secret_jwt_key_2026';

    const token = jwt.sign(
      { id: user.id.toString(), name: user.fullName, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id.toString(),
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentCode: user.studentCode,
        lecturerCode: user.lecturerCode,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        avatar,
        address: user.address,
        faculty: user.faculty,
        className: user.className,
        academicTitle: user.academicTitle
      }
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng nhập' });
  }
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, fullName, email, phone, password, role } = req.body;
    const userFullName = (fullName || name || '').trim();

    if (!userFullName || !email || !password || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin (Họ tên, Email, Số điện thoại, Mật khẩu)' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email đã được đăng ký tài khoản khác' });
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone }
    });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại đã được đăng ký tài khoản khác' });
    }

    const userRole: Role = role === 'TEACHER' ? Role.TEACHER : Role.STUDENT;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName: userFullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        role: userRole
      }
    });

    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newUser.fullName)}`;
    const secret = process.env.JWT_SECRET || 'classhub_super_secret_jwt_key_2026';

    const token = jwt.sign(
      { id: newUser.id.toString(), name: newUser.fullName, email: newUser.email, role: newUser.role },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản ClassHub thành công',
      token,
      user: {
        id: newUser.id.toString(),
        name: newUser.fullName,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        studentCode: null,
        lecturerCode: null,
        gender: null,
        dateOfBirth: null,
        avatarUrl: null,
        avatar,
        address: null,
        faculty: null,
        className: null,
        academicTitle: null
      }
    });
  } catch (error: any) {
    console.error('Error in register:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = Number(req.user?.id);
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ success: false, message: 'Người dùng chưa xác thực' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentEnrollments: {
          include: {
            course: true
          }
        },
        teacherCourses: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const avatar = user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.fullName)}`;

    const enrolledCourses = user.studentEnrollments.map((e) => ({
      id: e.course.id,
      code: e.course.code,
      name: e.course.name,
      credits: e.course.credits,
      dayName: e.course.dayName,
      timeSlot: e.course.timeSlot,
      room: e.course.room
    }));

    const teachingCourses = user.teacherCourses.map((tc) => ({
      id: tc.course.id,
      code: tc.course.code,
      name: tc.course.name,
      credits: tc.course.credits,
      dayName: tc.course.dayName,
      timeSlot: tc.course.timeSlot,
      room: tc.course.room
    }));

    return res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        studentCode: user.studentCode,
        lecturerCode: user.lecturerCode,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        avatar,
        address: user.address,
        faculty: user.faculty,
        className: user.className,
        academicTitle: user.academicTitle,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        courses: user.role === 'TEACHER' ? teachingCourses : enrolledCourses
      }
    });
  } catch (error: any) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi tải thông tin cá nhân' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = Number(req.user?.id);
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ success: false, message: 'Người dùng chưa xác thực' });
    }

    const {
      fullName,
      phone,
      gender,
      dateOfBirth,
      avatarUrl,
      address,
      faculty,
      className,
      studentCode,
      lecturerCode,
      academicTitle
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const updateData: any = {};
    if (fullName !== undefined && fullName.trim()) updateData.fullName = fullName.trim();
    if (phone !== undefined && phone.trim()) {
      const phoneOwner = await prisma.user.findFirst({
        where: { phone: phone.trim(), NOT: { id: userId } }
      });
      if (phoneOwner) {
        return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng bởi tài khoản khác' });
      }
      updateData.phone = phone.trim();
    }
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (address !== undefined) updateData.address = address;
    if (faculty !== undefined) updateData.faculty = faculty;
    if (className !== undefined && existingUser.role !== 'TEACHER') updateData.className = className;
    if (studentCode !== undefined && existingUser.role !== 'TEACHER') updateData.studentCode = studentCode;
    if (lecturerCode !== undefined && existingUser.role !== 'STUDENT') updateData.lecturerCode = lecturerCode;
    if (academicTitle !== undefined && existingUser.role !== 'STUDENT') updateData.academicTitle = academicTitle;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        studentEnrollments: { include: { course: true } },
        teacherCourses: { include: { course: true } }
      }
    });

    const avatar = updatedUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(updatedUser.fullName)}`;

    const enrolledCourses = updatedUser.studentEnrollments.map((e) => ({
      id: e.course.id,
      code: e.course.code,
      name: e.course.name,
      credits: e.course.credits,
      dayName: e.course.dayName,
      timeSlot: e.course.timeSlot,
      room: e.course.room
    }));

    const teachingCourses = updatedUser.teacherCourses.map((tc) => ({
      id: tc.course.id,
      code: tc.course.code,
      name: tc.course.name,
      credits: tc.course.credits,
      dayName: tc.course.dayName,
      timeSlot: tc.course.timeSlot,
      room: tc.course.room
    }));

    return res.json({
      success: true,
      message: 'Cập nhật thông tin hồ sơ thành công',
      user: {
        id: updatedUser.id.toString(),
        name: updatedUser.fullName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        studentCode: updatedUser.studentCode,
        lecturerCode: updatedUser.lecturerCode,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
        avatarUrl: updatedUser.avatarUrl,
        avatar,
        address: updatedUser.address,
        faculty: updatedUser.faculty,
        className: updatedUser.className,
        academicTitle: updatedUser.academicTitle,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        courses: updatedUser.role === 'TEACHER' ? teachingCourses : enrolledCourses
      }
    });
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi cập nhật hồ sơ' });
  }
};
