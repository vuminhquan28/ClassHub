import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken as any, getMe as any);

export default router;
