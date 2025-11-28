'use client';

import { useEffect, useMemo, useState } from 'react';
import { Note } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { NoAccess } from '@/components/auth/NoAccess';
import { Permission } from '@/models/user';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useNotes } from '@/hooks/use-notes';
import { NoteForm } from '@/components/dashboard/notes/NoteForm';
import { NoteFilters } from '@/components/dashboard/notes/NoteFilters';
import { NoteStats } from '@/components/dashboard/notes/NoteStats';
import { NoteCard } from '@/components/dashboard/notes/NoteCard';
import { useTheme } from 'next-themes';
import { NoteInput } from '@/lib/api';

export default function NotesPage() {
  const { loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const {
    notes,
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
  } = useNotes();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'n' && canCreate) {
        event.preventDefault();
        setShowForm(true);
      }
      if (event.key === 'Escape' && showForm) {
        event.preventDefault();
        resetForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, canCreate]);

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  const handleCreate = async (values: NoteInput) => {
    try {
      setIsSubmitting(true);
      await createNote(values);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: NoteInput) => {
    if (!editingNote) return;
    try {
      setIsSubmitting(true);
      await updateNote(editingNote._id, values);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete._id);
    setNoteToDelete(null);
  };

  const editingDefaults: NoteInput | undefined = useMemo(() => {
    if (!editingNote) return undefined;
    return {
      title: editingNote.title,
      content: editingNote.content,
      category: editingNote.category,
      tags: editingNote.tags,
      color: editingNote.color,
      isPinned: editingNote.isPinned,
      isArchived: editingNote.isArchived,
    };
  }, [editingNote]);

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!canRead) {
    return <NoAccess feature="Notes" permission={Permission.NOTE_READ} />;
  }

  const hasActiveFilters = Boolean(
    searchQuery || categoryFilter !== 'all' || pinnedFilter !== 'all' || showArchived,
  );

  const initialLoading = isLoading && notes.length === 0 && !showForm;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Notes</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Organize your thoughts, meeting notes, and quick reminders.
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          )}
        </div>

        {!showForm && <NoteStats stats={stats} showArchived={showArchived} />}

        {!showForm && (
          <NoteFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            pinnedFilter={pinnedFilter}
            onPinnedChange={setPinnedFilter}
            showArchived={showArchived}
            onArchivedChange={setShowArchived}
          />
        )}

        {showForm && (
          <NoteForm
            initialData={editingDefaults}
            onSubmit={editingNote ? handleUpdate : handleCreate}
            onCancel={resetForm}
            isEditing={Boolean(editingNote)}
            isSubmitting={isSubmitting}
          />
        )}

        {!showForm && (
          <>
            {initialLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="h-[200px]">
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-14 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{showArchived ? 'No archived notes' : 'No notes yet'}</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {hasActiveFilters
                      ? 'No notes match your filters. Try adjusting them.'
                      : 'Start by capturing a thought or reminder.'}
                  </p>
                  {canCreate && !showArchived && !hasActiveFilters && (
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create Note
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    isDark={theme === 'dark'}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    canCreate={canCreate}
                    onEdit={(item) => {
                      setEditingNote(item);
                      setShowForm(true);
                    }}
                    onDuplicate={duplicateNote}
                    onTogglePin={togglePin}
                    onToggleArchive={toggleArchive}
                    onDeleteRequest={setNoteToDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={Boolean(noteToDelete)} onOpenChange={(open) => !open && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note "{noteToDelete?.title}" will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
