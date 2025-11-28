import { useCallback, useEffect, useMemo, useState } from 'react';
import { noteService, Note, NoteInput } from '@/lib/api';
import { toast } from '@/lib/toast';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { NOTE_CATEGORY_OPTIONS } from '@/lib/constants';

interface NoteStats {
  total: number;
  pinned: number;
  categories: Record<string, number>;
}

type CategoryFilter = (typeof NOTE_CATEGORY_OPTIONS)[number] | 'all';
type PinnedFilter = 'all' | 'pinned' | 'unpinned';

export function useNotes() {
  const canRead = usePermission(Permission.NOTE_READ);
  const canCreate = usePermission(Permission.NOTE_CREATE);
  const canUpdate = usePermission(Permission.NOTE_UPDATE);
  const canDelete = usePermission(Permission.NOTE_DELETE);

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [pinnedFilter, setPinnedFilter] = useState<PinnedFilter>('all');
  const [showArchived, setShowArchived] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!canRead) return;
    try {
      setIsLoading(true);
      const filters: Record<string, string | boolean> = { isArchived: showArchived };
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (pinnedFilter !== 'all') filters.isPinned = pinnedFilter === 'pinned';
      if (searchQuery) filters.search = searchQuery;

      const response = await noteService.getAll(filters);
      setNotes(response.notes);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        toast.error(error.response?.data?.message || 'Failed to fetch notes');
      }
    } finally {
      setIsLoading(false);
    }
  }, [canRead, categoryFilter, pinnedFilter, searchQuery, showArchived]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const sortedNotes = useMemo(() => {
    const copy = [...notes];
    return copy.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes]);

  const stats: NoteStats = useMemo(() => {
    const pinned = notes.filter((note) => note.isPinned).length;
    const categories: Record<string, number> = {};

    notes.forEach((note) => {
      const key = note.category || 'Other';
      categories[key] = (categories[key] || 0) + 1;
    });

    return {
      total: notes.length,
      pinned,
      categories,
    };
  }, [notes]);

  const noteMatchesView = (note: Note) => note.isArchived === showArchived;

  const createNote = async (values: NoteInput) => {
    const response = await noteService.create(values);
    if (noteMatchesView(response.note)) {
      setNotes((prev) => [response.note, ...prev]);
    }
    toast.success('Note created successfully!');
  };

  const updateNote = async (noteId: string, values: NoteInput) => {
    const response = await noteService.update(noteId, values);
    if (noteMatchesView(response.note)) {
      setNotes((prev) => prev.map((note) => (note._id === noteId ? response.note : note)));
    } else {
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    }
    toast.success('Note updated successfully!');
  };

  const deleteNote = async (noteId: string) => {
    await noteService.delete(noteId);
    setNotes((prev) => prev.filter((note) => note._id !== noteId));
    toast.success('Note deleted successfully!');
  };

  const duplicateNote = async (noteId: string) => {
    const response = await noteService.duplicate(noteId);
    if (noteMatchesView(response.note)) {
      setNotes((prev) => [response.note, ...prev]);
    }
    toast.success('Note duplicated successfully!');
  };

  const togglePin = async (note: Note) => {
    const response = await noteService.update(note._id, { isPinned: !note.isPinned });
    setNotes((prev) => prev.map((item) => (item._id === note._id ? response.note : item)));
    toast.success(response.note.isPinned ? 'Note pinned' : 'Note unpinned');
  };

  const toggleArchive = async (note: Note) => {
    const response = await noteService.update(note._id, { isArchived: !note.isArchived });
    setNotes((prev) => prev.filter((item) => item._id !== note._id));
    toast.success(response.note.isArchived ? 'Note archived' : 'Note moved back to active');
  };

  return {
    notes: sortedNotes,
    isLoading,
    stats,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    pinnedFilter,
    setPinnedFilter,
    showArchived,
    setShowArchived,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePin,
    toggleArchive,
    refresh: fetchNotes,
  };
}
