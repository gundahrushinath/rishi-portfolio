# Email Verification & Password Reset Setup Guide

## 🎉 Features Implemented

✅ **Email Verification**
- Users must verify their email after signup
- Verification link sent via email (24-hour expiry)
- Users cannot sign in until email is verified
- Automatic login after successful verification
- Resend verification email option

✅ **Password Reset**
- Forgot password functionality
- Reset link sent via email (1-hour expiry)
- Secure token-based reset process
- New password validation

## 📧 SMTP Configuration

### For Gmail Users (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Rishi Portfolio" or similar
   - Click "Generate"
   - Copy the 16-character password

3. **Update `server/.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-character-app-password
   EMAIL_FROM=your-gmail@gmail.com
   ```

### For Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@yahoo.com
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com
```

## 🔄 User Flow

### Sign Up Flow

1. User fills signup form
2. Backend creates user account (emailVerified: false)
3. Verification token generated and stored (hashed)
4. Verification email sent to user
5. User sees "Check Your Email" success message
6. User clicks link in email → Redirected to `/verify-email?token=...`
7. Backend verifies token and marks email as verified
8. Welcome email sent
9. User automatically logged in
10. Redirected to dashboard

### Sign In Flow

1. User enters credentials
2. Backend checks if email is verified
3. If **not verified**: Error message + link to resend verification
4. If **verified**: User logged in successfully

### Password Reset Flow

1. User clicks "Forgot Password?" on sign in page
2. Enters email on `/forgot-password`
3. Reset token generated and email sent
4. User clicks link in email → Redirected to `/reset-password?token=...`
5. User enters new password
6. Backend validates token and updates password
7. User redirected to sign in page

## 🛠️ API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create account & send verification email | No |
| POST | `/api/auth/signin` | Sign in (requires verified email) | No |
| POST | `/api/auth/signout` | Sign out | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes |
| GET | `/api/auth/verify-email?token=...` | Verify email with token | No |
| POST | `/api/auth/resend-verification` | Resend verification email | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password?token=...` | Reset password with token | No |

## 📱 Frontend Pages

| Route | Purpose |
|-------|---------|
| `/` | Portfolio home page |
| `/signup` | User registration |
| `/signin` | User login |
| `/forgot-password` | Request password reset |
| `/reset-password?token=...` | Reset password form |
| `/verify-email?token=...` | Email verification |
| `/dashboard` | Protected dashboard (requires verified email) |

## 🔐 Security Features

### Email Verification Tokens
- Generated using crypto.randomBytes(32)
- Stored as SHA-256 hash in database
- 24-hour expiration
- Single-use (deleted after verification)

### Password Reset Tokens
- Generated using crypto.randomBytes(32)
- Stored as SHA-256 hash in database
- 1-hour expiration
- Single-use (deleted after reset)

### Password Security
- Minimum 6 characters
- Hashed with bcrypt (10 salt rounds)
- Automatic hashing on user creation/update

## 📧 Email Templates

### 1. Verification Email
- **Subject**: "Verify Your Email - Hrushinath Portfolio"
- **Contains**: Verification link, expiry notice
- **Styling**: Blue gradient header

### 2. Welcome Email
- **Subject**: "Welcome to Hrushinath Portfolio - Email Verified!"
- **Contains**: Welcome message, dashboard link
- **Styling**: Cyan gradient header

### 3. Password Reset Email
- **Subject**: "Reset Your Password - Hrushinath Portfolio"
- **Contains**: Reset link, security warnings
- **Styling**: Pink gradient header

## 🧪 Testing

### Test Email Verification

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. Sign up with a real email address
3. Check your email inbox
4. Click verification link
5. Verify you're redirected to dashboard

### Test Password Reset

1. Go to sign in page
2. Click "Forgot password?"
3. Enter your email
4. Check email inbox
5. Click reset link
6. Enter new password
7. Try signing in with new password

## ⚠️ Common Issues & Solutions

### Issue: Emails not sending

**Solution:**
1. Check SMTP credentials in `.env`
2. For Gmail, ensure you're using App Password, not regular password
3. Check console logs for detailed error messages
4. Verify SMTP_HOST and SMTP_PORT are correct

### Issue: "Invalid or expired token"

**Solution:**
- Tokens expire (24h for verification, 1h for reset)
- Request a new verification/reset email
- Ensure you're using the full token from the URL

### Issue: Still can't sign in after verification

**Solution:**
- Check if emailVerified is true in MongoDB
- Clear browser cookies
- Try resending verification email

## 📊 Database Schema Updates

```typescript
User Model:
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  emailVerified: boolean (default: false)      // NEW
  verificationToken: string (select: false)     // NEW
  verificationTokenExpires: Date (select: false) // NEW
  resetPasswordToken: string (select: false)     // NEW
  resetPasswordExpires: Date (select: false)     // NEW
  createdAt: Date
}
```

## 🚀 Production Considerations

### Before Deploying:

1. **Use a professional email service**:
   - SendGrid (12,000 free emails/month)
   - Mailgun (5,000 free emails/month)
   - AWS SES (62,000 free emails/month)

2. **Update environment variables**:
   - Use production SMTP credentials
   - Change JWT_SECRET to a strong random value
   - Set NODE_ENV=production

3. **Update CLIENT_URL**:
   - Change to your production domain
   - Update CORS settings accordingly

4. **Email template improvements**:
   - Add your logo
   - Customize branding colors
   - Add footer links (privacy policy, contact, etc.)

## 📝 Environment Variables Checklist

Make sure these are set in `server/.env`:

```env
✓ PORT=5000
✓ MONGODB_URI=mongodb://localhost:27017/rishi-portfolio
✓ JWT_SECRET=<your-generated-secret>
✓ JWT_EXPIRES_IN=7d
✓ NODE_ENV=development
✓ CLIENT_URL=http://localhost:3000
✓ SMTP_HOST=smtp.gmail.com
✓ SMTP_PORT=587
✓ SMTP_USER=<your-email>
✓ SMTP_PASS=<your-app-password>
✓ EMAIL_FROM=<your-email>
```

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add email verification reminder after X days
- [ ] Add rate limiting for password reset requests
- [ ] Add email change functionality with reverification
- [ ] Add email notification preferences
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Add login history/activity log
- [ ] Add email templates for account security alerts

---

## 🆘 Need Help?

If you encounter issues:
1. Check backend logs (`server/` terminal)
2. Check frontend console (browser DevTools)
3. Verify MongoDB is running
4. Ensure all environment variables are set correctly
5. Check email spam/junk folder

**Email not received?**
- Gmail: Check "Social" or "Promotions" tabs
- Check spam folder
- Verify SMTP credentials are correct
- Check backend terminal for email sending errors

---

**Setup Complete!** 🎉

Your authentication system now includes:
- ✅ Email verification
- ✅ Password reset
- ✅ Secure token generation
- ✅ Professional email templates
- ✅ User-friendly frontend pages
