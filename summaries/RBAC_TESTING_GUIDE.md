# RBAC Testing Guide - Quick Reference

## How to Test Each Page

### 1. Admin Permissions Page (`/admin/permissions`)

**Test as Admin:**
1. Login as admin user
2. Navigate to `/admin/permissions`
3. ✅ Should see Role Permissions Manager
4. Should be able to modify permissions

**Test as Non-Admin:**
1. Login as regular user
2. Navigate to `/admin/permissions`
3. ✅ Should see "Access Denied" message
4. Click "Back to Dashboard" - should redirect

---

### 2. Settings Page (`/settings`)

**Test with Full Permissions (SETTINGS_READ + SETTINGS_UPDATE):**
1. Navigate to `/settings`
2. ✅ Should see all settings sections
3. ✅ Name input should be enabled
4. ✅ Password inputs should be enabled
5. ✅ "Save Changes" button enabled
6. ✅ "Update Password" button enabled
7. ✅ "Delete Account" button enabled

**Test with READ Only (SETTINGS_READ, no UPDATE):**
1. Go to admin panel, disable SETTINGS_UPDATE for your role
2. Logout and login again
3. Navigate to `/settings`
4. ✅ Should see settings page (can read)
5. ✅ All input fields should be disabled
6. ✅ All buttons should be disabled
7. ✅ Should see message "You don't have permission to update settings"

**Test with No Permissions (no SETTINGS_READ):**
1. Go to admin panel, disable SETTINGS_READ
2. Logout and login again
3. Navigate to `/settings`
4. ✅ Should see NoAccess component
5. ✅ Should show "You need permission to access Settings"
6. ✅ Should display required permission: "Settings Read"

---

### 3. Profile Page (`/profile`)

**Test with Full Permissions (USER_READ + USER_UPDATE):**
1. Navigate to `/profile`
2. ✅ Should see profile information
3. ✅ Should see "Edit Profile" button
4. ✅ Should display user avatar, name, email

**Test with READ Only (USER_READ, no UPDATE):**
1. Disable USER_UPDATE permission
2. Logout and login
3. Navigate to `/profile`
4. ✅ Should see profile information
5. ✅ No "Edit Profile" button
6. ✅ Should see "View-only mode" message

**Test with No Permissions (no USER_READ):**
1. Disable USER_READ permission
2. Logout and login
3. Navigate to `/profile`
4. ✅ Should see NoAccess component
5. ✅ Should show required permission: "User Read"

---

### 4. Dashboard Page (`/dashboard`)

**Test as Authenticated User:**
1. Login with any valid credentials
2. Navigate to `/dashboard`
3. ✅ Should see dashboard overview
4. ✅ Should see statistics cards
5. ✅ No permission errors

**Test as Unauthenticated:**
1. Logout
2. Try to access `/dashboard`
3. ✅ Should redirect to login
4. ✅ Or show nothing (blank page)

---

### 5. Resource Pages (Diary, Notes, Todos, Projects, Resources)

**Test Pattern for Each:**

**With Full Permissions (READ + CREATE + UPDATE + DELETE):**
1. Navigate to page
2. ✅ See content/items
3. ✅ "New [Item]" button visible
4. ✅ Edit buttons visible on items
5. ✅ Delete buttons visible on items
6. ✅ No 403 errors in console

**With READ Only:**
1. Disable CREATE, UPDATE, DELETE for the resource
2. Logout and login
3. Navigate to page
4. ✅ See content/items
5. ✅ No "New [Item]" button
6. ✅ No edit/delete buttons
7. ✅ No 403 errors in console

**With No Permissions (0/5):**
1. Disable all permissions for the resource
2. Logout and login
3. Navigate to page
4. ✅ See NoAccess component
5. ✅ No content visible
6. ✅ No 403 errors in console
7. ✅ Shows required permission

---

## Step-by-Step Testing Process

### Setup: Configure Permissions

1. **Login as Admin**
   - Use admin credentials
   - Navigate to `/admin/permissions`

2. **Modify Role Permissions**
   - Select the role you want to test (USER or GUEST)
   - Toggle permissions on/off
   - Click "Save Changes"

3. **Test the Changes**
   - Logout
   - Login as user with that role
   - Test the pages as described above

### Important Notes

⚠️ **Must Logout/Login After Permission Changes**
- Permission changes only apply after re-login
- The backend sends permissions in the JWT token
- Frontend uses these permissions from the token

⚠️ **Check Browser Console**
- No 403 errors should appear
- Loading states should work smoothly
- Look for any red error messages

⚠️ **Loading States**
- Each page should show skeleton loading during auth
- Then show content or NoAccess based on permissions

---

## Expected Permission Behavior by Role

### ADMIN Role (Default)
```
Settings:
  ✅ SETTINGS_READ
  ✅ SETTINGS_UPDATE

User Profile:
  ✅ USER_READ
  ✅ USER_UPDATE

Resources (Diary, Notes, Todos, Projects, Resources):
  ✅ READ, CREATE, UPDATE, DELETE for all

Admin Pages:
  ✅ Full access to admin panel
```

