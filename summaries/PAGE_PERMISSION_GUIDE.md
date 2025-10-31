# Page Permission Protection Guide

## Overview
This guide shows you how to protect pages and components using the RBAC (Role-Based Access Control) system.

## Available Roles
- **ADMIN**: Full access to everything
- **USER**: Standard user with personal data access
- **GUEST**: Limited read-only access

## Available Permissions
See `server/src/types/rbac.ts` for the complete list. Examples:
- `PROJECT_CREATE`, `PROJECT_READ`, `PROJECT_UPDATE`, `PROJECT_DELETE`
- `NOTE_CREATE`, `NOTE_READ`, `NOTE_UPDATE`, `NOTE_DELETE`
- `DIARY_CREATE`, `DIARY_READ`, `DIARY_UPDATE`, `DIARY_DELETE`
- `TODO_CREATE`, `TODO_READ`, `TODO_UPDATE`, `TODO_DELETE`
- `USER_READ_ALL`, `USER_UPDATE_ALL`, `USER_DELETE_ALL`
- etc.

---

## Method 1: Protect Entire Page (Recommended)

### Using Role Check
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

export default function AdminOnlyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard'); // Redirect non-admins
    }
  }, [loading, isAdmin, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <div>Admin-only content</div>;
}
```

### Using Permission Check
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';

export default function CreateProjectPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const canCreate = usePermission(Permission.PROJECT_CREATE);

  useEffect(() => {
    if (!loading && !canCreate) {
      router.push('/projects'); // Redirect if no permission
    }
  }, [loading, canCreate, router]);

  if (loading) return <div>Loading...</div>;
  if (!canCreate) return null;

  return <div>Create Project Form</div>;
}
```

---

## Method 2: Protect All Child Pages with Layout

Create a `layout.tsx` in your protected folder (e.g., `/admin/layout.tsx`):

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin'); // Not logged in
    } else if (!loading && !isAdmin) {
      router.push('/dashboard'); // Not admin
    }
  }, [loading, user, isAdmin, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <>{children}</>;
}
```

Now ALL pages under `/admin/*` are automatically protected!

---

## Method 3: Protect Parts of a Page (Component-Level)

### Using RoleGuard
```tsx
import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Everyone sees this */}
      <p>Welcome to your dashboard!</p>
      
      {/* Only admins see this */}
      <RoleGuard role={UserRole.ADMIN}>
        <Button variant="destructive">Delete All Users</Button>
      </RoleGuard>
    </div>
  );
}
```

### Using PermissionGuard
```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  return (
    <div>
      <h1>Projects</h1>
      
      {/* Only show if user can create projects */}
      <PermissionGuard permission={Permission.PROJECT_CREATE}>
        <Button>Create New Project</Button>
      </PermissionGuard>
      
      {/* Show fallback if no permission */}
      <PermissionGuard 
        permission={Permission.PROJECT_DELETE}
        fallback={<p>You cannot delete projects</p>}
      >
        <Button variant="destructive">Delete Project</Button>
      </PermissionGuard>
    </div>
  );
}
```

### Using AnyRoleGuard (Multiple Roles)
```tsx
import { AnyRoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export default function SettingsPage() {
  return (
    <div>
      {/* Show to admins OR users (not guests) */}
      <AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>
        <Button>Edit Settings</Button>
      </AnyRoleGuard>
    </div>
  );
}
```

---

## Method 4: Using Hooks (Conditional Logic)

```tsx
'use client';

import { usePermission, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';
import { Button } from '@/components/ui/button';

export default function NotesPage() {
  const canCreate = usePermission(Permission.NOTE_CREATE);
  const canDelete = usePermission(Permission.NOTE_DELETE);
  const isAdmin = useRole(UserRole.ADMIN);

  return (
    <div>
      <h1>Notes</h1>
      
      {canCreate && <Button>Create Note</Button>}
      
      {canDelete && <Button variant="destructive">Delete Note</Button>}
      
      {isAdmin && <Button variant="outline">View All Users' Notes</Button>}
    </div>
  );
}
```

---

## Common Patterns

### 1. Admin-Only Pages
```tsx
// app/(root)/admin/users/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

export default function UserManagementPage() {
  const router = useRouter();
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (!isAdmin) router.push('/dashboard');
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return <div>User Management</div>;
}
```

### 2. Feature-Based Protection
```tsx
// app/(root)/projects/create/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';

export default function CreateProjectPage() {
  const router = useRouter();
  const canCreate = usePermission(Permission.PROJECT_CREATE);

  useEffect(() => {
    if (!canCreate) router.push('/projects');
  }, [canCreate, router]);

  if (!canCreate) return null;

  return <div>Create Project Form</div>;
}
```

### 3. Mixed Permissions on One Page
```tsx
export default function DashboardPage() {
  const canCreateProjects = usePermission(Permission.PROJECT_CREATE);
  const canManageUsers = usePermission(Permission.USER_UPDATE_ALL);
  const isAdmin = useRole(UserRole.ADMIN);

  return (
    <div>
      {canCreateProjects && <CreateProjectCard />}
      {canManageUsers && <UserManagementCard />}
      {isAdmin && <SystemSettingsCard />}
    </div>
  );
}
```

---

## Quick Reference

### Hooks
- `useRole(UserRole.ADMIN)` - Check if user has specific role
- `useAnyRole(UserRole.ADMIN, UserRole.USER)` - Check if user has any of these roles
- `usePermission(Permission.PROJECT_CREATE)` - Check single permission
- `useAnyPermission(Permission.PROJECT_CREATE, Permission.PROJECT_UPDATE)` - Check any permission
- `useAllPermissions(Permission.PROJECT_CREATE, Permission.PROJECT_UPDATE)` - Check all permissions

### Components
- `<RoleGuard role={UserRole.ADMIN}>` - Show only to specific role
- `<AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>` - Show to any of these roles
- `<PermissionGuard permission={Permission.PROJECT_CREATE}>` - Show only if has permission
- `<AnyPermissionGuard permissions={[...]}>` - Show if has any permission
- `<AllPermissionsGuard permissions={[...]}>` - Show if has all permissions

---

## Examples in Your App

### Protect Admin Section
```bash
app/
  (root)/
    admin/
      layout.tsx          # ← Add admin protection here
      users/
        page.tsx          # ← Automatically protected
      settings/
        page.tsx          # ← Automatically protected
```

### Protect Individual Page
```bash
app/
  (root)/
    projects/
      create/
        page.tsx          # ← Add permission check here
```

### Protect Components
```bash
components/
  project-actions.tsx     # ← Use PermissionGuard for buttons
  admin-panel.tsx         # ← Use RoleGuard for admin features
```

---

## Testing Permissions

1. **As Admin**: You should see everything
2. **As User**: You should see user features, but not admin controls
3. **As Guest**: You should see only read-only content

To test different roles:
1. Go to `/admin/users`
2. Change a user's role
3. Sign in as that user
4. Check what they can/cannot access

---

## Need Help?

- Check `server/src/types/rbac.ts` for all available permissions
- Check `client/models/user.ts` for frontend permission utilities
- Check `client/hooks/use-permission.tsx` for available hooks
- Check `client/components/auth/PermissionGuard.tsx` for guard components
