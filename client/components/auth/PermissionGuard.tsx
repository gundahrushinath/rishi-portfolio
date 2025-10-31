'use client';

import React from 'react';
import { Permission, UserRole } from '@/models/user';
import { usePermission, useRole, useAnyPermission, useAllPermissions, useAnyRole } from '@/hooks/use-permission';

interface ProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface PermissionGuardProps extends ProtectedProps {
  permission: Permission;
}

interface AnyPermissionGuardProps extends ProtectedProps {
  permissions: Permission[];
}

interface AllPermissionsGuardProps extends ProtectedProps {
  permissions: Permission[];
}

interface RoleGuardProps extends ProtectedProps {
  role: UserRole;
}

interface AnyRoleGuardProps extends ProtectedProps {
  roles: UserRole[];
}

/**
 * Component to conditionally render children based on a single permission
 * Usage: <PermissionGuard permission={Permission.PROJECT_UPDATE}>...</PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  fallback = null 
}) => {
  const hasPermission = usePermission(permission);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component to conditionally render children if user has ANY of the given permissions
 * Usage: <AnyPermissionGuard permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}>...</AnyPermissionGuard>
 */
export const AnyPermissionGuard: React.FC<AnyPermissionGuardProps> = ({ 
  children, 
  permissions, 
  fallback = null 
}) => {
  const hasPermission = useAnyPermission(...permissions);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component to conditionally render children if user has ALL of the given permissions
 * Usage: <AllPermissionsGuard permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}>...</AllPermissionsGuard>
 */
export const AllPermissionsGuard: React.FC<AllPermissionsGuardProps> = ({ 
  children, 
  permissions, 
  fallback = null 
}) => {
  const hasPermissions = useAllPermissions(...permissions);
  
  return hasPermissions ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component to conditionally render children based on user role
 * Usage: <RoleGuard role={UserRole.ADMIN}>...</RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  role, 
  fallback = null 
}) => {
  const hasRole = useRole(role);
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
};

/**
 * Component to conditionally render children if user has ANY of the given roles
 * Usage: <AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>...</AnyRoleGuard>
 */
export const AnyRoleGuard: React.FC<AnyRoleGuardProps> = ({ 
  children, 
  roles, 
  fallback = null 
}) => {
  const hasRole = useAnyRole(...roles);
  
  return hasRole ? <>{children}</> : <>{fallback}</>;
};
