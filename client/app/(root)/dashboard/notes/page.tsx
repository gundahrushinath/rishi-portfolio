'use client';

import { useState, useEffect } from 'react';
import { noteService, NoteInput } from '@/lib/api';
import { Note } from '@/models/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { Plus, Pin, Archive, Copy, Trash2, Edit2, X, Search } from 'lucide-react';

const NOTE_CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'Code Snippet', 'Meeting', 'Other'] as const;
const NOTE_COLORS = ['#ffffff', '#ffebee', '#e3f2fd', '#e8f5e9', '#fff9c4', '#fce4ec', '#f3e5f5', '#e0f2f1'];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPinned, setFilterPinned] = useState<boolean | undefined>(undefined);
  const [filterArchived, setFilterArchived] = useState<boolean>(false);

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

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterCategory) filters.category = filterCategory;
      if (filterPinned !== undefined) filters.isPinned = filterPinned;
      if (filterArchived) filters.isArchived = filterArchived;
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
        setNotes(notes.map(n => n._id === editingNote._id ? response.note : n));
        toast.success('Note updated successfully!');
      } else {
        const response = await noteService.create(formData);
        setNotes([response.note, ...notes]);
        toast.success('Note created successfully!');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await noteService.delete(id);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note deleted successfully!');
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
      setNotes(notes.map(n => n._id === note._id ? response.note : n));
      toast.success(note.isArchived ? 'Note unarchived' : 'Note archived');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Organize your thoughts and ideas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Note'}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {NOTE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border rounded-md"
          value={filterPinned === undefined ? '' : String(filterPinned)}
          onChange={(e) => setFilterPinned(e.target.value === '' ? undefined : e.target.value === 'true')}
        >
          <option value="">All Notes</option>
          <option value="true">Pinned Only</option>
          <option value="false">Unpinned Only</option>
        </select>
        <Button
          variant={filterArchived ? 'default' : 'outline'}
          onClick={() => setFilterArchived(!filterArchived)}
        >
          {filterArchived ? 'Show Active' : 'Show Archived'}
        </Button>
      </div>

      {/* Note Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[200px] px-3 py-2 border rounded-md"
                  placeholder="Write your note here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    {NOTE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2">
                    {NOTE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  />
                  <span>Pin this note</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isArchived}
                    onChange={(e) => setFormData({ ...formData, isArchived: e.target.checked })}
                  />
                  <span>Archive</span>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit">{editingNote ? 'Update Note' : 'Create Note'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No notes found. Create your first note!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map(note => (
            <Card
              key={note._id}
              style={{ backgroundColor: note.color }}
              className="relative group"
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePin(note)}
                      title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(note)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDuplicate(note._id)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleArchive(note)}
                      title={note.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(note._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3 mb-4">{note.content}</p>
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {new Date(note.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
