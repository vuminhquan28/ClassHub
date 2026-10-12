import { Router } from 'express';
import { login, register, getMe, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken as any, getMe as any);
router.get('/profile', authenticateToken as any, getMe as any);
router.put('/profile', authenticateToken as any, updateProfile as any);

export default router;
