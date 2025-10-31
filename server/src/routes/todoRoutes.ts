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
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all todos for the authenticated user
router.get('/', requirePermission(Permission.TODO_READ), getTodos);

// Create a new todo
router.post('/', requirePermission(Permission.TODO_CREATE), createTodo);

// Get statistics
router.get('/stats', requirePermission(Permission.TODO_READ), getStatistics);

// Get a specific todo by ID
router.get('/:id', requirePermission(Permission.TODO_READ), getTodoById);

// Update a todo
router.put('/:id', requirePermission(Permission.TODO_UPDATE), updateTodo);

// Delete a todo
router.delete('/:id', requirePermission(Permission.TODO_DELETE), deleteTodo);

// Update subtask status
router.patch('/:id/subtasks/:subtaskId', requirePermission(Permission.TODO_UPDATE), updateSubtask);

export default router;
