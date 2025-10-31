# RBAC Migration Guide for Existing Deployments

## 🎯 Purpose

This guide helps you migrate your existing portfolio application to include the new Role-Based Access Control (RBAC) system.

---

## ⚠️ Breaking Changes

The following changes may affect existing functionality:

1. **User Schema**: Added `role` field (default: `USER`)
2. **Auth Middleware**: Now fetches and includes role in request
3. **All Protected Routes**: Now require specific permissions
4. **API Responses**: User objects now include `role` field

---

## 📋 Migration Checklist

### Pre-Migration

- [ ] **Backup your database** before proceeding
- [ ] Read through the RBAC documentation
- [ ] Test in development environment first
- [ ] Notify users of planned downtime (if applicable)

### Database Migration

- [ ] All existing users will automatically get `USER` role (default)
- [ ] No manual database changes needed for basic migration
- [ ] Create at least one admin user (see below)

### Code Deployment

- [ ] Pull/merge latest code
- [ ] Install dependencies (no new packages needed)
- [ ] Restart server
- [ ] Test authentication flow
- [ ] Test resource access

### Post-Migration

- [ ] Create admin user(s)
- [ ] Test different user roles
- [ ] Verify permission checks work
- [ ] Update any custom code that references User model

---

## 🔄 Step-by-Step Migration

### Step 1: Backup Database

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/rishi-portfolio" --out=./backup/$(date +%Y%m%d)

# Or if using MongoDB Atlas
# Use Atlas backup feature in the dashboard
```

### Step 2: Pull Latest Code

```bash
git pull origin main
# or
git merge rbac-implementation
```

### Step 3: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Step 4: Update Environment Variables

No new environment variables needed! Your existing `.env` files should work as-is.

### Step 5: Build and Restart

```bash
# Backend
cd server
npm run build  # If using production build
npm run dev    # Or use dev mode

# Frontend
cd client
npm run build  # If using production build
npm run dev    # Or use dev mode
```

### Step 6: Create Admin User

**Option A: Using the CLI Script (Recommended)**
```bash
cd server
npm run create-admin
```

Follow the interactive prompts to create your admin user.

**Option B: Via MongoDB Shell**
```javascript
// Connect to MongoDB
mongosh "mongodb://localhost:27017/rishi-portfolio"

// Update an existing user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

// Verify the update
db.users.findOne({ email: "your-email@example.com" }, { role: 1, email: 1 })
```

**Option C: Via MongoDB Compass**
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user document
5. Edit the document and add/change: `"role": "admin"`
6. Save changes

### Step 7: Test Authentication

1. **Sign in as regular user**:
   - Should work normally
   - Should have access to own resources
   - Should NOT see admin features

2. **Sign in as admin**:
   - Should work normally
   - Should have access to all features
   - Should see admin panel/routes

3. **Test API endpoints**:
   ```bash
   # Test protected route (should work with valid token)
   curl -X GET http://localhost:5000/api/projects \
     -H "Cookie: token=YOUR_JWT_TOKEN"

   # Test admin route (should fail for non-admin)
   curl -X GET http://localhost:5000/api/users \
     -H "Cookie: token=YOUR_JWT_TOKEN"
   ```

### Step 8: Verify Migration

- [ ] Existing users can sign in
- [ ] Existing users have `USER` role by default
- [ ] Admin user(s) created successfully
- [ ] Protected routes work correctly
- [ ] Permission checks are enforced
- [ ] Frontend shows/hides features correctly
- [ ] No console errors

---

## 🔍 Troubleshooting

### Issue: "Role not defined" error

**Solution**: Make sure you've restarted the server after pulling the latest code.

```bash
cd server
# Kill the process and restart
npm run dev
```

### Issue: Existing users can't access resources

**Check 1**: Verify users have a role assigned
```javascript
db.users.find({}, { email: 1, role: 1 })
```

**Check 2**: If role is missing, add it:
```javascript
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: "user" } }
)
```

### Issue: Admin user not working

**Verify admin role**:
```javascript
db.users.findOne({ email: "admin@example.com" }, { role: 1 })
```

**Should return**: `{ role: "admin" }`

**If not**, update:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Issue: 403 Forbidden errors

**Possible Causes**:
1. Token doesn't include role (old token from before migration)
2. User role not set in database
3. Permission configuration issue

**Solution**:
1. Clear cookies and sign in again (gets new token with role)
2. Verify role in database
3. Check middleware is applied to route

### Issue: TypeScript compilation errors

**Solution**: Clear build cache and reinstall
```bash
# Backend
cd server
rm -rf dist node_modules
npm install
npm run build

# Frontend
cd client
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Database Migration Scripts

### Script 1: Add Role to All Existing Users

```javascript
// Connect to MongoDB
mongosh "mongodb://localhost:27017/rishi-portfolio"

// Add default role to users without one
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: "user" } }
)

// Verify
db.users.find({}, { email: 1, role: 1 }).pretty()
```

### Script 2: Create Multiple Admin Users

```javascript
// Promote multiple users to admin
const adminEmails = [
  "admin1@example.com",
  "admin2@example.com",
  "admin3@example.com"
];

adminEmails.forEach(email => {
  db.users.updateOne(
    { email: email },
    { $set: { role: "admin" } }
  );
  print(`Updated ${email} to admin`);
});
```

### Script 3: Create Guest Users

```javascript
// Demote users to guest
db.users.updateMany(
  { email: { $in: ["guest1@example.com", "guest2@example.com"] } },
  { $set: { role: "guest" } }
)
```

### Script 4: Audit User Roles

```javascript
// Count users by role
db.users.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
])

// Expected output:
// { _id: "admin", count: 1 }
// { _id: "user", count: 50 }
// { _id: "guest", count: 5 }
```

---

## 🚀 Rollback Plan (If Needed)

If you need to rollback the migration:

### Step 1: Restore Database

```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/rishi-portfolio" ./backup/YYYYMMDD
```

### Step 2: Revert Code

```bash
# Revert to previous commit
git revert HEAD
# or
git checkout <previous-commit-hash>
```

### Step 3: Restart Services

```bash
# Restart backend and frontend
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

---

## ✅ Post-Migration Best Practices

### 1. Monitor Logs

Watch server logs for:
- 403 errors (permission denied)
- Authentication failures
- Database errors

```bash
# View logs
cd server
npm run dev
# Watch for errors in console
```

### 2. User Communication

Notify users about:
- New admin features (if applicable)
- Any UI changes
- Contact point for issues

### 3. Create Admin Documentation

Document for your team:
- How to manage user roles
- Admin panel features
- Permission system overview

### 4. Regular Audits

Periodically check:
- User role distribution
- Admin access logs
- Permission usage

---

## 📞 Support

If you encounter issues during migration:

1. Check the troubleshooting section above
2. Review RBAC documentation:
   - `RBAC_IMPLEMENTATION_GUIDE.md`
   - `RBAC_QUICK_REFERENCE.md`
3. Check server logs for specific errors
4. Verify database connection and schema

---

## 🎉 Success!

Once migration is complete, you'll have:
- ✅ All users with appropriate roles
- ✅ Admin user(s) with full access
- ✅ Permission-based access control
- ✅ Secure, scalable role system
- ✅ Type-safe implementation

**Your application is now enterprise-ready with RBAC!** 🚀
