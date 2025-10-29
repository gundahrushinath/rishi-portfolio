import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
  updateSubtask,
  getStatistics,
} from '../controllers/todoController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', getTodos);

// Create a new todo
router.post('/', createTodo);

// Get statistics
router.get('/stats', getStatistics);

// Get a specific todo by ID
router.get('/:id', getTodoById);

// Update a todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);

// Update subtask status
router.patch('/:id/subtasks/:subtaskId', updateSubtask);

export default router;
