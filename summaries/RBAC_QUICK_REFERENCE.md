# RBAC Quick Reference

## 🎯 Quick Start

### Server-Side: Protect a Route
```typescript
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

router.post('/', 
  authMiddleware, 
  requirePermission(Permission.PROJECT_CREATE), 
  createProject
);
```

### Client-Side: Conditional Rendering
```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

<PermissionGuard permission={Permission.PROJECT_UPDATE}>
  <EditButton />
</PermissionGuard>
```

---

## 🔑 User Roles

| Role | Description | Default |
|------|-------------|---------|
| `ADMIN` | Full access to all features | No |
| `USER` | Standard user with own resource access | **Yes** |
| `GUEST` | Limited read-only access | No |

---

## 📋 Common Permissions

### Projects
- `Permission.PROJECT_CREATE`
- `Permission.PROJECT_READ`
- `Permission.PROJECT_UPDATE`
- `Permission.PROJECT_DELETE`

### Notes
- `Permission.NOTE_CREATE`
- `Permission.NOTE_READ`
- `Permission.NOTE_UPDATE`
- `Permission.NOTE_DELETE`

### Diary
- `Permission.DIARY_CREATE`
- `Permission.DIARY_READ`
- `Permission.DIARY_UPDATE`
- `Permission.DIARY_DELETE`

### Todos
- `Permission.TODO_CREATE`
- `Permission.TODO_READ`
- `Permission.TODO_UPDATE`
- `Permission.TODO_DELETE`

### Resources
- `Permission.RESOURCE_CREATE`
- `Permission.RESOURCE_READ`
- `Permission.RESOURCE_UPDATE`
- `Permission.RESOURCE_DELETE`

---

## 🛠️ Server-Side Middleware

### Single Role Check
```typescript
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../types/rbac';

router.get('/admin', requireRole(UserRole.ADMIN), handler);
```

### Multiple Roles (OR logic)
```typescript
router.get('/dashboard', 
  requireRole(UserRole.ADMIN, UserRole.USER), 
  handler
);
```

### Single Permission Check
```typescript
import { requirePermission } from '../middleware/rbac';

router.post('/', 
  requirePermission(Permission.PROJECT_CREATE), 
  handler
);
```

### Multiple Permissions (AND logic)
```typescript
router.post('/:id/duplicate', 
  requirePermission(Permission.NOTE_READ, Permission.NOTE_CREATE), 
  handler
);
```

### Multiple Permissions (OR logic)
```typescript
import { requireAnyPermission } from '../middleware/rbac';

router.get('/', 
  requireAnyPermission(Permission.PROJECT_READ, Permission.PROJECT_READ_ALL), 
  handler
);
```

### Predefined Middleware
```typescript
import { requireAdmin, requireUser } from '../middleware/rbac';

// Admin only
router.get('/admin', requireAdmin, handler);

// User or Admin (excludes guests)
router.get('/dashboard', requireUser, handler);
```

---

## 🎨 Client-Side Hooks

### Check Single Permission
```tsx
import { usePermission } from '@/hooks/use-permission';

const canEdit = usePermission(Permission.PROJECT_UPDATE);

if (canEdit) {
  // Show edit button
}
```

### Check Multiple Permissions (OR)
```tsx
import { useAnyPermission } from '@/hooks/use-permission';

const canManage = useAnyPermission(
  Permission.PROJECT_UPDATE, 
  Permission.PROJECT_DELETE
);
```

### Check Multiple Permissions (AND)
```tsx
import { useAllPermissions } from '@/hooks/use-permission';

const canFullyManage = useAllPermissions(
  Permission.PROJECT_UPDATE, 
  Permission.PROJECT_DELETE
);
```

### Check Role
```tsx
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';

const isAdmin = useRole(UserRole.ADMIN);
```

### Check Multiple Roles (OR)
```tsx
import { useAnyRole } from '@/hooks/use-permission';

const canAccess = useAnyRole(UserRole.ADMIN, UserRole.USER);
```

