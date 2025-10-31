'use client';

import { PageContainer } from '@/components/layout';
import RolePermissionsManager from '@/components/admin/RolePermissionsManager';
import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export default function RolePermissionsPage() {
  return (
    <RoleGuard 
      role={UserRole.ADMIN}
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You need administrator privileges to manage role permissions.
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
      <PageContainer>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Role Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage permissions for each user role. Changes apply to all users with that role.
          </p>
        </div>
        
        <RolePermissionsManager />
      </PageContainer>
    </RoleGuard>
  );
}
