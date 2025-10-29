/**
 * User Model
 * Represents user data structure throughout the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token?: string;
}

export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  company?: string;
  role?: string;
}

/**
 * Auth-related types
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

/**
 * API Response types
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Form State types
 */
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface AuthFormState {
  email: FormField;
  password: FormField;
  name?: FormField;
  confirmPassword?: FormField;
  isSubmitting: boolean;
  generalError?: string;
}
