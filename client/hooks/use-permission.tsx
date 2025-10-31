'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Permission, UserRole, hasPermission } from '@/models/user';

/**
 * Hook to check user permissions
 * Usage: const canEdit = usePermission(Permission.PROJECT_UPDATE);
 */
export const usePermission = (permission: Permission): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return hasPermission(user.role, permission, user.permissions);
};

/**
 * Hook to check if user has any of the given permissions
 * Usage: const canManage = useAnyPermission(Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE);
 */
export const useAnyPermission = (...permissions: Permission[]): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return permissions.some(permission => hasPermission(user.role, permission, user.permissions));
};

/**
 * Hook to check if user has all of the given permissions
 * Usage: const canFullyManage = useAllPermissions(Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE);
 */
export const useAllPermissions = (...permissions: Permission[]): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return permissions.every(permission => hasPermission(user.role, permission, user.permissions));
};

/**
 * Hook to check if user has a specific role
 * Usage: const isAdmin = useRole(UserRole.ADMIN);
 */
export const useRole = (role: UserRole): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return user.role === role;
};

/**
 * Hook to check if user has any of the given roles
 * Usage: const canAccess = useAnyRole(UserRole.ADMIN, UserRole.USER);
 */
export const useAnyRole = (...roles: UserRole[]): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return roles.includes(user.role);
};
