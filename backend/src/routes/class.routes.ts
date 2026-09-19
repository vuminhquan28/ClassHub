import { Router } from 'express';
import { getAllClasses, getClassById, createClass, joinClass } from '../controllers/classController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken as any, getAllClasses as any);
router.get('/:id', authenticateToken as any, getClassById as any);
router.post('/create', authenticateToken as any, createClass as any);
router.post('/join', authenticateToken as any, joinClass as any);

export default router;
