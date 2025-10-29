# MVC & RBAC Architecture Documentation

## 🏗️ Project Structure Overview

### Route Organization

The application now follows a clean, flat route structure prepared for Role-Based Access Control (RBAC):

```
app/
├── page.tsx                    # Home (/) - Portfolio page
├── layout.tsx                  # Root layout
├── (auth)/                     # Authentication routes
│   ├── signin/
│   ├── signup/
│   ├── forgot-password/
│   └── verify-email/
└── (root)/                     # Protected routes with shared layout
    ├── layout.tsx              # Shared layout (sidebar, topbar, auth)
    ├── dashboard/              # Overview dashboard
    ├── profile/                # User profile management
    ├── projects/               # Project management
    ├── resources/              # Learning resources
    ├── notes/                  # Note-taking
    ├── diary/                  # Personal diary
    ├── todos/                  # Task management
    └── settings/               # User settings
```

## 🔄 MVC Architecture Implementation

### Model Layer (`/client/models/`)
- **Purpose**: Data structures and type definitions
- **Files**: 
  - `user.ts` - User model and authentication types
  - `dashboard.ts` - Project, Resource, Note, Diary, Todo models
  - `index.ts` - Centralized exports

### View Layer (`/client/app/` & `/client/components/`)
- **Purpose**: UI components and page layouts
- **Structure**:
  - **Pages** (`app/(root)/*`): Feature-specific pages (projects, notes, diary, etc.)
  - **Components** (`components/`): Reusable UI components
    - `ui/` - Base UI components (buttons, cards, inputs)
    - `dashboard/` - Dashboard-specific components
    - `auth/` - Authentication components
    - `portfolio/` - Portfolio-specific components

### Controller Layer (`/client/services/` & `/server/src/`)

#### Client-Side Controllers (`/client/services/`)
- **Purpose**: Handle business logic and API communication
- **Files**:
  - `authService.ts` - Authentication operations (login, signup, password reset)
  - API service modules in `/client/lib/api.ts` for CRUD operations

#### Server-Side Controllers (`/server/src/controllers/`)
- **Purpose**: Process requests and coordinate between routes and services
- **Structure**:
  - Authentication controller
  - User controller
  - Dashboard resources controllers (projects, notes, diary, todos)

## 🛡️ RBAC Preparation

### Current State
All routes in `(root)/` are protected with basic authentication:
- Users must be authenticated to access any protected route
- Authentication check in root layout redirects unauthenticated users to `/signin`

### Future RBAC Implementation

#### 1. Role Definition (`/client/models/user.ts`)
```typescript
export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;  // Add this field
  // ... other fields
}
```

#### 2. Navigation with Role-Based Access (`/client/lib/constants.ts`)
```typescript
export const DASHBOARD_NAVIGATION = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['user', 'admin', 'moderator'], // Define who can access
  },
  {
    title: 'Admin Panel',
    icon: Shield,
    href: '/admin',
    roles: ['admin'], // Admin-only route
  },
  // ... other routes
];
```

#### 3. Route Protection Middleware
Create an RBAC hook or higher-order component:

```typescript
// /client/hooks/useRBAC.ts
export function useRBAC(allowedRoles: UserRole[]) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [user, allowedRoles, router]);

  return user && allowedRoles.includes(user.role);
}

// Usage in a page:
export default function AdminPage() {
  const hasAccess = useRBAC(['admin']);
  
  if (!hasAccess) return null;
  
  return <div>Admin Content</div>;
}
```

#### 4. Server-Side RBAC Middleware
```typescript
// /server/src/middleware/rbac.ts
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // From auth middleware
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    next();
  };
};

// Usage in routes:
router.get('/admin/users', requireRole(['admin']), adminController.getUsers);
```

## 📍 Current Route Structure

### Public Routes
- `/` - Portfolio home page (no authentication required)
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

### Protected Routes (Require Authentication)
- `/dashboard` - Overview dashboard with stats
- `/profile` - User profile management
- `/projects` - Project CRUD operations
- `/resources` - Learning resources management
- `/notes` - Note-taking with categories and tags
- `/diary` - Personal diary with mood tracking
- `/todos` - Task management with priorities
- `/settings` - Account settings and preferences

## 🎯 Benefits of Current Architecture

### 1. **Flat Route Structure**
- ✅ Clean, predictable URLs (`/notes` instead of `/dashboard/notes`)
- ✅ Easier to remember and share
- ✅ Better SEO potential for future public features

### 2. **Separation of Concerns (MVC)**
- ✅ **Models**: Clear data structures in `/models`
- ✅ **Views**: UI components separated by feature
- ✅ **Controllers**: Business logic in `/services` and `/server/controllers`

### 3. **Centralized Authentication**
- ✅ Single point of authentication in `(root)/layout.tsx`
- ✅ No duplicate auth checks in individual pages
- ✅ Easy to extend with RBAC middleware

### 4. **Shared Layout**
- ✅ Consistent sidebar, topbar, and footer across all protected routes
- ✅ SPA-like behavior - only content area changes
- ✅ Single `layout.tsx` to maintain

### 5. **RBAC-Ready**
- ✅ Navigation config supports role arrays (commented for future use)
- ✅ MVC structure allows easy addition of middleware
- ✅ Clear separation makes authorization logic easy to add

## 🚀 Next Steps for RBAC Implementation

When you're ready to implement RBAC:

1. **Add role field to User model** (server and client)
2. **Update registration/signup** to assign default role
3. **Create RBAC middleware** for server-side route protection
4. **Create useRBAC hook** for client-side route protection
5. **Filter navigation items** based on user role
6. **Add admin routes** for user management
7. **Update AuthContext** to expose user role
8. **Add unauthorized page** (`/unauthorized`)

## 📝 Notes

- Current implementation uses basic authentication (authenticated vs. not authenticated)
- All protected routes are under `(root)/` route group
- Portfolio home page (`/`) has its own layout and doesn't require authentication
- All feature pages share the same layout with sidebar, topbar, and footer
- ModeToggle (dark/light theme) is accessible in the sticky topbar

## 🔗 Related Files

- **Navigation Config**: `/client/lib/constants.ts`
- **Auth Context**: `/client/contexts/AuthContext.tsx`
- **Root Layout**: `/client/app/(root)/layout.tsx`
- **Models**: `/client/models/`
- **Services**: `/client/services/` and `/client/lib/api.ts`
- **Server Controllers**: `/server/src/controllers/`
