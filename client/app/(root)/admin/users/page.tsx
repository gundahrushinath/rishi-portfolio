'use client';

/**
 * Admin Users Page
 * Accessible only to users with admin role
 */

import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';
import AdminUserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <RoleGuard 
      role={UserRole.ADMIN}
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You need administrator privileges to access this page.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      }
    >
      <AdminUserManagement />
    </RoleGuard>
  );
}
