import { Request, Response, NextFunction } from 'express';
import { UserRole, Permission } from '../types/rbac';
import { AuthRequest } from './auth';
import { getCurrentRolePermissions } from '../controllers/roleController';

/**
 * Get current permissions for a role (uses dynamic permissions from roleController)
 */
const getRolePermissions = (role: UserRole): Permission[] => {
  const permissions = getCurrentRolePermissions();
  return permissions[role] || [];
};

/**
 * Middleware to check if user has required role(s)
 * @param roles - Array of allowed roles or single role
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!authReq.user.role) {
      return res.status(403).json({ message: 'User role not defined' });
    }
    
    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.',
        requiredRole: roles,
        userRole: authReq.user.role
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user has required permission(s)
 * @param permissions - Array of required permissions or single permission
 */
export const requirePermission = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!authReq.user.role) {
      return res.status(403).json({ message: 'User role not defined' });
    }
    
    const userPermissions = getRolePermissions(authReq.user.role);
    
    // Check if user has ALL required permissions
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have the required permissions.',
        requiredPermissions: permissions,
        userRole: authReq.user.role
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user has ANY of the required permissions
 * @param permissions - Array of permissions (user needs at least one)
 */
export const requireAnyPermission = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!authReq.user.role) {
      return res.status(403).json({ message: 'User role not defined' });
    }
    
    const userPermissions = getRolePermissions(authReq.user.role);
    
    // Check if user has ANY of the required permissions
    const hasAnyPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAnyPermission) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have any of the required permissions.',
        requiredPermissions: permissions,
        userRole: authReq.user.role
      });
    }
    
    next();
  };
};

/**
 * Middleware to allow admin access only
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware to allow user and admin access (excludes guests)
 */
export const requireUser = requireRole(UserRole.USER, UserRole.ADMIN);

