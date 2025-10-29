import express from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getResourceById,
} from '../controllers/resourceController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all resources for the authenticated user
router.get('/', getResources);

// Create a new resource
router.post('/', createResource);

// Get a specific resource by ID
router.get('/:id', getResourceById);

// Update a resource
router.put('/:id', updateResource);

// Delete a resource
router.delete('/:id', deleteResource);

export default router;
