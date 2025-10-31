import express from 'express';
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
  getResourceById,
} from '../controllers/resourceController';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all resources for the authenticated user
router.get('/', requirePermission(Permission.RESOURCE_READ), getResources);

// Create a new resource
router.post('/', requirePermission(Permission.RESOURCE_CREATE), createResource);

// Get a specific resource by ID
router.get('/:id', requirePermission(Permission.RESOURCE_READ), getResourceById);

// Update a resource
router.put('/:id', requirePermission(Permission.RESOURCE_UPDATE), updateResource);

// Delete a resource
router.delete('/:id', requirePermission(Permission.RESOURCE_DELETE), deleteResource);

export default router;
