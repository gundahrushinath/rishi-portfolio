# Quick Start Guide - Testing Notes, Diary, and Todos

## Prerequisites
✅ MongoDB running and connected
✅ Server running on port 5000
✅ Client running on port 3000
✅ User account created and authenticated

## Step-by-Step Testing Guide

### 1. Start Both Servers

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
# Should see: "Server is running on port 5000"
# Should see: "MongoDB connected successfully"
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
# Should see: "Ready on http://localhost:3000"
```

### 2. Access the Dashboard

1. Open browser: `http://localhost:3000`
2. Sign in with your credentials
3. Navigate to Dashboard: `http://localhost:3000/dashboard`
4. Verify the sidebar shows new options:
   - ✅ Notes
   - ✅ Diary
   - ✅ Todos

### 3. Test Notes Feature

#### Navigate to Notes
- Click "Notes" in the sidebar
- URL should be: `http://localhost:3000/dashboard/notes`

#### Create a Note
1. Click "New Note" button
2. Fill in the form:
   - **Title**: "My First Note"
   - **Content**: "This is a test note"
   - **Category**: Select "Personal"
   - **Tags**: "test, important"
   - **Color**: Choose a color
   - Toggle "Pin this note"
3. Click "Create Note"
4. ✅ Should see success toast
5. ✅ Note appears in the list immediately
6. ✅ Pinned note shows at the top with pin icon

#### Test Note Features
- **Search**: Type in search box - notes filter instantly
- **Filter by Category**: Select different categories
- **Pin/Unpin**: Click menu → Pin/Unpin
- **Archive**: Click menu → Archive
- **Duplicate**: Click menu → Duplicate
- **Edit**: Click menu → Edit → Make changes → Update
- **Delete**: Click menu → Delete → Confirm

#### Verify Statistics
- Total Notes count updates
- Pinned count updates
- Archived count updates
- Categories count updates

### 4. Test Diary Feature

#### Navigate to Diary
- Click "Diary" in the sidebar
- URL should be: `http://localhost:3000/dashboard/diary`

#### Create a Diary Entry
1. Click "New Entry" button
2. Fill in the form:
   - **Title**: "My Day"
   - **Content**: "Today was productive. I worked on the portfolio project."
   - **Date**: Select today's date
   - **Mood**: Select "Happy" 😊
   - **Weather**: "Sunny"
   - **Tags**: "work, productive"
   - **Location**: "Home Office"
3. Add Gratitude:
   - Type "Good health" → Click "Add"
   - Type "Great team" → Click "Add"
4. Add Goals:
   - Type "Complete API integration" → Click "Add Goal"
   - Check the checkbox to mark as completed
5. Click "Create Entry"
6. ✅ Should see success toast
7. ✅ Entry appears with mood emoji

#### Test Diary Features
- **View Statistics**: Click "View Statistics" to see mood trends
- **Filter by Mood**: Use mood filter dropdown
- **Edit Entry**: Click Edit → Modify → Update
- **Mark Goals Complete**: Check/uncheck goal checkboxes
- **Delete Entry**: Click Delete → Confirm

#### Verify Mood Statistics
- Mood distribution shows correctly
- Count per mood type

### 5. Test Todos Feature

#### Navigate to Todos
- Click "Todos" in the sidebar
- URL should be: `http://localhost:3000/dashboard/todos`

#### Create a Todo
1. Click "New Todo" button
2. Fill in the form:
   - **Title**: "Complete Documentation"
   - **Description**: "Write comprehensive docs for the project"
   - **Priority**: "High"
   - **Status**: "In Progress"
   - **Category**: "Work"
   - **Due Date**: Select tomorrow
   - **Tags**: "documentation, urgent"
   - **Estimated Time**: 120 (minutes)
3. Add Subtasks:
   - Type "Write README" → Click "Add Subtask"
   - Type "Add API docs" → Click "Add Subtask"
   - Type "Create examples" → Click "Add Subtask"
4. Click "Create Todo"
5. ✅ Should see success toast
6. ✅ Todo appears with priority color badge

#### Test Todo Features
- **View Statistics**: Click "View Statistics" for comprehensive analytics
- **Filter by Priority**: Select High/Medium/Low/Urgent
- **Filter by Status**: Select Todo/In Progress/Completed
- **Filter by Category**: Select different categories
- **Mark Complete**: Check todo checkbox
- **Complete Subtasks**: Check individual subtask boxes
- **Edit Todo**: Click Edit → Modify → Update
- **Delete Todo**: Click Delete → Confirm

