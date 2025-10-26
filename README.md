# Hrushinath's Portfolio - Enterprise Authentication Application

A full-stack authentication and portfolio application built with Next.js, Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

- **Portfolio Home Page**: Showcase of Hrushinath's skills and projects
- **Enterprise-Grade Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Password Security**: Bcrypt hashing with salting for password storage
- **Protected Routes**: Dashboard accessible only after authentication
- **Modern UI**: Tailwind CSS and shadcn/ui components
- **TypeScript**: Full type safety across frontend and backend
- **MongoDB Integration**: User data stored securely in MongoDB

## 📁 Project Structure

```
rishi-portfolio/
├── client/          # Next.js frontend
│   ├── app/         # App router pages
│   ├── components/  # UI components (shadcn)
│   ├── contexts/    # Auth context
│   └── lib/         # API utilities
└── server/          # Node.js/Express backend
    ├── src/
    │   ├── config/      # Database configuration
    │   ├── controllers/ # Auth controllers
    │   ├── middleware/  # Auth middleware
    │   ├── models/      # Mongoose models
    │   └── routes/      # API routes
    └── .env         # Environment variables
```

## 🛠️ Technologies

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Axios** - API requests
- **js-cookie** - Cookie management
- **lucide-react** - Icons

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cookie-parser** - Cookie parsing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository (if needed)
```bash
cd c:\Users\iamth\OneDrive\Desktop\rishi-portfolio
```

### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies (already done)
npm install

# The .env file is already configured with:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/rishi-portfolio
# - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# - JWT_EXPIRES_IN=7d
# - NODE_ENV=development
# - CLIENT_URL=http://localhost:3000

# Make sure MongoDB is running on your system
# If not, start MongoDB service

# Run the development server
npm run dev
```

The backend server will start on http://localhost:5000

### 3. Setup Frontend

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies (already done)
npm install

# The .env.local file is already configured with:
# - NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run the development server
npm run dev
```

The frontend will start on http://localhost:3000

## 🎯 Usage

1. **Home Page** (`/`): 
   - View Hrushinath's portfolio
   - Click "Insiders Only" button to access protected content
   - Redirects to signin if not authenticated

2. **Sign Up** (`/signup`):
   - Create a new account
   - Password must be at least 6 characters
   - Password is hashed with bcrypt and salt

3. **Sign In** (`/signin`):
   - Sign in with email and password
   - JWT token stored in HTTP-only cookie
   - Automatically redirected to dashboard

4. **Dashboard** (`/dashboard`):
   - Protected route (requires authentication)
   - Displays user information
   - Access to exclusive content
   - Sign out functionality

## 🔐 Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Protection**: Configured for specific origin
- **Input Validation**: Email format and password length validation
- **Error Handling**: Secure error messages without exposing sensitive data

## 📡 API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out and clear cookie
- `GET /api/auth/verify` - Verify JWT token (protected)

### Health Check

- `GET /api/health` - Server health status

## 🗄️ Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  createdAt: Date (default: now)
}
```

## 🚦 Running in Production

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm start
```

**Important**: Change the JWT_SECRET in production to a secure random string!

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: Check your MongoDB service
- Verify connection string in `server/.env`
- Check if port 27017 is available

### CORS Errors
- Verify CLIENT_URL in `server/.env` matches your frontend URL
- Check if both servers are running

### Authentication Issues
- Clear browser cookies and try again
- Check if JWT_SECRET is set in `server/.env`
- Verify MongoDB is accessible

## 📝 License

This project is for portfolio purposes.

## 👨‍💻 Author

**Hrushinath**
- Portfolio: [Your Portfolio URL]
- GitHub: [Your GitHub URL]
- LinkedIn: [Your LinkedIn URL]

---

Built with ❤️ using Next.js, Node.js, and MongoDB
