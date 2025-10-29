// Example: Toast patterns used throughout the application

import { toast } from 'sonner';

// ========================================
// 1. AUTH PAGES - Success Patterns
// ========================================

// Sign In Success
toast.success('Welcome back!', {
  description: 'You have successfully signed in.',
});

// Sign Up Success
toast.success('Account created!', {
  description: 'Please check your email to verify your account.',
});

// Password Reset Email Sent
toast.success('Email sent!', {
  description: 'Check your inbox for password reset instructions.',
});

// Password Reset Success
toast.success('Password reset successful!', {
  description: 'You can now sign in with your new password.',
});

// Email Verified
toast.success('Email verified!', {
  description: 'Your email has been successfully verified.',
});

// Sign Out Success
toast.success('Signed out', {
  description: 'You have been successfully signed out.',
});

// ========================================
// 2. AUTH PAGES - Error Patterns
// ========================================

// Sign In Failed
toast.error('Sign in failed', {
  description: 'Invalid email or password.',
});

// Sign Up Failed
toast.error('Sign up failed', {
  description: 'An account with this email already exists.',
});

// Invalid Token
toast.error('Invalid link', {
  description: 'The verification link is invalid or has expired.',
});

// Generic Error
toast.error('Request failed', {
  description: 'Something went wrong. Please try again.',
});

// ========================================
// 3. VALIDATION - Warning Patterns
// ========================================

// Password Mismatch
toast.error('Validation error', {
  description: 'Passwords do not match.',
});

// Password Too Short
toast.error('Validation error', {
  description: 'Password must be at least 6 characters.',
});

// Invalid Email
toast.error('Validation error', {
  description: 'Please enter a valid email address.',
});

// ========================================
// 4. PROMISE-BASED PATTERNS
// ========================================

// Loading with automatic success/error
toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading data...',
    success: 'Data loaded successfully!',
    error: 'Failed to load data',
  }
);

// ========================================
// 5. INFO & WARNING PATTERNS
// ========================================

// Info
toast.info('New feature available', {
  description: 'Check out our new dashboard!',
});

// Warning
toast.warning('Session expiring soon', {
  description: 'Your session will expire in 5 minutes.',
});

// ========================================
// 6. TOAST WITH ACTION BUTTON
// ========================================

toast.success('Changes saved', {
  description: 'Your profile has been updated.',
  action: {
    label: 'View',
    onClick: () => console.log('View profile'),
  },
});

// ========================================
// 7. CUSTOM DURATION
// ========================================

// Short duration (2 seconds)
toast.success('Copied to clipboard!', {
  duration: 2000,
});

// Long duration (10 seconds)
toast.error('Critical error', {
  description: 'Please contact support.',
  duration: 10000,
});

// ========================================
// 8. USING TOAST UTILS
// ========================================

import { toastUtils } from '@/lib/toast';

// Simple success
toastUtils.success('Operation completed', 'Your changes were saved.');

// Auth-specific
toastUtils.auth.signInSuccess();
toastUtils.auth.passwordResetSent();
toastUtils.auth.invalidToken();

// Validation-specific
toastUtils.validation.passwordMismatch();
toastUtils.validation.requiredField('Username');

// Promise with utils
toastUtils.promise(
  submitData(),
  {
    loading: 'Submitting...',
    success: 'Submitted successfully!',
    error: 'Submission failed',
  }
);
function submitData(): Promise<unknown> {
    throw new Error('Function not implemented.');
}