#### Verify Statistics Dashboard
- Total todos count
- Completed count
- In Progress count
- Overdue count
- Priority breakdown (Low, Medium, High, Urgent)
- Category breakdown (Work, Personal, Study, etc.)

### 6. Test Real-time Updates

#### Test Immediate UI Updates
1. **Create**: New item appears instantly at top of list
2. **Update**: Changes reflect immediately without page reload
3. **Delete**: Item disappears instantly
4. **Filter**: Results update immediately as you type/select

#### Test Data Persistence
1. Create some items
2. Refresh the page (F5)
3. ✅ All items still there
4. Navigate away and back
5. ✅ All items still there

### 7. Test Cross-Feature Navigation

1. From Dashboard → Notes → Create note → Success
2. From Notes → Diary → Create entry → Success
3. From Diary → Todos → Create todo → Success
4. From Todos → Dashboard → See overview
5. All navigation should work smoothly

### 8. Test Mobile Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1920px width
4. ✅ Sidebar should collapse on mobile
5. ✅ Cards should stack properly
6. ✅ Forms should be scrollable

## Expected Results

### ✅ Success Indicators
- [ ] All navigation links work
- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Filters work instantly
- [ ] Search works across title, content, tags
- [ ] Statistics update automatically
- [ ] Toast notifications appear for actions
- [ ] UI updates immediately without refresh
- [ ] Data persists after refresh
- [ ] Mobile layout works properly
- [ ] No console errors

### 🚫 Common Issues & Solutions

#### Issue: "Failed to fetch"
**Solution**: Check if backend server is running on port 5000

#### Issue: "Unauthorized"
**Solution**: Sign in again - JWT token might have expired

#### Issue: "Cannot connect to MongoDB"
**Solution**: Ensure MongoDB is running and connection string is correct

#### Issue: Items not appearing
**Solution**: 
1. Check browser console for errors
2. Check if you're signed in
3. Verify API URL in `.env.local`

#### Issue: Filters not working
**Solution**: 
1. Clear filters and try again
2. Refresh the page
3. Check if data exists

## API Testing with curl (Optional)

### Test Notes API
```powershell
# Get all notes (requires authentication)
curl http://localhost:5000/api/notes `
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Create note
curl http://localhost:5000/api/notes `
  -X POST `
  -H "Content-Type: application/json" `
  -H "Cookie: token=YOUR_JWT_TOKEN" `
  -d '{\"title\":\"Test\",\"content\":\"Test content\"}'
```

### Test Diary API
```powershell
# Get all diary entries
curl http://localhost:5000/api/diaries `
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Get mood statistics
curl http://localhost:5000/api/diaries/stats/mood `
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

### Test Todos API
```powershell
# Get all todos
curl http://localhost:5000/api/todos `
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Get statistics
curl http://localhost:5000/api/todos/stats `
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

## Performance Checks

### Load Testing
1. Create 50+ notes
2. ✅ Page should load within 2 seconds
3. ✅ Search should return results instantly
4. ✅ Filters should work smoothly

### Memory Testing
1. Create multiple items in each section
2. Navigate between pages
3. ✅ No memory leaks
4. ✅ Smooth transitions

## Final Checklist

- [ ] Backend server running
- [ ] Frontend client running
- [ ] MongoDB connected
- [ ] User signed in
- [ ] Notes page accessible and functional
- [ ] Diary page accessible and functional
- [ ] Todos page accessible and functional
- [ ] All CRUD operations work
- [ ] All filters work
- [ ] Statistics display correctly
- [ ] Real-time updates work
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Data persists

## Screenshots to Verify

1. **Dashboard Overview** - Shows all navigation items
2. **Notes List** - Shows notes with filters and stats
3. **Diary List** - Shows entries with mood indicators
4. **Todos List** - Shows todos with priority colors
5. **Create Forms** - All forms properly styled
6. **Statistics** - All stats display correctly

## Next Steps

Once all tests pass:
1. ✅ Features are production-ready
2. Consider adding more advanced features (see NOTES_DIARY_TODOS_IMPLEMENTATION.md)
3. Deploy to production
4. Monitor for any issues
5. Gather user feedback

## Support

If you encounter any issues:
1. Check server logs
2. Check browser console
3. Verify environment variables
4. Check MongoDB connection
5. Review API responses in Network tab

---

**Status**: Ready for Testing ✅
**Last Updated**: January 2024
**Version**: 1.0.0
