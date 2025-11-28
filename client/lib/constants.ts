import { LayoutDashboard, FileText, BookOpen, Settings, StickyNote, Book, CheckSquare } from 'lucide-react';

// Main navigation for authenticated users
// Follows MVC architecture - routes map to controllers/services
// Prepared for future RBAC implementation
export const DASHBOARD_NAVIGATION = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Projects',
    icon: FileText,
    href: '/projects',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Resources',
    icon: BookOpen,
    href: '/resources',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Notes',
    icon: StickyNote,
    href: '/notes',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Diary',
    icon: Book,
    href: '/diary',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Todos',
    icon: CheckSquare,
    href: '/todos',
    // Future: roles: ['user', 'admin']
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    // Future: roles: ['user', 'admin']
  },
] as const;

export const AUTH_STYLES = {
  card: 'w-full max-w-md bg-slate-900/50 border-slate-800',
  input: 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500',
  button: 'w-full bg-blue-600 hover:bg-blue-700',
  label: 'text-white',
  link: 'text-blue-400 hover:text-blue-300',
  text: 'text-slate-400',
} as const;

export const NOTE_CATEGORY_OPTIONS = [
  'Personal',
  'Work',
  'Study',
  'Ideas',
  'Code Snippet',
  'Meeting',
  'Other',
] as const;

export const TODO_PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;
export const TODO_STATUS_OPTIONS = ['Todo', 'In Progress', 'Completed', 'Cancelled'] as const;
export const TODO_CATEGORY_OPTIONS = ['Work', 'Personal', 'Study', 'Health', 'Shopping', 'Other'] as const;
