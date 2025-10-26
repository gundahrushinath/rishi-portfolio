# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js installed (v18+)
- ✅ MongoDB installed and running
- ✅ npm or yarn installed

## Step 1: Start MongoDB

Make sure MongoDB is running on your system. 

### Windows:
```bash
# Check if MongoDB service is running
net start MongoDB

# Or start it manually if installed via installer
# MongoDB should be running on mongodb://localhost:27017
```

### macOS/Linux:
```bash
# Start MongoDB service
brew services start mongodb-community
# or
sudo systemctl start mongod
```

## Step 2: Start Backend Server

Open a terminal/command prompt:

```bash
# Navigate to server directory
cd c:\Users\iamth\OneDrive\Desktop\rishi-portfolio\server

# Start the development server
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

## Step 3: Start Frontend Server

Open a **NEW** terminal/command prompt:

```bash
# Navigate to client directory
cd c:\Users\iamth\OneDrive\Desktop\rishi-portfolio\client

# Start the development server
npm run dev
```

You should see:
```
▲ Next.js 16.x.x
- Local: http://localhost:3000
```

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 🎯 Test the Application

1. **Home Page**: Visit http://localhost:3000
   - You should see Hrushinath's portfolio
   - Click "Insiders Only" button

2. **Sign Up**: You'll be redirected to sign in
   - Click "Sign up" link
   - Create an account with:
     - Name: Test User
     - Email: test@example.com
     - Password: password123

3. **Dashboard**: After successful signup
   - You'll be automatically redirected to the dashboard
   - You should see your user information

4. **Sign Out**: Click "Sign Out" button
   - You'll be redirected to home page

5. **Sign In**: Try signing in again
   - Use the same credentials
   - You should be able to access the dashboard

## 🔧 Troubleshooting

### MongoDB Not Running
If you see "MongoDB connection error":
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
If port 3000 or 5000 is busy:
- Backend: Change PORT in `server/.env`
- Frontend: Use `npm run dev -- -p 3001` to use different port

### CORS Errors
Make sure both servers are running and CLIENT_URL in `server/.env` matches your frontend URL.

### Authentication Issues
1. Clear browser cookies
2. Check MongoDB is running
3. Restart both servers

## 📝 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rishi-portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎉 Success!

If everything is working:
- ✅ You can access the home page
- ✅ You can sign up/sign in
- ✅ You can access the protected dashboard
- ✅ You can sign out

Enjoy exploring the application! 🚀
