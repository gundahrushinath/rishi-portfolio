/**
 * Dashboard Models
 * Data structures for dashboard-related entities
 */

export interface DashboardStats {
  totalProjects: number;
  totalResources: number;
  totalViews: number;
  totalLikes: number;
}

export interface Project {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: 'Active' | 'In Progress' | 'Completed';
  tags: string[];
  dueDate?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail?: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Personal' | 'Work' | 'Study' | 'Ideas' | 'Code Snippet' | 'Meeting' | 'Other';
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  color: string;
  reminder?: string;
  attachments: { name: string; url: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Diary {
  _id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  mood: 'Happy' | 'Sad' | 'Neutral' | 'Excited' | 'Anxious' | 'Grateful' | 'Tired' | 'Motivated';
  weather?: string;
  tags: string[];
  isPrivate: boolean;
  location?: string;
  images: string[];
  gratitudeList: string[];
  goals: { description: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Completed' | 'Cancelled';
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Shopping' | 'Other';
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  subtasks: { _id?: string; title: string; completed: boolean; completedAt?: string }[];
  estimatedTime?: number;
  actualTime?: number;
  recurring?: { enabled: boolean; frequency: string; endDate?: string };
  reminder?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'project' | 'resource' | 'profile';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  stats: DashboardStats;
  recentProjects: Project[];
  recentActivities: Activity[];
  notifications: Notification[];
}
