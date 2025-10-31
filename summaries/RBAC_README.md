# Role-Based Access Control (RBAC)

A comprehensive, production-ready RBAC system for the portfolio application.

## 🎯 Quick Start

### 1. Create Your First Admin User

```bash
cd server
npm run create-admin
```

### 2. Use in Your Code

**Backend (Protect a Route):**
```typescript
import { requirePermission } from '../middleware/rbac';
import { Permission } from '../types/rbac';

router.post('/', 
  authMiddleware, 
  requirePermission(Permission.PROJECT_CREATE), 
  createProject
);
```

**Frontend (Conditional Rendering):**
```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Permission } from '@/models/user';

<PermissionGuard permission={Permission.PROJECT_UPDATE}>
  <EditButton />
</PermissionGuard>
```

## 📚 Documentation

- **[Complete Guide](./RBAC_IMPLEMENTATION_GUIDE.md)** - Full documentation with examples
- **[Quick Reference](./RBAC_QUICK_REFERENCE.md)** - Cheat sheet for developers
- **[Migration Guide](./RBAC_MIGRATION_GUIDE.md)** - Upgrade from existing deployment
- **[Implementation Summary](./RBAC_IMPLEMENTATION_SUMMARY.md)** - What was implemented

## 🔑 User Roles

| Role | Description | Default |
|------|-------------|---------|
| **ADMIN** | Full access to all features | No |
| **USER** | Standard user with own resource access | Yes ✅ |
| **GUEST** | Limited read-only access | No |

## 🛡️ Key Features

- ✅ 3 hierarchical roles (Admin, User, Guest)
- ✅ 30+ granular permissions
- ✅ Server-side middleware for route protection
- ✅ Client-side hooks and components
- ✅ Type-safe with TypeScript
- ✅ Easy to use and maintain
- ✅ Production-ready

## 🚀 Usage Examples

### Backend Examples

**Require specific permission:**
```typescript
router.post('/', 
  requirePermission(Permission.PROJECT_CREATE), 
  handler
);
```

**Require admin role:**
```typescript
router.get('/admin', 
  requireAdmin, 
  handler
);
```

**Require any permission (OR logic):**
```typescript
router.get('/', 
  requireAnyPermission(
    Permission.PROJECT_READ, 
    Permission.PROJECT_READ_ALL
  ), 
  handler
);
```

### Frontend Examples

**Permission hook:**
```tsx
const canEdit = usePermission(Permission.PROJECT_UPDATE);

{canEdit && <EditButton />}
```

**Permission guard component:**
```tsx
<PermissionGuard permission={Permission.PROJECT_UPDATE}>
  <EditButton />
</PermissionGuard>
```

**Role guard component:**
```tsx
<RoleGuard role={UserRole.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

## 📦 What's Included

### Server-Side
- `types/rbac.ts` - Role and permission definitions
- `middleware/rbac.ts` - Authorization middleware
- `middleware/auth.ts` - Enhanced with role support
- `controllers/userController.ts` - User management
- `routes/userRoutes.ts` - User management routes
- `scripts/createAdmin.ts` - Admin setup script

### Client-Side
- `models/user.ts` - RBAC types and helpers
- `hooks/use-permission.tsx` - Permission hooks
- `components/auth/PermissionGuard.tsx` - Guard components

### Documentation
- `RBAC_IMPLEMENTATION_GUIDE.md` - Complete guide
- `RBAC_QUICK_REFERENCE.md` - Quick reference
- `RBAC_MIGRATION_GUIDE.md` - Migration guide
- `RBAC_IMPLEMENTATION_SUMMARY.md` - Implementation summary
- `RBAC_README.md` - This file

## 🔧 NPM Scripts

```bash
# Create admin user
npm run create-admin
```

## 🎓 Learning Path

1. **Start Here**: Read `RBAC_QUICK_REFERENCE.md` for syntax and examples
2. **Deep Dive**: Read `RBAC_IMPLEMENTATION_GUIDE.md` for comprehensive understanding
3. **Migrate**: If upgrading, follow `RBAC_MIGRATION_GUIDE.md`
4. **Reference**: Use `RBAC_IMPLEMENTATION_SUMMARY.md` to see what's implemented

## ⚡ Common Patterns

### Pattern 1: Protect a CRUD Route
```typescript
router.get('/', requirePermission(Permission.PROJECT_READ), getAll);
router.post('/', requirePermission(Permission.PROJECT_CREATE), create);
router.put('/:id', requirePermission(Permission.PROJECT_UPDATE), update);
router.delete('/:id', requirePermission(Permission.PROJECT_DELETE), remove);
```

### Pattern 2: Conditional Buttons
```tsx
const canEdit = usePermission(Permission.PROJECT_UPDATE);
const canDelete = usePermission(Permission.PROJECT_DELETE);

<Card>
  <CardContent>{content}</CardContent>
  <CardFooter>
    {canEdit && <Button>Edit</Button>}
    {canDelete && <Button>Delete</Button>}
  </CardFooter>
</Card>
```

### Pattern 3: Admin-Only Section
```tsx
<RoleGuard role={UserRole.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

### Pattern 4: Multiple Permission Check
```tsx
<AllPermissionsGuard 
  permissions={[
    Permission.PROJECT_UPDATE, 
    Permission.PROJECT_DELETE
  ]}
>
  <FullManagementPanel />
</AllPermissionsGuard>
```

## 🔐 Security Notes

1. **Frontend guards are for UX only** - They hide unavailable features
2. **Backend middleware is the security layer** - Never skip it
3. **Always use both** - Frontend for UX, backend for security
4. **Permissions over roles** - Check permissions, not roles when possible

## 🐛 Troubleshooting

**Issue**: Permission denied but should have access
- **Check**: User role in database
- **Check**: Permission defined in `RolePermissions` mapping
- **Check**: Middleware applied to route

**Issue**: Frontend shows but backend denies
- **Expected**: This is correct behavior
- **Reason**: Frontend is UX, backend is security

**Issue**: TypeScript errors
- **Fix**: Ensure all imports are correct
- **Fix**: Check enum values match between files

## 📞 Support

For detailed help, check the documentation:
- Issues with setup: `RBAC_MIGRATION_GUIDE.md`
- API reference: `RBAC_QUICK_REFERENCE.md`
- Examples: `RBAC_IMPLEMENTATION_GUIDE.md`

## ✨ Features at a Glance

| Feature | Status |
|---------|--------|
| Multiple roles | ✅ |
| Granular permissions | ✅ |
| Server middleware | ✅ |
| Client hooks | ✅ |
| Guard components | ✅ |
| Type safety | ✅ |
| Documentation | ✅ |
| Examples | ✅ |
| Migration guide | ✅ |
| Admin setup script | ✅ |
| User management | ✅ |

## 🎉 You're Ready!

Start protecting your routes and components with RBAC!

```bash
# Create admin user
npm run create-admin

# Start coding with RBAC
# See RBAC_QUICK_REFERENCE.md for syntax
```

---

Built with ❤️ for secure, scalable applications.