---

## 🛡️ Client-Side Components

### Permission Guard
```tsx
<PermissionGuard permission={Permission.PROJECT_UPDATE}>
  <EditButton />
</PermissionGuard>
```

### With Fallback
```tsx
<PermissionGuard 
  permission={Permission.PROJECT_UPDATE}
  fallback={<p>No permission</p>}
>
  <EditButton />
</PermissionGuard>
```

### Any Permission Guard (OR)
```tsx
<AnyPermissionGuard 
  permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}
>
  <ManageButtons />
</AnyPermissionGuard>
```

### All Permissions Guard (AND)
```tsx
<AllPermissionsGuard 
  permissions={[Permission.PROJECT_UPDATE, Permission.PROJECT_DELETE]}
>
  <FullControlPanel />
</AllPermissionsGuard>
```

### Role Guard
```tsx
<RoleGuard role={UserRole.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

### Any Role Guard (OR)
```tsx
<AnyRoleGuard roles={[UserRole.ADMIN, UserRole.USER]}>
  <UserContent />
</AnyRoleGuard>
```

---

## 🔧 Common Patterns

### Pattern 1: Conditional Button
```tsx
const canDelete = usePermission(Permission.PROJECT_DELETE);

return (
  <Card>
    <CardContent>{content}</CardContent>
    {canDelete && <Button onClick={handleDelete}>Delete</Button>}
  </Card>
);
```

### Pattern 2: Multiple Permission Checks
```tsx
const canEdit = usePermission(Permission.PROJECT_UPDATE);
const canDelete = usePermission(Permission.PROJECT_DELETE);
const canShare = usePermission(Permission.PROJECT_READ_ALL);

return (
  <div>
    {canEdit && <EditButton />}
    {canDelete && <DeleteButton />}
    {canShare && <ShareButton />}
  </div>
);
```

### Pattern 3: Role-Based Navigation
```tsx
const isAdmin = useRole(UserRole.ADMIN);
const isUser = useAnyRole(UserRole.ADMIN, UserRole.USER);

return (
  <nav>
    {isUser && <Link href="/dashboard">Dashboard</Link>}
    {isAdmin && <Link href="/admin">Admin</Link>}
  </nav>
);
```

### Pattern 4: Guard with Alternative Content
```tsx
<PermissionGuard 
  permission={Permission.PROJECT_UPDATE}
  fallback={<ViewOnlyCard />}
>
  <EditableCard />
</PermissionGuard>
```

---

## 📦 Import Paths

### Server
```typescript
// Types
import { UserRole, Permission } from '../types/rbac';

// Middleware
import { 
  requireRole, 
  requirePermission, 
  requireAnyPermission,
  requireAdmin,
  requireUser 
} from '../middleware/rbac';

// Auth
import { authMiddleware, AuthRequest } from '../middleware/auth';
```

### Client
```typescript
// Types
import { UserRole, Permission } from '@/models/user';

// Hooks
import { 
  usePermission, 
  useAnyPermission, 
  useAllPermissions,
  useRole,
  useAnyRole 
} from '@/hooks/use-permission';

// Components
import { 
  PermissionGuard,
  AnyPermissionGuard,
  AllPermissionsGuard,
  RoleGuard,
  AnyRoleGuard 
} from '@/components/auth/PermissionGuard';
```

---

## 🚀 Testing Checklist

- [ ] Test with ADMIN role
- [ ] Test with USER role (default)
- [ ] Test with GUEST role
- [ ] Verify API returns 403 for unauthorized access
- [ ] Verify UI hides unauthorized features
- [ ] Test permission inheritance
- [ ] Test route protection
- [ ] Test component guards

---

## 📚 Full Documentation

For complete documentation, see: `summaries/RBAC_IMPLEMENTATION_GUIDE.md`

---

## 🔐 Creating Admin User

**Via MongoDB:**
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Via Code (in controller):**
```typescript
await User.findByIdAndUpdate(userId, { role: UserRole.ADMIN });
```
