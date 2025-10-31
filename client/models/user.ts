/**
 * User Model
 * Represents user data structure throughout the application
 */

// User Roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// Resource Permissions
export enum Permission {
  // Project permissions
  PROJECT_CREATE = 'project:create',
  PROJECT_READ = 'project:read',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  PROJECT_READ_ALL = 'project:read:all',
  
  // Note permissions
  NOTE_CREATE = 'note:create',
  NOTE_READ = 'note:read',
  NOTE_UPDATE = 'note:update',
  NOTE_DELETE = 'note:delete',
  NOTE_READ_ALL = 'note:read:all',
  
  // Diary permissions
  DIARY_CREATE = 'diary:create',
  DIARY_READ = 'diary:read',
  DIARY_UPDATE = 'diary:update',
  DIARY_DELETE = 'diary:delete',
  DIARY_READ_ALL = 'diary:read:all',
  
  // Todo permissions
  TODO_CREATE = 'todo:create',
  TODO_READ = 'todo:read',
  TODO_UPDATE = 'todo:update',
  TODO_DELETE = 'todo:delete',
  TODO_READ_ALL = 'todo:read:all',
  
  // Resource permissions
  RESOURCE_CREATE = 'resource:create',
  RESOURCE_READ = 'resource:read',
  RESOURCE_UPDATE = 'resource:update',
  RESOURCE_DELETE = 'resource:delete',
  RESOURCE_READ_ALL = 'resource:read:all',
  
  // User management permissions
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_READ_ALL = 'user:read:all',
  USER_UPDATE_ALL = 'user:update:all',
  USER_DELETE_ALL = 'user:delete:all',
  
  // Settings permissions
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: Permission[]; // Dynamic permissions from backend
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
  // role is inherited from User interface
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

/**
 * RBAC Helper Functions
 */

// Role to Permissions Mapping
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    Permission.PROJECT_CREATE,
    Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_READ_ALL,
    Permission.NOTE_CREATE,
    Permission.NOTE_READ,
    Permission.NOTE_UPDATE,
    Permission.NOTE_DELETE,
    Permission.NOTE_READ_ALL,
    Permission.DIARY_CREATE,
    Permission.DIARY_READ,
    Permission.DIARY_UPDATE,
    Permission.DIARY_DELETE,
    Permission.DIARY_READ_ALL,
    Permission.TODO_CREATE,
    Permission.TODO_READ,
    Permission.TODO_UPDATE,
    Permission.TODO_DELETE,
    Permission.TODO_READ_ALL,
    Permission.RESOURCE_CREATE,
    Permission.RESOURCE_READ,
    Permission.RESOURCE_UPDATE,
    Permission.RESOURCE_DELETE,
    Permission.RESOURCE_READ_ALL,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_READ_ALL,
    Permission.USER_UPDATE_ALL,
    Permission.USER_DELETE_ALL,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
  ],
  [UserRole.USER]: [
    // Regular users can manage their own resources
    Permission.PROJECT_CREATE,
    Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE,
    Permission.PROJECT_DELETE,
    Permission.NOTE_CREATE,
    Permission.NOTE_READ,
    Permission.NOTE_UPDATE,
    Permission.NOTE_DELETE,
    Permission.DIARY_CREATE,
    Permission.DIARY_READ,
    Permission.DIARY_UPDATE,
    Permission.DIARY_DELETE,
    Permission.TODO_CREATE,
    Permission.TODO_READ,
    Permission.TODO_UPDATE,
    Permission.TODO_DELETE,
    Permission.RESOURCE_CREATE,
    Permission.RESOURCE_READ,
    Permission.RESOURCE_UPDATE,
    Permission.RESOURCE_DELETE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.SETTINGS_READ,
    Permission.SETTINGS_UPDATE,
  ],
  [UserRole.GUEST]: [
    // Guest users have limited read-only access
    Permission.PROJECT_READ,
    Permission.NOTE_READ,
    Permission.RESOURCE_READ,
    Permission.USER_READ,
    Permission.SETTINGS_READ,
  ]
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission, userPermissions?: Permission[]): boolean => {
  // Use dynamic permissions if provided, otherwise fall back to static mapping
  if (userPermissions !== undefined) {
    return userPermissions.includes(permission);
  }
  const permissions = RolePermissions[role];
  return permissions.includes(permission);
};

// Helper function to get all permissions for a role
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return RolePermissions[role];
};

// Helper function to check if user has permission
export const userHasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  return hasPermission(user.role, permission, user.permissions);
};

// Helper function to check if user has any of the permissions
export const userHasAnyPermission = (user: User | null, ...permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user.role, permission, user.permissions));
};

// Helper function to check if user has all permissions
export const userHasAllPermissions = (user: User | null, ...permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user.role, permission, user.permissions));
};
