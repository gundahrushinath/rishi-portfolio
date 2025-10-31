import express from 'express';
import { 
  getAllRolePermissions,
  getRolePermissions,
  updateAllRolePermissions,
  updateRolePermissions,
  resetRolePermissions
} from '../controllers/roleController';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = express.Router();

// Protect all role routes - only admins can manage roles
router.use(authMiddleware);
router.use(requireAdmin);

// Get all role permissions
router.get('/permissions', getAllRolePermissions);

// Get permissions for a specific role
router.get('/:role/permissions', getRolePermissions);

// Update all role permissions at once
router.put('/permissions', updateAllRolePermissions);

// Update permissions for a specific role
router.put('/:role/permissions', updateRolePermissions);

// Reset all permissions to defaults
router.post('/permissions/reset', resetRolePermissions);

export default router;
