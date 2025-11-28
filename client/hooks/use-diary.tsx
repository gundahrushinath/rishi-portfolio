import { useState, useEffect, useMemo, useCallback } from 'react';
import { diaryService, Diary } from '@/lib/api';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { DiaryFormValues } from '@/lib/validation';

export function useDiary() {
  // Assuming permissions are similar to projects, or we can use generic ones if specific ones don't exist.
  // If DIARY permissions don't exist in Permission enum, I might need to add them or use generic ones.
  // For now, I'll assume they might not exist and check Permission enum later.
  // Let's use generic or check if I can add them.
  // Actually, I should check `client/models/user.ts` for permissions.
  
  const canRead = usePermission(Permission.DIARY_READ);
  const canCreate = usePermission(Permission.DIARY_CREATE);
  const canUpdate = usePermission(Permission.DIARY_UPDATE);
  const canDelete = usePermission(Permission.DIARY_DELETE);

  const [entries, setEntries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [showFavorite, setShowFavorite] = useState(false);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<{ totalEntries: number; moodStats: { _id: string; count: number }[]; entriesThisMonth: number } | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!canRead) return;
    try {
      setIsLoading(true);
      const filters: any = { sortBy, order: sortOrder };
      if (moodFilter !== 'all') filters.mood = moodFilter;
      if (searchQuery) filters.search = searchQuery;
      if (showFavorite) filters.isFavorite = true;
      
      const data = await diaryService.getAll(filters);
      setEntries(data.entries ?? []);
      
      // Also fetch stats
      const statsData = await diaryService.getStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching diary entries:', error);
      toast.error('Failed to load diary entries');
    } finally {
      setIsLoading(false);
    }
  }, [canRead, sortBy, sortOrder, moodFilter, searchQuery, showFavorite]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const createEntry = async (values: DiaryFormValues) => {
    const entryData = {
      title: values.title.trim(),
      content: values.content,
      mood: values.mood,
      tags: (values.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
      date: values.date,
      isFavorite: values.isFavorite,
    };

    const data = await diaryService.create(entryData);
    setEntries((prev) => [data.diary, ...prev]);
    toast.success('Diary entry created successfully');
    fetchEntries(); // Refresh stats
    return data.diary;
  };

  const updateEntry = async (id: string, values: DiaryFormValues) => {
    const entryData = {
      title: values.title.trim(),
      content: values.content,
      mood: values.mood,
      tags: (values.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
      date: values.date,
      isFavorite: values.isFavorite,
    };

    const data = await diaryService.update(id, entryData);
    setEntries((prev) => prev.map((e) => (e._id === id ? data.diary : e)));
    toast.success('Diary entry updated successfully');
    fetchEntries(); // Refresh stats
    return data.diary;
  };

  const deleteEntry = async (id: string) => {
    await diaryService.delete(id);
    setEntries((prev) => prev.filter((e) => e._id !== id));
    setSelectedEntries((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success('Diary entry deleted successfully');
    fetchEntries(); // Refresh stats
  };

  const toggleEntrySelection = (id: string) => {
    setSelectedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return {
    entries,
    isLoading,
    stats,
    selectedEntries,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    searchQuery,
    setSearchQuery,
    moodFilter,
    setMoodFilter,
    showFavorite,
    setShowFavorite,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    createEntry,
    updateEntry,
    deleteEntry,
    toggleEntrySelection,
    setSelectedEntries,
    refresh: fetchEntries,
  };
}
