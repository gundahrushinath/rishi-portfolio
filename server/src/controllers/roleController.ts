import { Request, Response } from 'express';
import { UserRole, Permission, RolePermissions } from '../types/rbac';

/**
 * Role Management Controller
 * Handles CRUD operations for role permissions
 */

// In-memory store for custom permissions (in production, use database)
let customRolePermissions: Record<UserRole, Permission[]> = { ...RolePermissions };

/**
 * Get permissions for all roles
 * GET /api/roles/permissions
 */
export const getAllRolePermissions = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      permissions: customRolePermissions
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role permissions'
    });
  }
};

/**
 * Get permissions for a specific role
 * GET /api/roles/:role/permissions
 */
export const getRolePermissions = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const permissions = customRolePermissions[role as UserRole];
    
    res.json({
      success: true,
      role,
      permissions
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role permissions'
    });
  }
};

/**
 * Update permissions for all roles
 * PUT /api/roles/permissions
 */
export const updateAllRolePermissions = async (req: Request, res: Response) => {
  try {
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid permissions data'
      });
    }

    // Validate that all roles are present
    const roles = Object.values(UserRole);
    for (const role of roles) {
      if (!permissions[role]) {
        return res.status(400).json({
          success: false,
          message: `Missing permissions for role: ${role}`
        });
      }

      // Validate that permissions are arrays of valid Permission values
      if (!Array.isArray(permissions[role])) {
        return res.status(400).json({
          success: false,
          message: `Permissions for ${role} must be an array`
        });
      }
    }

    // Update custom permissions
    customRolePermissions = { ...permissions };

    res.json({
      success: true,
      message: 'Role permissions updated successfully',
      permissions: customRolePermissions
    });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role permissions'
    });
  }
};

/**
 * Update permissions for a specific role
 * PUT /api/roles/:role/permissions
 */
export const updateRolePermissions = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body;

    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: 'Permissions must be an array'
      });
    }

    // Validate permissions
    const validPermissions = Object.values(Permission);
    for (const perm of permissions) {
      if (!validPermissions.includes(perm as Permission)) {
        return res.status(400).json({
          success: false,
          message: `Invalid permission: ${perm}`
        });
      }
    }

    customRolePermissions[role as UserRole] = permissions;

    res.json({
      success: true,
      message: `Permissions updated for role: ${role}`,
      role,
      permissions: customRolePermissions[role as UserRole]
    });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role permissions'
    });
  }
};

/**
 * Reset permissions to defaults
 * POST /api/roles/permissions/reset
 */
export const resetRolePermissions = async (req: Request, res: Response) => {
  try {
    customRolePermissions = { ...RolePermissions };

    res.json({
      success: true,
      message: 'Role permissions reset to defaults',
      permissions: customRolePermissions
    });
  } catch (error) {
    console.error('Error resetting role permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset role permissions'
    });
  }
};

/**
 * Get helper function to retrieve current permissions (for middleware)
 */
export const getCurrentRolePermissions = (): Record<UserRole, Permission[]> => {
  return customRolePermissions;
};
