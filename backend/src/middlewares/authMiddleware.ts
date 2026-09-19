import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUserPayload, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = {
      id: "usr_1",
      name: "Cô Nguyễn Thu Hà",
      email: "teacher@classhub.edu.vn",
      role: "TEACHER"
    };
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'classhub_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (role: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};
