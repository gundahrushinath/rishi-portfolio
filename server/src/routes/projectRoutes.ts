import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjectStats,
  bulkUpdateProjects,
  bulkDeleteProjects,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for the authenticated user (with filtering, sorting, search)
router.get('/', requirePermission(Permission.PROJECT_READ), getProjects);

// Get project statistics
router.get('/stats', requirePermission(Permission.PROJECT_READ), getProjectStats);

// Create a new project
router.post('/', requirePermission(Permission.PROJECT_CREATE), createProject);

// Bulk update projects
router.patch('/bulk', requirePermission(Permission.PROJECT_UPDATE), bulkUpdateProjects);

// Bulk delete projects
router.delete('/bulk', requirePermission(Permission.PROJECT_DELETE), bulkDeleteProjects);

// Get a specific project by ID
router.get('/:id', requirePermission(Permission.PROJECT_READ), getProjectById);

// Update a project
router.put('/:id', requirePermission(Permission.PROJECT_UPDATE), updateProject);

// Delete a project
router.delete('/:id', requirePermission(Permission.PROJECT_DELETE), deleteProject);

export default router;
