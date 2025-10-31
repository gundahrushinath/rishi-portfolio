# Managing RBAC from Frontend - Practical Guide

## 🎯 Overview

This guide shows you how to use RBAC in your React/Next.js frontend to create a permission-aware user interface.

---

## 🔧 Method 1: Using Permission Hooks

### Basic Permission Check

```tsx
'use client';

import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';

export function ProjectCard({ project }) {
  const canEdit = usePermission(Permission.PROJECT_UPDATE);
  const canDelete = usePermission(Permission.PROJECT_DELETE);
  
  return (
    <div className="border rounded-lg p-4">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      
      <div className="flex gap-2 mt-4">
        {canEdit && (
          <Button onClick={() => handleEdit(project.id)}>
            Edit
          </Button>
        )}
        
        {canDelete && (
          <Button variant="destructive" onClick={() => handleDelete(project.id)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
```

### Multiple Permissions Check

```tsx
'use client';

import { useAnyPermission, useAllPermissions } from '@/hooks/use-permission';
import { Permission } from '@/models/user';

export function ResourceManager() {
  // User needs ANY of these permissions
  const canView = useAnyPermission(
    Permission.RESOURCE_READ,
    Permission.RESOURCE_READ_ALL
  );
  
  // User needs ALL of these permissions
  const canFullyManage = useAllPermissions(
    Permission.RESOURCE_CREATE,
    Permission.RESOURCE_UPDATE,
    Permission.RESOURCE_DELETE
  );
  
  if (!canView) {
    return <div>You don't have permission to view resources</div>;
  }
  
  return (
    <div>
      <h2>Resources</h2>
      {canFullyManage ? (
        <FullManagementInterface />
      ) : (
        <ReadOnlyInterface />
      )}
    </div>
  );
}
```

---

## 🛡️ Method 2: Using Guard Components

### Simple Permission Guard

```tsx
'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';

export function NoteActions({ noteId }) {
  return (
    <div className="flex gap-2">
      {/* Only show if user has update permission */}
      <PermissionGuard permission={Permission.NOTE_UPDATE}>
        <Button onClick={() => editNote(noteId)}>
          Edit
        </Button>
      </PermissionGuard>
      
      {/* Only show if user has delete permission */}
      <PermissionGuard permission={Permission.NOTE_DELETE}>
        <Button variant="destructive" onClick={() => deleteNote(noteId)}>
          Delete
        </Button>
      </PermissionGuard>
    </div>
  );
}
```

### Guard with Fallback Content

```tsx
'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

export function DiaryEntry({ entry }) {
  return (
    <div>
      <PermissionGuard 
        permission={Permission.DIARY_UPDATE}
        fallback={
          <div className="text-muted-foreground">
            Read-only mode. You cannot edit this entry.
          </div>
        }
      >
        <EditableDiaryForm entry={entry} />
      </PermissionGuard>
    </div>
  );
}
```

### Multiple Permissions (OR Logic)

```tsx
'use client';

import { AnyPermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

export function ProjectManagement() {
  return (
    <AnyPermissionGuard 
      permissions={[
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_DELETE,
        Permission.PROJECT_READ_ALL
      ]}
      fallback={<div>No management permissions</div>}
    >
      <ManagementDashboard />
    </AnyPermissionGuard>
  );
}
```

### Multiple Permissions (AND Logic)

```tsx
'use client';

import { AllPermissionsGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

export function AdminPanel() {
  return (
    <AllPermissionsGuard 
      permissions={[
        Permission.USER_READ_ALL,
        Permission.USER_UPDATE_ALL,
        Permission.USER_DELETE_ALL
      ]}
      fallback={<div>Full admin access required</div>}
    >
      <FullAdminPanel />
    </AllPermissionsGuard>
  );
}
```

---

## 👤 Method 3: Using Role Guards

### Basic Role Check

```tsx
'use client';

import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

export function NavigationMenu() {
  const isAdmin = useRole(UserRole.ADMIN);
  const isUser = useRole(UserRole.USER);
  
  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      
      {(isUser || isAdmin) && (
        <>
          <a href="/projects">Projects</a>
          <a href="/notes">Notes</a>
          <a href="/diary">Diary</a>
        </>
      )}
      
      {isAdmin && (
        <>
          <a href="/admin">Admin Panel</a>
          <a href="/users">User Management</a>
        </>
      )}
    </nav>
  );
}
```

