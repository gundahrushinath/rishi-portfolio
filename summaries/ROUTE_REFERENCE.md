# Route Reference Guide

## 🌐 Application Routes

### Public Routes (No Authentication Required)
| Route | Description | File Location |
|-------|-------------|---------------|
| `/` | Portfolio home page | `app/page.tsx` |
| `/signin` | User sign in | `app/(auth)/signin/page.tsx` |
| `/signup` | User registration | `app/(auth)/signup/page.tsx` |
| `/forgot-password` | Password reset request | `app/(auth)/forgot-password/page.tsx` |
| `/reset-password` | Password reset form | `app/(auth)/reset-password/page.tsx` |
| `/verify-email` | Email verification | `app/(auth)/verify-email/page.tsx` |

### Protected Routes (Authentication Required)
| Route | Description | File Location |
|-------|-------------|---------------|
| `/dashboard` | Overview dashboard with statistics | `app/(root)/dashboard/page.tsx` |
| `/profile` | User profile management | `app/(root)/profile/page.tsx` |
| `/projects` | Project CRUD operations | `app/(root)/projects/page.tsx` |
| `/resources` | Learning resources management | `app/(root)/resources/page.tsx` |
| `/notes` | Note-taking with categories | `app/(root)/notes/page.tsx` |
| `/diary` | Personal diary with mood tracking | `app/(root)/diary/page.tsx` |
| `/todos` | Task management system | `app/(root)/todos/page.tsx` |
| `/settings` | Account settings & preferences | `app/(root)/settings/page.tsx` |

## 🎨 Layout System

### Portfolio Layout
- **Route**: `/`
- **Layout File**: `app/layout.tsx`
- **Features**: Custom portfolio design, no authentication required

### Application Layout (Protected Routes)
- **Routes**: `/dashboard`, `/profile`, `/projects`, `/resources`, `/notes`, `/diary`, `/todos`, `/settings`
- **Layout File**: `app/(root)/layout.tsx`
- **Features**:
  - Persistent sidebar navigation
  - Sticky topbar with user menu and dark/light mode toggle
  - Authentication guard (redirects to `/signin` if not authenticated)
  - Sticky footer
  - SPA-like behavior (only content area changes)

## 🔐 Authentication Flow

1. **Unauthenticated user** tries to access protected route (e.g., `/projects`)
2. **Root layout** (`app/(root)/layout.tsx`) checks authentication status
3. **Redirects** to `/signin` if not authenticated
4. After successful login, **redirects back** to originally requested page
5. **Authenticated users** can access all protected routes freely

## 📱 Navigation Structure

Navigation is centralized in `client/lib/constants.ts`:

```typescript
export const DASHBOARD_NAVIGATION = [
  { title: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Profile', icon: User, href: '/profile' },
  { title: 'Projects', icon: FileText, href: '/projects' },
  { title: 'Resources', icon: BookOpen, href: '/resources' },
  { title: 'Notes', icon: StickyNote, href: '/notes' },
  { title: 'Diary', icon: Book, href: '/diary' },
  { title: 'Todos', icon: CheckSquare, href: '/todos' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];
```

## 🚀 Development URLs

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000` |
| Production | TBD |

## 📋 Quick Access

### For Development
- Portfolio: http://localhost:3000/
- Sign In: http://localhost:3000/signin
- Dashboard: http://localhost:3000/dashboard
- Projects: http://localhost:3000/projects

### For Testing Authentication
1. Visit any protected route: http://localhost:3000/projects
2. Should redirect to: http://localhost:3000/signin
3. After login, redirected back to: http://localhost:3000/projects

## 🔮 Future Enhancements

### Planned Features
- **RBAC**: Role-based access control for admin routes
- **Admin Panel**: `/admin` for user management (admin-only)
- **Analytics**: `/analytics` for usage statistics (admin-only)
- **API Routes**: Direct API access under `/api/*`

### Route Groups for RBAC
When implementing RBAC, routes will be organized by access level:
- **Public**: No authentication required
- **User**: Basic authenticated access
- **Admin**: Administrative privileges required
- **Moderator**: Content moderation capabilities

## 📝 Migration Notes

### Changes from Previous Structure
- **Before**: `/dashboard/projects`, `/dashboard/notes`, etc.
- **After**: `/projects`, `/notes`, etc.
- **Reason**: Cleaner URLs, better UX, easier RBAC implementation

### Backward Compatibility
If you need to maintain old URLs temporarily, add redirects in `next.config.ts`:

```typescript
async redirects() {
  return [
    {
      source: '/dashboard/projects',
      destination: '/projects',
      permanent: true,
    },
    // ... other redirects
  ];
}
```

## 🛠️ Troubleshooting

### Route Not Working?
1. Check if file exists in correct location
2. Verify authentication status (protected routes require login)
3. Check browser console for errors
4. Clear Next.js cache: `npm run clean` (if available) or delete `.next` folder

### Layout Not Applying?
1. Ensure route is under correct route group (`(root)` or `(auth)`)
2. Check if `layout.tsx` exists in correct directory
3. Verify no conflicting layouts in subdirectories

### Authentication Loop?
1. Check if AuthContext is properly providing user data
2. Verify token is stored correctly
3. Check server authentication endpoints are working
4. Review redirect logic in `app/(root)/layout.tsx`
