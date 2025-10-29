'use client';

import { useState, useEffect } from 'react';
import { noteService, NoteInput } from '@/lib/api';
import { Note } from '@/models/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/lib/toast';
import { Plus, Pin, Archive, Copy, Trash2, Edit2, X, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NOTE_COLORS, getNoteColor } from '@/lib/theme-colors';

const NOTE_CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Code Snippet', 'Meeting', 'Other'] as const;

// Helper function for relative time
const getRelativeTime = (date: string) => {
  const now = new Date();
  const noteDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - noteDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return noteDate.toLocaleDateString();
};

export default function NotesPage() {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPinned, setFilterPinned] = useState<boolean | undefined>(undefined);
  const [filterArchived, setFilterArchived] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<NoteInput>({
    title: '',
    content: '',
    category: 'Personal',
    tags: [],
    color: '#ffffff',
    isPinned: false,
    isArchived: false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [filterCategory, filterPinned, filterArchived, searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
      }
      // Escape: Close form
      if (e.key === 'Escape' && showForm) {
        e.preventDefault();
        resetForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterCategory) filters.category = filterCategory;
      if (filterPinned !== undefined) filters.isPinned = filterPinned;
      // Always filter by archived status: false = show active notes, true = show archived notes
      filters.isArchived = filterArchived;
      if (searchQuery) filters.search = searchQuery;

      const response = await noteService.getAll(filters);
      setNotes(response.notes);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        const response = await noteService.update(editingNote._id, formData);
        // If the note's archived state matches current filter, show it, otherwise hide it
        if (response.note.isArchived === filterArchived) {
          setNotes(notes.map(n => n._id === editingNote._id ? response.note : n));
        } else {
          setNotes(notes.filter(n => n._id !== editingNote._id));
        }
        toast.success('Note updated successfully!');
      } else {
        const response = await noteService.create(formData);
        // Only add to view if it matches current filter
        if (response.note.isArchived === filterArchived) {
          setNotes([response.note, ...notes]);
        }
        toast.success('Note created successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await noteService.delete(id);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note deleted successfully!');
      setNoteToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await noteService.duplicate(id);
      setNotes([response.note, ...notes]);
      toast.success('Note duplicated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to duplicate note');
    }
  };

  const togglePin = async (note: Note) => {
    try {
      const response = await noteService.update(note._id, { isPinned: !note.isPinned });
      setNotes(notes.map(n => n._id === note._id ? response.note : n));
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const toggleArchive = async (note: Note) => {
    try {
      const response = await noteService.update(note._id, { isArchived: !note.isArchived });
      // Remove the note from current view since it's now in a different state
      setNotes(notes.filter(n => n._id !== note._id));
      toast.success(note.isArchived ? 'Note unarchived and moved to active notes' : 'Note archived successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Personal',
      tags: [],
      color: '#ffffff',
      isPinned: false,
      isArchived: false,
    });
    setTagInput('');
    setEditingNote(null);
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      color: note.color,
      isPinned: note.isPinned,
      isArchived: note.isArchived,
    });
    setShowForm(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  };

  // Sort notes: pinned first, then by creation date
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-3 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
          <p className="text-muted-foreground">Organize your thoughts and ideas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{notes.length}</span>
          <span className="text-muted-foreground">
            {filterArchived ? 'archived' : 'active'} {notes.length === 1 ? 'note' : 'notes'}
          </span>
        </div>
        {notes.filter(n => n.isPinned).length > 0 && !filterArchived && (
          <div className="flex items-center gap-2 text-sm">
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{notes.filter(n => n.isPinned).length}</span>
            <span className="text-muted-foreground">pinned</span>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterCategory || "all"} onValueChange={(value) => setFilterCategory(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {NOTE_CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filterPinned === undefined ? 'all' : String(filterPinned)} 
          onValueChange={(value) => setFilterPinned(value === 'all' ? undefined : value === 'true')}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notes</SelectItem>
            <SelectItem value="true">Pinned Only</SelectItem>
            <SelectItem value="false">Unpinned Only</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={filterArchived ? 'default' : 'outline'}
          onClick={() => setFilterArchived(!filterArchived)}
          className="w-full md:w-auto"
        >
          <Archive className="mr-2 h-4 w-4" />
          {filterArchived ? 'Show Active Notes' : 'Show Archived Notes'}
        </Button>
      </div>

      {/* Note Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</CardTitle>
                    <span className="text-sm text-muted-foreground">(* Required fields)</span>
                  </div>
                  <CardDescription>
                    {editingNote ? 'Update your note details below' : 'Fill in the details to create a new note'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    {editingNote ? 'Update Note' : 'Create Note'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="max-h-[600px]">
              <CardContent className="space-y-6 pr-4">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter a descriptive title for your note"
                  className="text-base"
                />
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px] resize-none text-base"
                  placeholder="Write your note content here..."
                />
                <p className="text-xs text-muted-foreground">
                  Share your thoughts, ideas, or important information
                </p>
              </div>

              <Separator className="my-6" />

              {/* Category and Color Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Note Color</Label>
                  <div className="flex gap-2 items-center pt-1">
                    {NOTE_COLORS.map(colorObj => {
                      const colorValue = theme === 'dark' ? colorObj.dark : colorObj.light;
                      const isSelected = formData.color === colorObj.light || formData.color === colorObj.dark;
                      return (
                        <button
                          key={colorObj.label}
                          type="button"
                          title={colorObj.label}
                          className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                            isSelected 
                              ? 'border-primary ring-2 ring-primary/30 scale-110' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: colorValue }}
                          onClick={() => setFormData({ ...formData, color: colorValue })}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-semibold">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Type a tag and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                        {tag}
                        <X 
                          className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                          onClick={() => removeTag(tag)} 
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isPinned"
                    checked={formData.isPinned}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPinned: checked as boolean })}
                  />
                  <Label htmlFor="isPinned" className="cursor-pointer">Pin this note</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isArchived"
                    checked={formData.isArchived}
                    onCheckedChange={(checked) => setFormData({ ...formData, isArchived: checked as boolean })}
                  />
                  <Label htmlFor="isArchived" className="cursor-pointer">Archive</Label>
                </div>
              </div>
            </CardContent>
            </ScrollArea>
          </form>
        </Card>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Archive className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {filterArchived ? 'No archived notes' : 'No active notes found'}
            </p>
            <p className="text-sm text-muted-foreground">
              {filterArchived 
                ? 'Archive notes to move them here for later reference' 
                : 'Create your first note to get started!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
          {sortedNotes.map(note => {
            const noteColor = getNoteColor(note.color, theme === 'dark');
            return (
              <Card
                key={note._id}
                style={{ backgroundColor: noteColor }}
                className={`relative group border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  note.isPinned ? 'ring-2 ring-primary/20 border-primary/30' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {note.isPinned && <Pin className="h-4 w-4" />}
                      {note.title}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-2">{note.category}</Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => togglePin(note)}
                          >
                            <Pin className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{note.isPinned ? 'Unpin' : 'Pin'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(note)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDuplicate(note._id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Duplicate</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleArchive(note)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{note.isArchived ? 'Unarchive' : 'Archive'}</p>
                        </TooltipContent>
                      </Tooltip>

                      <AlertDialog open={noteToDelete === note._id} onOpenChange={(open) => !open && setNoteToDelete(null)}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setNoteToDelete(note._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the note "{note.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(note._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24 w-full rounded-md">
                  {note.content ? (
                    <p className="text-sm pr-4">{note.content}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic pr-4">No content</p>
                  )}
                </ScrollArea>
                <div className="flex flex-wrap gap-1 mt-4">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex justify-between items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">{getRelativeTime(note.createdAt)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                      {note.updatedAt && note.updatedAt !== note.createdAt && (
                        <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
                {note.isPinned && (
                  <Badge variant="outline" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </CardFooter>
            </Card>
          );
          })}
        </div>
      )}
    </div>
    </div>
  );
}
