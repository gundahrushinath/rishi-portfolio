import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all projects for the authenticated user
router.get('/', getProjects);

// Create a new project
router.post('/', createProject);

// Get a specific project by ID
router.get('/:id', getProjectById);

// Update a project
router.put('/:id', updateProject);

// Delete a project
router.delete('/:id', deleteProject);

export default router;
