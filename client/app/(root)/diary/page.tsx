'use client';

import { useEffect, useState } from 'react';
import { useDiary } from '@/hooks/use-diary';
import { Diary } from '@/lib/api';
import { Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { NoAccess } from '@/components/auth/NoAccess';
import { DiaryForm } from '@/components/dashboard/diary/DiaryForm';
import { DiaryCard } from '@/components/dashboard/diary/DiaryCard';
import { DiaryFilters } from '@/components/dashboard/diary/DiaryFilters';
import { DiaryStats } from '@/components/dashboard/diary/DiaryStats';
import { DiaryFormValues } from '@/lib/validation';
import { Permission } from '@/models/user';

export default function DiaryPage() {
  const {
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
  } = useDiary();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Diary | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && canCreate) {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === 'Escape') {
        if (showForm) {
          e.preventDefault();
          resetForm();
        }
        setSelectedEntries(new Set());
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canCreate, showForm, setSelectedEntries]);

  const resetForm = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleCreate = async (values: DiaryFormValues) => {
    try {
      setIsSubmitting(true);
      await createEntry(values);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: DiaryFormValues) => {
    if (!editingEntry) return;
    try {
      setIsSubmitting(true);
      await updateEntry(editingEntry._id, values);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (entry: Diary) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (entryToDelete) {
      await deleteEntry(entryToDelete);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  if (!canRead) {
    return <NoAccess feature="Diary" permission={Permission.DIARY_READ} />;
  }

  const hasActiveFilters = Boolean(searchQuery || moodFilter !== 'all' || showFavorite);

  const initialLoading = isLoading && entries.length === 0 && !showForm;

  if (initialLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Diary</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Record your thoughts, feelings, and daily experiences.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={showFavorite ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowFavorite(!showFavorite)}
              className={showFavorite ? 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20' : ''}
            >
              <Star className={`mr-2 h-4 w-4 ${showFavorite ? 'fill-yellow-600' : ''}`} />
              Favorites
            </Button>
            {canCreate && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            )}
          </div>
        </div>

        {!showForm && <DiaryStats stats={stats} isLoading={isLoading} />}

        {!showForm && (
          <DiaryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            moodFilter={moodFilter}
            onMoodFilterChange={setMoodFilter}
            showFavorite={showFavorite}
            onShowFavoriteChange={setShowFavorite}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onClearFilters={() => {
              setSearchQuery('');
              setMoodFilter('all');
              setShowFavorite(false);
            }}
          />
        )}

        {showForm && (
          <DiaryForm
            defaultValues={editingEntry ? {
              title: editingEntry.title,
              content: editingEntry.content,
              mood: editingEntry.mood,
              tags: editingEntry.tags.join(', '),
              date: new Date(editingEntry.date).toISOString().split('T')[0],
              isFavorite: editingEntry.isFavorite,
            } : undefined}
            onSubmit={editingEntry ? handleUpdate : handleCreate}
            isSubmitting={isSubmitting}
            onCancel={resetForm}
            isEditing={!!editingEntry}
          />
        )}

        {!showForm && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-[200px]">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No entries found</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {hasActiveFilters
                      ? 'No entries match your filters. Try adjusting them.'
                      : 'Start your diary by creating your first entry.'}
                  </p>
                  {canCreate && !hasActiveFilters && (
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((entry) => (
                  <DiaryCard
                    key={entry._id}
                    entry={entry}
                    isSelected={selectedEntries.has(entry._id)}
                    onToggleSelect={toggleEntrySelection}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the diary entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
