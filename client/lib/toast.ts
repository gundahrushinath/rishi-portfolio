import { toast } from 'sonner';

/**
 * Re-export toast for convenience
 */
export { toast };

/**
 * Utility functions for common toast patterns
 */
export const toastUtils = {
  /**
   * Success toast with standard formatting
   */
  success: (title: string, description?: string) => {
    toast.success(title, description ? { description } : undefined);
  },

  /**
   * Error toast with standard formatting
   */
  error: (title: string, description?: string) => {
    toast.error(title, description ? { description } : undefined);
  },

  /**
   * Info toast with standard formatting
   */
  info: (title: string, description?: string) => {
    toast.info(title, description ? { description } : undefined);
  },

  /**
   * Warning toast with standard formatting
   */
  warning: (title: string, description?: string) => {
    toast.warning(title, description ? { description } : undefined);
  },

  /**
   * Loading toast with promise handling
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  /**
   * Common auth-related toasts
   */
  auth: {
    signInSuccess: () => toast.success('Welcome back!', {
      description: 'You have successfully signed in.',
    }),
    signOutSuccess: () => toast.success('Signed out', {
      description: 'You have been successfully signed out.',
    }),
    signUpSuccess: () => toast.success('Account created!', {
      description: 'Please check your email to verify your account.',
    }),
    verifyEmailSuccess: () => toast.success('Email verified!', {
      description: 'Your email has been successfully verified.',
    }),
    passwordResetSent: () => toast.success('Email sent!', {
      description: 'Check your inbox for password reset instructions.',
    }),
    passwordResetSuccess: () => toast.success('Password reset successful!', {
      description: 'You can now sign in with your new password.',
    }),
    invalidToken: () => toast.error('Invalid link', {
      description: 'The link is invalid or has expired.',
    }),
    sessionExpired: () => toast.error('Session expired', {
      description: 'Please sign in again to continue.',
    }),
  },

  /**
   * Common validation toasts
   */
  validation: {
    passwordMismatch: () => toast.error('Validation error', {
      description: 'Passwords do not match.',
    }),
    passwordTooShort: () => toast.error('Validation error', {
      description: 'Password must be at least 6 characters.',
    }),
    invalidEmail: () => toast.error('Validation error', {
      description: 'Please enter a valid email address.',
    }),
    requiredField: (fieldName: string) => toast.error('Validation error', {
      description: `${fieldName} is required.`,
    }),
  },
};
