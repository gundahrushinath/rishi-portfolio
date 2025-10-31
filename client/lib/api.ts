import axios from 'axios';
import { User, UserRole } from '@/models/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface SigninData {
  email: string;
  password: string;
}

// Export User from models
export type { User, UserRole };

export interface AuthResponse {
  message: string;
  user: User;
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

export interface ProjectInput {
  title: string;
  description?: string;
  status?: 'Active' | 'In Progress' | 'Completed';
  tags?: string[];
  dueDate?: string;
  link?: string;
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

export interface ResourceInput {
  title: string;
  description?: string;
  category?: string;
  url: string;
  thumbnail?: string;
  tags?: string[];
  isFeatured?: boolean;
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

export interface NoteInput {
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  reminder?: string;
  attachments?: { name: string; url: string; type: string }[];
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

export interface DiaryInput {
  title: string;
  content: string;
  date?: string;
  mood?: string;
  weather?: string;
  tags?: string[];
  isPrivate?: boolean;
  location?: string;
  images?: string[];
  gratitudeList?: string[];
  goals?: { description: string; completed: boolean }[];
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

export interface TodoInput {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  category?: string;
  dueDate?: string;
  tags?: string[];
  subtasks?: { title: string; completed: boolean }[];
  estimatedTime?: number;
  actualTime?: number;
  recurring?: { enabled: boolean; frequency: string; endDate?: string };
  reminder?: string;
  notes?: string;
}

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  signin: async (data: SigninData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  signout: async (): Promise<void> => {
    await api.post('/auth/signout');
  },

  verifyToken: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const projectService = {
  getAll: async (): Promise<{ projects: Project[] }> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id: string): Promise<{ project: Project }> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: ProjectInput): Promise<{ message: string; project: Project }> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  update: async (id: string, data: ProjectInput): Promise<{ message: string; project: Project }> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const resourceService = {
  getAll: async (params?: { category?: string; isFeatured?: boolean }): Promise<{ resources: Resource[] }> => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ resource: Resource }> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  create: async (data: ResourceInput): Promise<{ message: string; resource: Resource }> => {
    const response = await api.post('/resources', data);
    return response.data;
  },

  update: async (id: string, data: ResourceInput): Promise<{ message: string; resource: Resource }> => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },
};

export const noteService = {
  getAll: async (filters?: { category?: string; isPinned?: boolean; isArchived?: boolean; search?: string }): Promise<{ notes: Note[] }> => {
    const response = await api.get('/notes', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ note: Note }> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  create: async (data: NoteInput): Promise<{ message: string; note: Note }> => {
    const response = await api.post('/notes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<NoteInput>): Promise<{ message: string; note: Note }> => {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  duplicate: async (id: string): Promise<{ message: string; note: Note }> => {
    const response = await api.post(`/notes/${id}/duplicate`);
    return response.data;
  },
};

export const diaryService = {
  getAll: async (filters?: { mood?: string; startDate?: string; endDate?: string }): Promise<{ diaries: Diary[] }> => {
    const response = await api.get('/diaries', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ diary: Diary }> => {
    const response = await api.get(`/diaries/${id}`);
    return response.data;
  },

  create: async (data: DiaryInput): Promise<{ message: string; diary: Diary }> => {
    const response = await api.post('/diaries', data);
    return response.data;
  },

  update: async (id: string, data: Partial<DiaryInput>): Promise<{ message: string; diary: Diary }> => {
    const response = await api.put(`/diaries/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/diaries/${id}`);
    return response.data;
  },

  getMoodStats: async (): Promise<{ stats: { mood: string; count: number }[] }> => {
    const response = await api.get('/diaries/stats/mood');
    return response.data;
  },
};

export const todoService = {
  getAll: async (filters?: { priority?: string; status?: string; category?: string }): Promise<{ todos: Todo[] }> => {
    const response = await api.get('/todos', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ todo: Todo }> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  create: async (data: TodoInput): Promise<{ message: string; todo: Todo }> => {
    const response = await api.post('/todos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<TodoInput>): Promise<{ message: string; todo: Todo }> => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  updateSubtask: async (todoId: string, subtaskId: string, completed: boolean): Promise<{ message: string; todo: Todo }> => {
    const response = await api.patch(`/todos/${todoId}/subtasks/${subtaskId}`, { completed });
    return response.data;
  },

  getStatistics: async (): Promise<{ statistics: { total: number; completed: number; inProgress: number; overdue: number; byPriority: Record<string, number>; byCategory: Record<string, number> } }> => {
    const response = await api.get('/todos/stats');
    return response.data;
  },
};

export default api;
