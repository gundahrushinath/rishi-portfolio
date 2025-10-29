export const AUTH_VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_ERROR: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH_ERROR: 'Passwords do not match',
} as const;

export function validatePassword(password: string): string | null {
  if (password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
    return AUTH_VALIDATION.PASSWORD_ERROR;
  }
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return AUTH_VALIDATION.PASSWORD_MISMATCH_ERROR;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}
