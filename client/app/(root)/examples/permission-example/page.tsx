'use client';

import { PermissionGuard, RoleGuard, AnyRoleGuard } from '@/components/auth/PermissionGuard';
import { Permission, UserRole } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout';

/**
 * Example: Page with mixed permissions
 * Different sections visible to different roles
 */
export default function MixedPermissionsPage() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Section 1: Everyone can see this */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Public Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>All authenticated users can see this section.</p>
        </CardContent>
      </Card>

      {/* Section 2: Only users with PROJECT_CREATE permission */}
      <PermissionGuard 
        permission={Permission.PROJECT_CREATE}
        fallback={
          <Card className="mb-4 border-dashed">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                You don't have permission to create projects.
              </p>
            </CardContent>
          </Card>
        }
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You can create new projects.</p>
            <Button>Create Project</Button>
          </CardContent>
        </Card>
      </PermissionGuard>

      {/* Section 3: Only admins can see this */}
      <RoleGuard role={UserRole.ADMIN}>
        <Card className="mb-4 border-red-500">
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Admin-only settings and controls.</p>
            <Button variant="destructive">Delete All Data</Button>
          </CardContent>
        </Card>
      </RoleGuard>

      {/* Section 4: Admins or Users (not guests) */}
      <AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>User Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Available to both admins and regular users.</p>
          </CardContent>
        </Card>
      </AnyRoleGuard>

      {/* Section 5: Multiple permission check */}
      <PermissionGuard permission={Permission.USER_DELETE}>
        <Card className="mb-4 border-yellow-500">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Only users with delete permission can see this.</p>
            <Button variant="destructive">Delete User</Button>
          </CardContent>
        </Card>
      </PermissionGuard>
    </PageContainer>
  );
}
