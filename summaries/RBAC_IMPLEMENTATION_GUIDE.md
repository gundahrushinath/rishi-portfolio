# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This application implements a comprehensive Role-Based Access Control (RBAC) system that manages user permissions across all features. The system is designed to be flexible, scalable, and easy to maintain.

## Table of Contents

1. [User Roles](#user-roles)
2. [Permissions](#permissions)
3. [Server-Side Implementation](#server-side-implementation)
4. [Client-Side Implementation](#client-side-implementation)
5. [Usage Examples](#usage-examples)
6. [Migration Guide](#migration-guide)

---

## User Roles

The application supports three hierarchical roles:

### 1. **ADMIN**
- Full access to all features
- Can read, create, update, and delete all resources
- Can manage other users
- Has access to all admin-only features

### 2. **USER** (Default Role)
- Standard access for authenticated users
- Can manage their own resources (projects, notes, diary, todos, resources)
- Cannot access admin features
- Cannot view or modify other users' data

### 3. **GUEST**
- Limited read-only access
- Can view public or shared resources
- Cannot create, update, or delete any content
- Cannot access settings

---

## Permissions

Permissions are granular and resource-specific. Each permission follows the format: `resource:action`.

### Permission Categories

#### Project Permissions
- `PROJECT_CREATE` - Create new projects
- `PROJECT_READ` - View projects
- `PROJECT_UPDATE` - Edit projects
- `PROJECT_DELETE` - Delete projects
- `PROJECT_READ_ALL` - View all users' projects (admin only)

#### Note Permissions
- `NOTE_CREATE` - Create new notes
- `NOTE_READ` - View notes
- `NOTE_UPDATE` - Edit notes
- `NOTE_DELETE` - Delete notes
- `NOTE_READ_ALL` - View all users' notes (admin only)

#### Diary Permissions
- `DIARY_CREATE` - Create diary entries
- `DIARY_READ` - View diary entries
- `DIARY_UPDATE` - Edit diary entries
- `DIARY_DELETE` - Delete diary entries
- `DIARY_READ_ALL` - View all users' diary entries (admin only)

#### Todo Permissions
- `TODO_CREATE` - Create todos
- `TODO_READ` - View todos
- `TODO_UPDATE` - Edit todos
- `TODO_DELETE` - Delete todos
- `TODO_READ_ALL` - View all users' todos (admin only)

#### Resource Permissions
- `RESOURCE_CREATE` - Create resources
- `RESOURCE_READ` - View resources
- `RESOURCE_UPDATE` - Edit resources
- `RESOURCE_DELETE` - Delete resources
- `RESOURCE_READ_ALL` - View all users' resources (admin only)

#### User Management Permissions
- `USER_READ` - View own profile
- `USER_UPDATE` - Update own profile
- `USER_DELETE` - Delete own account
- `USER_READ_ALL` - View all users (admin only)
- `USER_UPDATE_ALL` - Update any user (admin only)
- `USER_DELETE_ALL` - Delete any user (admin only)

#### Settings Permissions
- `SETTINGS_READ` - View settings
- `SETTINGS_UPDATE` - Update settings

---

## Server-Side Implementation

### 1. User Model

The `User` model now includes a `role` field:

```typescript
// server/src/models/User.ts
import { UserRole } from '../types/rbac';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;  // New field
  // ... other fields
}
```

### 2. RBAC Middleware

#### `requireRole(...roles: UserRole[])`
Checks if the authenticated user has one of the specified roles.

```typescript
// Usage in routes
router.get('/admin', authMiddleware, requireRole(UserRole.ADMIN), adminController);
```

#### `requirePermission(...permissions: Permission[])`
Checks if the user has ALL specified permissions.

```typescript
// Usage in routes
router.post('/', authMiddleware, requirePermission(Permission.PROJECT_CREATE), createProject);
```

#### `requireAnyPermission(...permissions: Permission[])`
Checks if the user has ANY of the specified permissions.

```typescript
// Usage in routes
router.get('/', authMiddleware, requireAnyPermission(
  Permission.PROJECT_READ, 
  Permission.PROJECT_READ_ALL
), getProjects);
```

#### Predefined Middleware
- `requireAdmin` - Allows admin access only
- `requireUser` - Allows user and admin access (excludes guests)

### 3. Protected Routes

All resource routes are now protected with permission checks:

```typescript
// server/src/routes/projectRoutes.ts
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

router.get('/', authMiddleware, requirePermission(Permission.PROJECT_READ), getProjects);
router.post('/', authMiddleware, requirePermission(Permission.PROJECT_CREATE), createProject);
router.put('/:id', authMiddleware, requirePermission(Permission.PROJECT_UPDATE), updateProject);
router.delete('/:id', authMiddleware, requirePermission(Permission.PROJECT_DELETE), deleteProject);
```

### 4. Auth Middleware Enhancement

The auth middleware now includes role information:

```typescript
// server/src/middleware/auth.ts
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;  // Role is now included
  };
}
```

---

## Client-Side Implementation

### 1. User Model with RBAC

```typescript
// client/models/user.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;  // Role field
  // ... other fields
}
```

### 2. Permission Hooks

#### `usePermission(permission: Permission)`
Check if the current user has a specific permission.

```tsx
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';

const canEdit = usePermission(Permission.PROJECT_UPDATE);
```

#### `useAnyPermission(...permissions: Permission[])`
Check if the user has any of the given permissions.

```tsx
const canManage = useAnyPermission(
  Permission.PROJECT_UPDATE, 
  Permission.PROJECT_DELETE
);
```

#### `useAllPermissions(...permissions: Permission[])`
Check if the user has all of the given permissions.

```tsx
const canFullyManage = useAllPermissions(
  Permission.PROJECT_UPDATE, 
  Permission.PROJECT_DELETE
);
```

#### `useRole(role: UserRole)`
Check if the user has a specific role.

```tsx
const isAdmin = useRole(UserRole.ADMIN);
```

#### `useAnyRole(...roles: UserRole[])`
Check if the user has any of the given roles.

```tsx
const canAccess = useAnyRole(UserRole.ADMIN, UserRole.USER);
```

### 3. Permission Guard Components

#### `PermissionGuard`
Conditionally render children based on a single permission.

```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

<PermissionGuard permission={Permission.PROJECT_UPDATE}>
  <EditButton />
</PermissionGuard>
```

#### `AnyPermissionGuard`
Render if user has ANY of the given permissions.

```tsx
<AnyPermissionGuard permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}>
  <ManageButtons />
</AnyPermissionGuard>
```

#### `AllPermissionsGuard`
Render if user has ALL of the given permissions.

```tsx
<AllPermissionsGuard permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}>
  <FullControlPanel />
</AllPermissionsGuard>
```

#### `RoleGuard`
Conditionally render based on user role.

```tsx
import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

<RoleGuard role={UserRole.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

#### `AnyRoleGuard`
Render if user has ANY of the given roles.

```tsx
<AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>
  <UserContent />
</AnyRoleGuard>
```

### 4. With Fallback Content

All guard components support optional fallback content:

```tsx
<PermissionGuard 
  permission={Permission.PROJECT_UPDATE}
  fallback={<p>You don't have permission to edit.</p>}
>
  <EditButton />
</PermissionGuard>
```

---

## Usage Examples

### Example 1: Protecting a Route Component

```tsx
// app/(root)/admin/page.tsx
'use client';

import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export default function AdminPage() {
  return (
    <RoleGuard 
      role={UserRole.ADMIN}
      fallback={
        <div>
          <h1>Access Denied</h1>
          <p>You need admin privileges to access this page.</p>
        </div>
      }
    >
      <AdminDashboard />
    </RoleGuard>
  );
}
```

### Example 2: Conditional Button Rendering

```tsx
// components/ProjectCard.tsx
'use client';

import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';

export function ProjectCard({ project }) {
  const canEdit = usePermission(Permission.PROJECT_UPDATE);
  const canDelete = usePermission(Permission.PROJECT_DELETE);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {project.description}
      </CardContent>
      <CardFooter>
        {canEdit && <Button onClick={handleEdit}>Edit</Button>}
        {canDelete && <Button onClick={handleDelete}>Delete</Button>}
      </CardFooter>
    </Card>
  );
}
```

### Example 3: Complex Permission Logic

```tsx
// components/ResourceManager.tsx
'use client';

import { useAllPermissions, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';

export function ResourceManager() {
  const canFullyManage = useAllPermissions(
    Permission.RESOURCE_CREATE,
    Permission.RESOURCE_UPDATE,
    Permission.RESOURCE_DELETE
  );
  
  const isAdmin = useRole(UserRole.ADMIN);
  
  return (
    <div>
      {canFullyManage ? (
        <FullManagementInterface />
      ) : (
        <ReadOnlyInterface />
      )}
      
      {isAdmin && <AdminTools />}
    </div>
  );
}
```

### Example 4: Navigation Menu with Role-Based Items

```tsx
// components/NavigationMenu.tsx
'use client';

import { AnyRoleGuard, RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export function NavigationMenu() {
  return (
    <nav>
      <AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>
        <NavItem href="/dashboard">Dashboard</NavItem>
        <NavItem href="/projects">Projects</NavItem>
        <NavItem href="/notes">Notes</NavItem>
      </AnyRoleGuard>
      
      <RoleGuard role={UserRole.ADMIN}>
        <NavItem href="/admin">Admin Panel</NavItem>
        <NavItem href="/users">User Management</NavItem>
      </RoleGuard>
    </nav>
  );
}
```

---

## Migration Guide

### For Existing Users

All existing users will be assigned the `USER` role by default. This is configured in the User schema:

```typescript
role: {
  type: String,
  enum: Object.values(UserRole),
  default: UserRole.USER  // Default role
}
```

### Creating an Admin User

To create an admin user, you can either:

1. **Via Database**: Update a user's role directly in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Via API**: Create an admin endpoint (protected) to promote users:
   ```typescript
   // server/src/controllers/userController.ts
   export const promoteToAdmin = async (req: Request, res: Response) => {
     const { userId } = req.body;
     await User.findByIdAndUpdate(userId, { role: UserRole.ADMIN });
     res.json({ message: 'User promoted to admin' });
   };
   ```

### Testing RBAC

1. **Create test users with different roles**:
   ```bash
   # USER role (default)
   POST /api/auth/signup
   {
     "email": "user@test.com",
     "password": "password123",
     "name": "Test User"
   }
   
   # Manually set GUEST role in database
   # Manually set ADMIN role in database
   ```

2. **Test permissions**:
   - Login with different users
   - Try to access protected routes
   - Verify proper permission checks

3. **Check API responses**:
   - 401: Authentication required
   - 403: Insufficient permissions
   - 200: Success

---

## Best Practices

### 1. Always Use Middleware on Backend Routes
```typescript
// ✅ Good
router.post('/', authMiddleware, requirePermission(Permission.PROJECT_CREATE), createProject);

// ❌ Bad
router.post('/', createProject);  // No permission check
```

### 2. Use Guard Components for UI Elements
```tsx
// ✅ Good
<PermissionGuard permission={Permission.PROJECT_DELETE}>
  <DeleteButton />
</PermissionGuard>

// ❌ Bad - security through obscurity
{!isGuest && <DeleteButton />}  // UI only, no backend check
```

### 3. Combine Frontend and Backend Protection
- Frontend guards improve UX (hide unavailable features)
- Backend middleware ensures security (enforce permissions)
- Never rely on frontend checks alone!

### 4. Use Specific Permissions Over Role Checks
```typescript
// ✅ Good - flexible and scalable
if (usePermission(Permission.PROJECT_UPDATE)) { ... }

// ⚠️ Less flexible
if (useRole(UserRole.ADMIN)) { ... }
```

### 5. Log Permission Denials
```typescript
// server/src/middleware/rbac.ts
if (!hasAllPermissions) {
  console.warn('Permission denied:', {
    userId: authReq.user.id,
    requiredPermissions: permissions,
    userRole: authReq.user.role
  });
  return res.status(403).json({ message: 'Access denied' });
}
```

---

## Troubleshooting

### Issue: User has wrong role
**Solution**: Check database and ensure role field is set correctly:
```javascript
db.users.find({ email: "user@example.com" }, { role: 1 })
```

### Issue: Permission denied but should have access
**Solution**: Verify role-permission mapping in `types/rbac.ts`

### Issue: Frontend shows option but backend denies
**Solution**: This is expected behavior. Frontend guards are for UX only. Backend middleware is the source of truth.

### Issue: Auth middleware not including role
**Solution**: Check that auth middleware queries user.role from database:
```typescript
const user = await User.findById(decoded.userId).select('role');
```

---

## Summary

This RBAC implementation provides:
- ✅ Three hierarchical user roles (Admin, User, Guest)
- ✅ Granular permission system with 30+ permissions
- ✅ Server-side middleware for route protection
- ✅ Client-side hooks and components for conditional rendering
- ✅ Type-safe implementation with TypeScript
- ✅ Easy to extend and maintain
- ✅ Consistent across frontend and backend

The system is production-ready and follows security best practices!