### USER Role (Default)
```
Settings:
  ✅ SETTINGS_READ
  ✅ SETTINGS_UPDATE

User Profile:
  ✅ USER_READ
  ✅ USER_UPDATE

Resources:
  ✅ READ, CREATE, UPDATE, DELETE for own items

Admin Pages:
  ❌ No access
```

### GUEST Role (Default)
```
Settings:
  ✅ SETTINGS_READ
  ❌ No UPDATE

User Profile:
  ✅ USER_READ
  ❌ No UPDATE

Resources:
  ✅ READ only
  ❌ No CREATE, UPDATE, DELETE

Admin Pages:
  ❌ No access
```

---

## Common Test Scenarios

### Scenario 1: Complete Lockdown
**Goal:** Test that user cannot access anything

1. Set all permissions to disabled for USER role
2. Logout and login as USER
3. ✅ Dashboard should work (no permissions required)
4. ✅ All other pages show NoAccess
5. ✅ No 403 errors in console

### Scenario 2: Read-Only User
**Goal:** User can view but not modify anything

1. Enable only READ permissions for all resources
2. Enable SETTINGS_READ (not UPDATE)
3. Enable USER_READ (not UPDATE)
4. Logout and login
5. ✅ Can view all pages
6. ✅ No create/edit/delete buttons
7. ✅ All forms disabled
8. ✅ Clear "view-only" or "no permission" messages

### Scenario 3: Partial Access
**Goal:** User has access to some resources but not others

1. Enable full permissions for DIARY and NOTES
2. Disable all permissions for TODOS, PROJECTS, RESOURCES
3. Logout and login
4. ✅ Diary and Notes work fully
5. ✅ Todos, Projects, Resources show NoAccess
6. ✅ Navigation still visible but access denied

---

## Browser Console Checks

### What You Should See
```
✅ No red errors
✅ Successful API calls for permitted resources
✅ Clean page loads
✅ Permission checks logging (if enabled)
```

### What You Should NOT See
```
❌ 403 Forbidden errors (these are now suppressed)
❌ Uncaught errors
❌ Multiple failed API calls
❌ Component render errors
```

---

## Testing Checklist

Print this and check off as you test:

### Critical Pages
- [ ] Admin Permissions (admin access only)
- [ ] Settings (full permissions)
- [ ] Settings (read-only)
- [ ] Settings (no access)
- [ ] Profile (full permissions)
- [ ] Profile (read-only)
- [ ] Profile (no access)
- [ ] Dashboard (authenticated access)

### Resource Pages - Full Permissions
- [ ] Diary (full CRUD)
- [ ] Notes (full CRUD)
- [ ] Todos (full CRUD)
- [ ] Projects (full CRUD)
- [ ] Resources (full CRUD)

### Resource Pages - Read Only
- [ ] Diary (read only)
- [ ] Notes (read only)
- [ ] Todos (read only)
- [ ] Projects (read only)
- [ ] Resources (read only)

### Resource Pages - No Access
- [ ] Diary (no access)
- [ ] Notes (no access)
- [ ] Todos (no access)
- [ ] Projects (no access)
- [ ] Resources (no access)

### Edge Cases
- [ ] Switch roles mid-session (logout/login)
- [ ] Direct URL navigation to restricted pages
- [ ] Browser refresh on protected pages
- [ ] Network tab shows no 403 errors
- [ ] Loading states work correctly
- [ ] NoAccess messages are clear

---

## Troubleshooting

### Issue: Changes not applying
**Solution:**
- Ensure you logged out and back in
- Clear browser cache if needed
- Check that permission changes were saved in admin panel

### Issue: Still seeing 403 errors
**Solution:**
- Check that fetch functions have permission guards
- Verify error suppression: `if (error.response?.status !== 403)`
- Look for API calls happening before permission checks

### Issue: NoAccess showing when it shouldn't
**Solution:**
- Check role permissions in admin panel
- Verify permissions were saved
- Confirm logout/login cycle completed
- Check browser console for permission values

### Issue: Buttons still visible with no permissions
**Solution:**
- Verify conditional rendering: `{canCreate && <Button />}`
- Check permission hook: `usePermission(Permission.XXX_CREATE)`
- Ensure importing Permission enum correctly

---

## Quick Command to Test

```bash
# Clear browser data and test fresh
1. Open DevTools (F12)
2. Application tab → Clear storage → Clear site data
3. Close DevTools
4. Login again
5. Test permissions
```

---

## Success Criteria

✅ **All tests pass:**
- NoAccess shows when permissions missing
- Buttons hidden when user lacks permission
- No 403 errors in console
- Loading states display correctly
- Permission messages are clear

✅ **User experience is smooth:**
- Fast loading times
- Clear feedback on restrictions
- Helpful error messages
- Intuitive navigation

✅ **Security is solid:**
- Cannot bypass via URL manipulation
- API calls respect permissions
- Admin features properly protected
- Settings modifications require authorization

---

**Testing Complete When:**
1. All checklist items checked ✓
2. No console errors
3. All pages load correctly
4. Permission changes work as expected
5. NoAccess messages display properly

**Estimated Testing Time:** 30-45 minutes for complete coverage
