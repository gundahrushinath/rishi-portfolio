import { LayoutDashboard, FileText, BookOpen, Settings } from 'lucide-react';

export const DASHBOARD_NAVIGATION = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Projects',
    icon: FileText,
    href: '/dashboard/projects',
  },
  {
    title: 'Resources',
    icon: BookOpen,
    href: '/dashboard/resources',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
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
