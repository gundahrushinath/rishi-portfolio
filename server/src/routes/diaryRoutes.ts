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

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all diary entries for the authenticated user
router.get('/', getDiaries);

// Create a new diary entry
router.post('/', createDiary);

// Get mood statistics
router.get('/stats/mood', getMoodStats);

// Get a specific diary entry by ID
router.get('/:id', getDiaryById);

// Update a diary entry
router.put('/:id', updateDiary);

// Delete a diary entry
router.delete('/:id', deleteDiary);

export default router;
