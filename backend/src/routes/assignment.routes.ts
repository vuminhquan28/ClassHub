import { Router } from 'express';
import { getAssignmentsByClass, createAssignment, submitAssignment } from '../controllers/assignmentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/class/:classId', authenticateToken as any, getAssignmentsByClass as any);
router.post('/create', authenticateToken as any, createAssignment as any);
router.post('/submit', authenticateToken as any, submitAssignment as any);

export default router;
