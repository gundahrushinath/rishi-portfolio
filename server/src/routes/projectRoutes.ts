import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for the authenticated user
router.get('/', requirePermission(Permission.PROJECT_READ), getProjects);

// Create a new project
router.post('/', requirePermission(Permission.PROJECT_CREATE), createProject);

// Get a specific project by ID
router.get('/:id', requirePermission(Permission.PROJECT_READ), getProjectById);

// Update a project
router.put('/:id', requirePermission(Permission.PROJECT_UPDATE), updateProject);

// Delete a project
router.delete('/:id', requirePermission(Permission.PROJECT_DELETE), deleteProject);

export default router;
