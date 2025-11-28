import express from 'express';
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  getStats,
} from '../controllers/diaryController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getEntries);
router.post('/', createEntry);
router.get('/stats', getStats);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
