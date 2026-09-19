import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import classRoutes from './routes/class.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Status Route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'ClassHub API Server (TypeScript)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);

// Error Handling Middleware
app.use(errorHandler as any);

app.listen(PORT, () => {
  console.log(`🚀 [ClassHub TypeScript Backend] Server is running on http://localhost:${PORT}`);
});
