import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
  duplicateNote,
} from '../controllers/noteController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notes for the authenticated user
router.get('/', getNotes);

// Create a new note
router.post('/', createNote);

// Get a specific note by ID
router.get('/:id', getNoteById);

// Update a note
router.put('/:id', updateNote);

// Delete a note
router.delete('/:id', deleteNote);

// Duplicate a note
router.post('/:id/duplicate', duplicateNote);

export default router;
