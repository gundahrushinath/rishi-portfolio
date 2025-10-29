'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { diaryService, DiaryInput } from '@/lib/api';
import { Diary } from '@/models/dashboard';
import { DASHBOARD_NAVIGATION } from '@/lib/constants';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { toast } from '@/lib/toast';
import { Plus, Trash2, Edit2, X, CheckSquare, Square, TrendingUp, Home, LogOut, User, Bell, LayoutDashboard, Settings } from 'lucide-react';

function DashboardSidebar() {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_NAVIGATION.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => router.push(item.href)} tooltip={item.title}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <SidebarTrigger className="w-full h-9" />
      </SidebarFooter>
    </Sidebar>
  );
}

const MOOD_OPTIONS = ['Happy', 'Sad', 'Neutral', 'Excited', 'Anxious', 'Grateful', 'Tired', 'Motivated'] as const;
const MOOD_EMOJIS: Record<string, string> = {
  'Happy': '😊',
  'Sad': '😢',
  'Neutral': '😐',
  'Excited': '🤩',
  'Anxious': '😰',
  'Grateful': '🙏',
  'Tired': '😴',
  'Motivated': '💪'
};

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [moodStats, setMoodStats] = useState<{ mood: string; count: number }[]>([]);

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

  const { user, loading: authLoading, isAuthenticated, signout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  if (loading || authLoading) {
    return <Loading fullScreen text="Loading diary..." />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Diary</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signout()} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
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
            <CardContent className="space-y-4">
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
        <div className="space-y-4">
          {diaries.map(diary => (
            <Card key={diary._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{MOOD_EMOJIS[diary.mood]}</span>
                      <Badge variant="outline">{diary.mood}</Badge>
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(diary)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(diary._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            </Card>
          ))}
        </div>
      )}
    </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
