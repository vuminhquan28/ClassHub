import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { Role } from '../generated/prisma/index.js';
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

    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.fullName)}`;
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
        email: user.email,
        role: user.role,
        avatar
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
        email: newUser.email,
        role: newUser.role,
        avatar
      }
    });
  } catch (error: any) {
    console.error('Error in register:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi đăng ký' });
  }
};

export const getMe = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
};
