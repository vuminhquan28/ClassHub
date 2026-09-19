import { Response } from 'express';
import { db } from '../config/db.js';
import { Assignment, Submission } from '../types/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getAssignmentsByClass = (req: AuthenticatedRequest, res: Response) => {
  const { classId } = req.params;
  const assignments = db.assignments.filter(a => a.classId === classId);
  res.json({ success: true, count: assignments.length, assignments });
};

export const createAssignment = (req: AuthenticatedRequest, res: Response): any => {
  const { classId, title, description, dueDate, maxPoints } = req.body;

  if (!classId || !title) {
    return res.status(400).json({ success: false, message: 'ClassId và Tiêu đề bài tập là bắt buộc' });
  }

  const newAssignment: Assignment = {
    id: `asg_${Date.now()}`,
    classId,
    title,
    description: description || '',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    maxPoints: Number(maxPoints) || 10,
    createdAt: new Date().toISOString()
  };

  db.assignments.unshift(newAssignment);

  return res.status(201).json({
    success: true,
    message: 'Giao bài tập mới thành công',
    assignment: newAssignment
  });
};

export const submitAssignment = (req: AuthenticatedRequest, res: Response): any => {
  const { assignmentId, content, fileUrl } = req.body;

  if (!assignmentId) {
    return res.status(400).json({ success: false, message: 'Assignment ID là bắt buộc' });
  }

  const newSubmission: Submission = {
    id: `sub_${Date.now()}`,
    assignmentId,
    studentId: req.user?.id || 'usr_2',
    studentName: req.user?.name || 'Học sinh',
    content: content || '',
    fileUrl: fileUrl || null,
    submittedAt: new Date().toISOString(),
    grade: null,
    feedback: null
  };

  db.submissions.unshift(newSubmission);

  return res.status(201).json({
    success: true,
    message: 'Nộp bài tập thành công!',
    submission: newSubmission
  });
};
