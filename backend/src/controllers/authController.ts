import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { User, UserRole } from '../types/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const login = (req: Request, res: Response): any => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền email và mật khẩu' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'classhub_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  });
};

export const register = (req: Request, res: Response): any => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email đã được đăng ký tài khoản khác' });
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    passwordHash: 'hashed_' + password,
    role: (role as UserRole) || 'STUDENT',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET || 'classhub_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản ClassHub thành công',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    }
  });
};

export const getMe = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
};
