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
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notes for the authenticated user
router.get('/', requirePermission(Permission.NOTE_READ), getNotes);

// Create a new note
router.post('/', requirePermission(Permission.NOTE_CREATE), createNote);

// Get a specific note by ID
router.get('/:id', requirePermission(Permission.NOTE_READ), getNoteById);

// Update a note
router.put('/:id', requirePermission(Permission.NOTE_UPDATE), updateNote);

// Delete a note
router.delete('/:id', requirePermission(Permission.NOTE_DELETE), deleteNote);

// Duplicate a note (requires both read and create permissions)
router.post('/:id/duplicate', requirePermission(Permission.NOTE_READ, Permission.NOTE_CREATE), duplicateNote);

export default router;
