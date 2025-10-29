/**
 * Theme-aware color utilities for consistent dark/light mode support
 * Uses Tailwind CSS dark mode classes for automatic theme switching
 */

// Priority badge colors (works in both light and dark mode)
export const PRIORITY_BADGE_COLORS: Record<string, string> = {
  'Low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Urgent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// Status badge colors (works in both light and dark mode)
export const STATUS_BADGE_COLORS: Record<string, string> = {
  'Todo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

// Category badge colors (works in both light and dark mode)
export const CATEGORY_BADGE_COLORS: Record<string, string> = {
  'Work': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'Personal': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  'Study': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Health': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Shopping': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Video': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'Course': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Tutorial': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Article': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Documentation': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

// Note colors (theme-aware with better dark mode support)
export const NOTE_COLORS = [
  { light: '#ffffff', dark: '#1f2937', label: 'Default' },
  { light: '#ffebee', dark: '#7f1d1d', label: 'Red' },
  { light: '#e3f2fd', dark: '#1e3a8a', label: 'Blue' },
  { light: '#e8f5e9', dark: '#14532d', label: 'Green' },
  { light: '#fff9c4', dark: '#713f12', label: 'Yellow' },
  { light: '#fce4ec', dark: '#831843', label: 'Pink' },
  { light: '#f3e5f5', dark: '#581c87', label: 'Purple' },
  { light: '#e0f2f1', dark: '#134e4a', label: 'Teal' },
];

// Helper function to get note color based on theme
export function getNoteColor(colorValue: string, isDark: boolean): string {
  const colorObj = NOTE_COLORS.find(c => c.light === colorValue || c.dark === colorValue);
  if (!colorObj) return isDark ? NOTE_COLORS[0].dark : NOTE_COLORS[0].light;
  return isDark ? colorObj.dark : colorObj.light;
}

// Mood colors for diary (theme-aware)
export const MOOD_COLORS: Record<string, string> = {
  '😊': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  '😔': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  '😡': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  '😰': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  '😴': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  '🤩': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  '😌': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  '🤔': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};
