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

// Project Form Validation
import * as z from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  status: z.enum(['Active', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  tags: z.string().optional(),
  technologies: z.string().optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  progress: z.number().min(0).max(100),
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters').optional(),
  isFeatured: z.boolean(),
  isArchived: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const resourceFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  category: z.enum(['Tutorial', 'Article', 'Video', 'Course', 'Tool', 'Documentation', 'Library', 'Other']),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  thumbnail: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  isFeatured: z.boolean(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export const diaryFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  content: z.string().min(1, 'Content is required'),
  date: z.string(),
  mood: z.enum(['Happy', 'Neutral', 'Sad', 'Excited', 'Tired', 'Stressed', 'Grateful']),
  tags: z.string().optional(),
  isFavorite: z.boolean(),
});

export type DiaryFormValues = z.infer<typeof diaryFormSchema>;
