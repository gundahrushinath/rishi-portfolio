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
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  demoUrl?: string;
  sourceUrl?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail?: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
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
