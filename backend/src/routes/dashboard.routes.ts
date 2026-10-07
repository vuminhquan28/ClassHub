import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/summary', authenticateToken as any, getDashboardSummary as any);

export default router;