### Role Guard Component

```tsx
'use client';

import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export default function AdminPage() {
  return (
    <RoleGuard 
      role={UserRole.ADMIN}
      fallback={
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need administrator privileges to access this page.</p>
        </div>
      }
    >
      <AdminDashboard />
    </RoleGuard>
  );
}
```

### Multiple Roles (OR Logic)

```tsx
'use client';

import { AnyRoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export function UserContent() {
  return (
    <AnyRoleGuard 
      roles={[UserRole.ADMIN, UserRole.USER]}
      fallback={<div>Members only</div>}
    >
      <DashboardContent />
    </AnyRoleGuard>
  );
}
```

---

## 📄 Method 4: Page-Level Protection

### Protecting Entire Pages

```tsx
// app/(root)/admin/users/page.tsx
'use client';

import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';
import UserManagement from '@/components/admin/UserManagement';

export default function UsersPage() {
  return (
    <RoleGuard role={UserRole.ADMIN}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <UserManagement />
      </div>
    </RoleGuard>
  );
}
```

### Layout-Level Protection

```tsx
// app/(root)/admin/layout.tsx
'use client';

import { RoleGuard } from '@/components/auth/PermissionGuard';
import { UserRole } from '@/models/user';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard 
      role={UserRole.ADMIN}
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">Admin access required</p>
          </div>
        </div>
      }
    >
      <div className="admin-layout">
        <aside className="sidebar">Admin Sidebar</aside>
        <main className="content">{children}</main>
      </div>
    </RoleGuard>
  );
}
```

---

## 🔄 Method 5: Conditional Rendering Patterns

### Pattern 1: Action Buttons

```tsx
'use client';

import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Copy, Share } from 'lucide-react';

export function TodoActions({ todo }) {
  const canUpdate = usePermission(Permission.TODO_UPDATE);
  const canDelete = usePermission(Permission.TODO_DELETE);
  const canCreate = usePermission(Permission.TODO_CREATE);
  
  return (
    <div className="flex gap-2">
      {canUpdate && (
        <Button size="sm" variant="ghost">
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {canCreate && (
        <Button size="sm" variant="ghost">
          <Copy className="h-4 w-4" />
        </Button>
      )}
      
      {canUpdate && (
        <Button size="sm" variant="ghost">
          <Share className="h-4 w-4" />
        </Button>
      )}
      
      {canDelete && (
        <Button size="sm" variant="ghost">
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

### Pattern 2: Feature Toggles

```tsx
'use client';

import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

export function FeaturePanel() {
  const isAdmin = useRole(UserRole.ADMIN);
  
  return (
    <div>
      {/* Basic features for everyone */}
      <BasicFeatures />
      
      {/* Advanced features for admins */}
      {isAdmin && (
        <div className="mt-4">
          <h3>Advanced Features</h3>
          <AdvancedAnalytics />
          <BulkOperations />
          <SystemSettings />
        </div>
      )}
    </div>
  );
}
```

### Pattern 3: Dynamic Navigation

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePermission, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';
import Link from 'next/link';

export function Sidebar() {
  const { user } = useAuth();
  const isAdmin = useRole(UserRole.ADMIN);
  const canManageProjects = usePermission(Permission.PROJECT_CREATE);
  
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', show: true },
    { href: '/projects', label: 'Projects', show: canManageProjects },
    { href: '/notes', label: 'Notes', show: true },
    { href: '/diary', label: 'Diary', show: true },
    { href: '/todos', label: 'Todos', show: true },
    { href: '/admin', label: 'Admin Panel', show: isAdmin },
    { href: '/users', label: 'Users', show: isAdmin },
  ];
  
  return (
    <aside className="w-64 border-r">
      <nav>
        {menuItems
          .filter(item => item.show)
          .map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
```

---

## 🎨 Method 6: Form Field Control

### Conditional Form Fields

