import express from 'express';
import {
  getUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStatistics,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/profile', requirePermission(Permission.USER_READ), getUserProfile);

// Admin-only routes
router.get('/', requireAdmin, getAllUsers);
router.get('/statistics', requireAdmin, getUserStatistics);
router.put('/:userId/role', requireAdmin, updateUserRole);
router.delete('/:userId', requireAdmin, deleteUser);

export default router;
