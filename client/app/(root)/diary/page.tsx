'use client';

import { useState, useEffect } from 'react';
import { diaryService, DiaryInput } from '@/lib/api';
import { Diary } from '@/models/dashboard';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/lib/toast';
import { Plus, Trash2, Edit2, X, CheckSquare, Square, TrendingUp } from 'lucide-react';
import { MOOD_COLORS } from '@/lib/theme-colors';

const MOOD_OPTIONS = ['Happy', 'Sad', 'Neutral', 'Excited', 'Anxious', 'Grateful', 'Tired', 'Motivated'] as const;
const MOOD_EMOJIS: Record<string, string> = {
  'Happy': '😊',
  'Sad': '�',
  'Neutral': '😐',
  'Excited': '🤩',
  'Anxious': '😰',
  'Grateful': '�',
  'Tired': '😴',
  'Motivated': '🤔'
};

export default function DiaryPage() {
  // Helper function for relative time
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [moodStats, setMoodStats] = useState<{ mood: string; count: number }[]>([]);
  const [diaryToDelete, setDiaryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<DiaryInput>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: 'Neutral',
    weather: '',
    tags: [],
    isPrivate: false,
    location: '',
    images: [],
    gratitudeList: [],
    goals: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [gratitudeInput, setGratitudeInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
        setEditingDiary(null);
      }
      if (e.key === 'Escape' && showForm) {
        e.preventDefault();
        setShowForm(false);
        resetForm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  useEffect(() => {
    fetchDiaries();
    fetchMoodStats();
  }, []);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await diaryService.getAll();
      setDiaries(response.diaries);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch diary entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodStats = async () => {
    try {
      const response = await diaryService.getMoodStats();
      setMoodStats(response.stats);
    } catch (error: any) {
      console.error('Failed to fetch mood stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDiary) {
        const response = await diaryService.update(editingDiary._id, formData);
        setDiaries(diaries.map(d => d._id === editingDiary._id ? response.diary : d));
        toast.success('Diary entry updated successfully!');
      } else {
        const response = await diaryService.create(formData);
        setDiaries([response.diary, ...diaries]);
        toast.success('Diary entry created successfully!');
      }
      resetForm();
      fetchMoodStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save diary entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diary entry?')) return;
    try {
      await diaryService.delete(id);
      setDiaries(diaries.filter(d => d._id !== id));
      toast.success('Diary entry deleted successfully!');
      fetchMoodStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete diary entry');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      mood: 'Neutral',
      weather: '',
      tags: [],
      isPrivate: false,
      location: '',
      images: [],
      gratitudeList: [],
      goals: [],
    });
    setTagInput('');
    setGratitudeInput('');
    setGoalInput('');
    setEditingDiary(null);
    setShowForm(false);
  };

  const handleEdit = (diary: Diary) => {
    setEditingDiary(diary);
    setFormData({
      title: diary.title,
      content: diary.content,
      date: diary.date.split('T')[0],
      mood: diary.mood,
      weather: diary.weather,
      tags: diary.tags,
      isPrivate: diary.isPrivate,
      location: diary.location,
      images: diary.images,
      gratitudeList: diary.gratitudeList,
      goals: diary.goals,
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

  const addGratitude = () => {
    if (gratitudeInput.trim()) {
      setFormData({
        ...formData,
        gratitudeList: [...(formData.gratitudeList || []), gratitudeInput.trim()]
      });
      setGratitudeInput('');
    }
  };

  const removeGratitude = (index: number) => {
    setFormData({
      ...formData,
      gratitudeList: formData.gratitudeList?.filter((_, i) => i !== index) || []
    });
  };

  const addGoal = () => {
    if (goalInput.trim()) {
      setFormData({
        ...formData,
        goals: [...(formData.goals || []), { description: goalInput.trim(), completed: false }]
      });
      setGoalInput('');
    }
  };

  const toggleGoal = (index: number) => {
    const updatedGoals = [...(formData.goals || [])];
    updatedGoals[index].completed = !updatedGoals[index].completed;
    setFormData({ ...formData, goals: updatedGoals });
  };

  const removeGoal = (index: number) => {
    setFormData({
      ...formData,
      goals: formData.goals?.filter((_, i) => i !== index) || []
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
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
          <h2 className="text-3xl font-bold tracking-tight">My Diary</h2>
          <p className="text-muted-foreground">Record your thoughts and feelings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowStats(!showStats)}>
            <TrendingUp className="mr-2 h-4 w-4" />
            {showStats ? 'Hide Stats' : 'Mood Stats'}
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? 'Cancel' : 'New Entry'}
          </Button>
        </div>
      </div>

      {/* Mood Statistics */}
      {showStats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mood Statistics</CardTitle>
            <CardDescription>Your emotional journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moodStats.map(stat => (
                <div key={stat.mood} className="text-center p-4 border rounded-lg">
                  <div className="text-3xl mb-2">{MOOD_EMOJIS[stat.mood]}</div>
                  <div className="font-semibold">{stat.mood}</div>
                  <div className="text-2xl font-bold text-primary">{stat.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diary Entry Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{editingDiary ? 'Edit Diary Entry' : 'New Diary Entry'}</CardTitle>
            </CardHeader>
            <ScrollArea className="max-h-[600px]">
              <CardContent className="space-y-4 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mood">Mood *</Label>
                  <select
                    id="mood"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value as any })}
                  >
                    {MOOD_OPTIONS.map(mood => (
                      <option key={mood} value={mood}>
                        {MOOD_EMOJIS[mood]} {mood}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full min-h-[200px] px-3 py-2 border rounded-md"
                  placeholder="Write about your day..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weather">Weather</Label>
                  <Input
                    id="weather"
                    value={formData.weather}
                    onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                    placeholder="e.g., Sunny, Rainy"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Where were you?"
                  />
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

              <div>
                <Label htmlFor="gratitude">Gratitude List</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="gratitude"
                    value={gratitudeInput}
                    onChange={(e) => setGratitudeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGratitude())}
                    placeholder="What are you grateful for?"
                  />
                  <Button type="button" onClick={addGratitude}>Add</Button>
                </div>
                <ul className="space-y-1">
                  {formData.gratitudeList?.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span>• {item}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeGratitude(index)} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Label htmlFor="goals">Goals</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="goals"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    placeholder="Add a goal"
                  />
                  <Button type="button" onClick={addGoal}>Add</Button>
                </div>
                <div className="space-y-2">
                  {formData.goals?.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleGoal(index)}
                        className="shrink-0"
                      >
                        {goal.completed ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <span className={goal.completed ? 'line-through text-muted-foreground' : ''}>
                        {goal.description}
                      </span>
                      <X className="h-3 w-3 cursor-pointer ml-auto" onClick={() => removeGoal(index)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  />
                  <span>Keep this entry private</span>
                </label>
              </div>
            </CardContent>
            </ScrollArea>
            <CardFooter className="flex gap-2">
              <Button type="submit">{editingDiary ? 'Update Entry' : 'Create Entry'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Diary Entries Timeline */}
      {diaries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No diary entries yet. Start writing today!</p>
          </CardContent>
        </Card>
      ) : (
        <TooltipProvider>
          <div className="space-y-4">
            {diaries.map(diary => (
              <Card key={diary._id} className="animate-in fade-in duration-300 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{MOOD_EMOJIS[diary.mood]}</span>
                        <Badge className={MOOD_COLORS[MOOD_EMOJIS[diary.mood]] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>{diary.mood}</Badge>
                        {diary.isPrivate && <Badge variant="secondary">Private</Badge>}
                      </div>
                      <CardTitle>{diary.title}</CardTitle>
                      <CardDescription>
                        {new Date(diary.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {diary.weather && ` • ${diary.weather}`}
                        {diary.location && ` • 📍 ${diary.location}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(diary)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Entry</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDiaryToDelete(diary._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Entry</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm whitespace-pre-wrap">{diary.content}</p>

                  {diary.gratitudeList.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Grateful for:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {diary.gratitudeList.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {diary.goals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Goals:</h4>
                      <div className="space-y-1">
                        {diary.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {goal.completed ? (
                              <CheckSquare className="h-4 w-4 text-primary" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                            <span className={goal.completed ? 'line-through text-muted-foreground' : ''}>
                              {goal.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {diary.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {diary.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{getRelativeTime(diary.createdAt || diary.date)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {new Date(diary.createdAt || diary.date).toLocaleString()}
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!diaryToDelete} onOpenChange={(open) => !open && setDiaryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your diary entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (diaryToDelete) {
                handleDelete(diaryToDelete);
                setDiaryToDelete(null);
              }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </div>
  );
}