```tsx
'use client';

import { usePermission, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ProjectForm({ project }) {
  const canUpdate = usePermission(Permission.PROJECT_UPDATE);
  const isAdmin = useRole(UserRole.ADMIN);
  
  return (
    <form>
      <Input 
        name="title" 
        defaultValue={project.title}
        disabled={!canUpdate}
      />
      
      <Textarea 
        name="description"
        defaultValue={project.description}
        disabled={!canUpdate}
      />
      
      {/* Admin-only field */}
      {isAdmin && (
        <Input 
          name="priority" 
          type="number"
          defaultValue={project.priority}
        />
      )}
      
      {canUpdate && (
        <button type="submit">Save Changes</button>
      )}
    </form>
  );
}
```

---

## 🚨 Method 7: Error Boundaries

### Permission Error Boundary

```tsx
'use client';

import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function PermissionWrapper({ 
  permission, 
  children,
  errorMessage = "You don't have permission to access this feature"
}) {
  const hasPermission = usePermission(permission);
  
  if (!hasPermission) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }
  
  return <>{children}</>;
}

// Usage
<PermissionWrapper permission={Permission.PROJECT_DELETE}>
  <DangerZone />
</PermissionWrapper>
```

---

## 📊 Method 8: User Management UI (Admin)

### User List with Role Management

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export function UserManagement() {
  const isAdmin = useRole(UserRole.ADMIN);
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);
  
  const fetchUsers = async () => {
    const response = await fetch('/api/users', {
      credentials: 'include'
    });
    const data = await response.json();
    setUsers(data.users);
  };
  
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };
  
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Select 
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                >
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.USER}>User</option>
                  <option value={UserRole.GUEST}>Guest</option>
                </Select>
              </td>
              <td>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. Always Check Permissions on Backend Too
```tsx
// ❌ BAD - Only frontend check
<button onClick={deleteProject}>Delete</button>

// ✅ GOOD - Frontend + Backend
{canDelete && <button onClick={deleteProject}>Delete</button>}
// Backend will also verify permission
```

### 2. Provide Clear Feedback
```tsx
// ✅ GOOD - Shows why access is denied
<PermissionGuard 
  permission={Permission.PROJECT_DELETE}
  fallback={
    <div className="text-sm text-muted-foreground">
      You need delete permission to perform this action
    </div>
  }
>
  <DeleteButton />
</PermissionGuard>
```

### 3. Use Specific Permissions Over Roles
```tsx
// ⚠️ Less flexible
if (isAdmin) { /* show feature */ }

// ✅ More flexible and maintainable
if (canManageUsers) { /* show feature */ }
```

### 4. Cache Permission Checks When Possible
```tsx
// ✅ GOOD - Check once, use multiple times
const canEdit = usePermission(Permission.NOTE_UPDATE);
const canDelete = usePermission(Permission.NOTE_DELETE);
const canShare = usePermission(Permission.NOTE_READ_ALL);

return (
  <>
    {canEdit && <EditButton />}
    {canDelete && <DeleteButton />}
    {canShare && <ShareButton />}
  </>
);
```

---

## 🔗 Quick Reference

### Hooks
- `usePermission(permission)` - Single permission
- `useAnyPermission(...permissions)` - Any of (OR)
- `useAllPermissions(...permissions)` - All of (AND)
- `useRole(role)` - Single role
- `useAnyRole(...roles)` - Any of (OR)

### Components
- `<PermissionGuard permission={...}>` - Single permission
- `<AnyPermissionGuard permissions={[...]}>` - Any of (OR)
- `<AllPermissionsGuard permissions={[...]}>` - All of (AND)
- `<RoleGuard role={...}>` - Single role
- `<AnyRoleGuard roles={[...]}>` - Any of (OR)

All guards support `fallback` prop for alternative content!

---

## 📝 Summary

**Choose the right approach:**
- **Hooks** → When you need logic/conditionals
- **Guards** → When you need to show/hide UI elements
- **Both** → For complex scenarios

**Remember:**
- Frontend guards = Better UX
- Backend middleware = Security
- Always use both!

For more details, see `RBAC_IMPLEMENTATION_GUIDE.md` 🚀
