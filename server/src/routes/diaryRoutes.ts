import express from 'express';
import {
  getDiaries,
  createDiary,
  updateDiary,
  deleteDiary,
  getDiaryById,
  getMoodStats,
} from '../controllers/diaryController';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all diary entries for the authenticated user
router.get('/', requirePermission(Permission.DIARY_READ), getDiaries);

// Create a new diary entry
router.post('/', requirePermission(Permission.DIARY_CREATE), createDiary);

// Get mood statistics
router.get('/stats/mood', requirePermission(Permission.DIARY_READ), getMoodStats);

// Get a specific diary entry by ID
router.get('/:id', requirePermission(Permission.DIARY_READ), getDiaryById);

// Update a diary entry
router.put('/:id', requirePermission(Permission.DIARY_UPDATE), updateDiary);

// Delete a diary entry
router.delete('/:id', requirePermission(Permission.DIARY_DELETE), deleteDiary);

export default router;
