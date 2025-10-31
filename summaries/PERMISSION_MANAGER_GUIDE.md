# Permission Management UI Guide

## What Was Created

### 🎯 Features
1. **Role-Based Permission Manager** - Visual UI to manage permissions for Admin, User, and Guest roles
2. **Permission Categories** - Organized by feature (Projects, Notes, Diary, Todos, Resources, Users, Settings)
3. **Bulk Actions** - Toggle entire categories or individual permissions
4. **Real-time Validation** - Shows permission counts and highlights changes
5. **Persistent Storage** - Saves to backend, applies to all users with that role

### 📁 Files Created

#### Frontend
- `client/components/admin/RolePermissionsManager.tsx` - Main permission management component
- `client/components/admin/AdminNav.tsx` - Admin section navigation
- `client/app/(root)/admin/permissions/page.tsx` - Permission management page

#### Backend
- `server/src/controllers/roleController.ts` - Role permission CRUD operations
- `server/src/routes/roleRoutes.ts` - API routes for role management

#### Updates
- `client/app/(root)/admin/layout.tsx` - Added navigation to admin layout
- `server/src/index.ts` - Added role routes

---

## 🚀 How to Use

### Access the Permission Manager

1. Sign in as an **Admin**
2. Navigate to: **http://localhost:3000/admin/permissions**
3. Or click "Role Permissions" in the admin navigation

### Managing Permissions

#### 1. Select a Role
Click the tabs at the top to switch between:
- **Admin** - Full system access
- **User** - Standard user permissions
- **Guest** - Limited read-only access

#### 2. Toggle Permissions

**By Category:**
- Click the checkbox next to category name (e.g., "Projects")
- Enables/disables ALL permissions in that category

**Individual Permissions:**
- Click checkbox next to specific permission
- Example: "Create Projects", "Delete Notes", etc.

#### 3. Save Changes
- Click **"Save Changes"** button (top right)
- Changes apply immediately to all users with that role

#### 4. Reset to Defaults
- Click **"Reset to Defaults"** button
- Restores original permission settings

---

## 📋 Available Permissions by Category

### Projects
- ✏️ Create Projects
- 👁️ Read Projects (own)
- 📝 Update Projects (own)
- 🗑️ Delete Projects (own)
- 🌐 Read All Projects (admin)

### Notes
- ✏️ Create Notes
- 👁️ Read Notes (own)
- 📝 Update Notes (own)
- 🗑️ Delete Notes (own)
- 🌐 Read All Notes (admin)

### Diary
- ✏️ Create Diary Entries
- 👁️ Read Diary (own)
- 📝 Update Diary (own)
- 🗑️ Delete Diary (own)
- 🌐 Read All Diaries (admin)

### Todos
- ✏️ Create Todos
- 👁️ Read Todos (own)
- 📝 Update Todos (own)
- 🗑️ Delete Todos (own)
- 🌐 Read All Todos (admin)

### Resources
- ✏️ Create Resources
- 👁️ Read Resources
- 📝 Update Resources
- 🗑️ Delete Resources
- 🌐 Read All Resources (admin)

### User Management
- 👁️ Read Own Profile
- 📝 Update Own Profile
- 🗑️ Delete Own Account
- 🌐 Read All Users (admin)
- 📝 Update All Users (admin)
- 🗑️ Delete Any User (admin)

### Settings
- 👁️ Read Settings
- 📝 Update Settings

---

## 🎨 Default Permission Sets

### Admin Role (Full Access)
✅ All permissions enabled by default

### User Role (Standard Access)
✅ Create, read, update, delete OWN resources
✅ Manage own profile
✅ View and update settings
❌ Cannot access other users' data
❌ Cannot manage users

### Guest Role (Read-Only)
✅ Read projects, notes, resources
✅ View own profile
✅ Read settings
❌ Cannot create or modify anything
❌ Cannot access admin features

---

## 🔧 API Endpoints

### Get All Role Permissions
```
GET /api/roles/permissions
```

### Get Specific Role Permissions
```
GET /api/roles/:role/permissions
```

### Update All Role Permissions
```
PUT /api/roles/permissions
Body: { permissions: { admin: [...], user: [...], guest: [...] } }
```

### Update Specific Role
```
PUT /api/roles/:role/permissions
Body: { permissions: [...] }
```

### Reset to Defaults
```
POST /api/roles/permissions/reset
```

---

## 💡 Use Cases

### Scenario 1: Restrict Guest Access
1. Go to **Guest** tab
2. Uncheck "Read Projects"
3. Click **Save**
→ Guests can no longer view projects

### Scenario 2: Give Users More Power
1. Go to **User** tab
2. Check "Read All Notes"
3. Click **Save**
→ Users can now see each other's notes

### Scenario 3: Create Admin-Only Features
1. Go to **User** and **Guest** tabs
2. Uncheck specific permissions (e.g., "Delete Todos")
3. Keep checked for **Admin**
4. Click **Save**
→ Only admins can delete todos

### Scenario 4: Temporarily Disable Features
1. Uncheck permission across all roles
2. Click **Save**
→ Feature is disabled for everyone

---

## 🔒 Security Notes

1. **Admin Only** - Only admins can access `/admin/permissions`
2. **Protected Routes** - All role management APIs require admin authentication
3. **Validation** - Backend validates all permission changes
4. **Persistent** - Permissions are stored and applied on every request

---

## 🎯 Testing Permissions

### Test as Different Roles:

1. **Create Test Users:**
   - Go to `/admin/users`
   - Change user roles to Admin/User/Guest

2. **Sign in as Each Role:**
   - Test what they can/cannot access
   - Verify permissions work correctly

3. **Modify Permissions:**
   - Change permissions in `/admin/permissions`
   - Sign in as that role again
   - Verify changes took effect

---

## 📝 Example Workflows

### Make a Feature Admin-Only:
```
1. Go to Admin Permissions → Enable feature
2. Go to User Permissions → Disable feature
3. Go to Guest Permissions → Disable feature
4. Save Changes
```

### Give Everyone Read Access:
```
1. Go to each role tab (Admin, User, Guest)
2. Enable "Read [Resource]" permission
3. Save Changes
```

### Create Custom User Experience:
```
Admin: Full control (all permissions)
User: Create/edit own content only
Guest: Read-only access
```

---

## 🚨 Common Issues

### Changes Not Taking Effect?
1. Make sure you clicked **"Save Changes"**
2. Sign out and sign back in (refresh JWT token)
3. Hard refresh browser (Ctrl+Shift+R)

### Permission Manager Not Loading?
1. Verify you're signed in as Admin
2. Check server is running (port 5000)
3. Check browser console for errors

### Can't Access Admin Panel?
1. Verify your user has `role: 'admin'` in database
2. Sign out and sign back in
3. Check `/admin/users` to confirm role

---

## 🎉 Quick Start

**As Admin:**
1. Visit: http://localhost:3000/admin/permissions
2. Click on a role tab (Admin/User/Guest)
3. Toggle permissions you want to enable/disable
4. Click "Save Changes"
5. Test by signing in as that role!

---

## Next Steps

- ✅ Permissions are now managed through UI
- ✅ Changes apply to all users with that role
- 🔄 Test different role configurations
- 🎨 Customize permission sets for your needs
- 📊 Monitor permission usage in your app

Need help? Check the `PAGE_PERMISSION_GUIDE.md` for implementing permission checks in your pages!
