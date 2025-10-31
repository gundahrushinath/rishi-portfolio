/**
 * RBAC (Role-Based Access Control) Type Definitions
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
  PROJECT_READ_ALL = 'project:read:all', // Admin can read all users' projects
  
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
