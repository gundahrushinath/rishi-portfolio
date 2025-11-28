'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/hooks/use-projects';
import { useNotes } from '@/hooks/use-notes';
import { useTodos } from '@/hooks/use-todos';
import { useDiary } from '@/hooks/use-diary';
import { resourceService } from '@/lib/api';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import {
  FileText,
  BookOpen,
  StickyNote,
  CheckSquare,
  Book,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';

type ResourceSummary = {
  total: number;
  featured: number;
  categories: Record<string, number>;
};

const defaultResourceSummary: ResourceSummary = {
  total: 0,
  featured: 0,
  categories: {},
};

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const {
    projects,
    stats: projectStats,
    isLoading: projectsLoading,
    canRead: canReadProjects,
  } = useProjects();

  const {
    notes,
    stats: noteStats,
    isLoading: notesLoading,
    canRead: canReadNotes,
  } = useNotes();

  const {
    todos,
    statistics: todoStats,
    isLoading: todosLoading,
    canRead: canReadTodos,
  } = useTodos();

  const {
    entries: diaryEntries,
    stats: diaryStats,
    isLoading: diaryLoading,
    canRead: canReadDiary,
  } = useDiary();

  const canReadResources = usePermission(Permission.RESOURCE_READ);
  const [resourceSummary, setResourceSummary] = useState<ResourceSummary>(defaultResourceSummary);
  const [resourceLoading, setResourceLoading] = useState(false);

  useEffect(() => {
    if (!canReadResources) {
      setResourceSummary(defaultResourceSummary);
      setResourceLoading(false);
      return;
    }

    let active = true;
    const loadResources = async () => {
      try {
        setResourceLoading(true);
        const { resources } = await resourceService.getAll();
        if (!active) return;
        const featured = resources.filter((resource) => resource.isFeatured).length;
        const categories = resources.reduce<Record<string, number>>((acc, resource) => {
          acc[resource.category] = (acc[resource.category] || 0) + 1;
          return acc;
        }, {});
        setResourceSummary({ total: resources.length, featured, categories });
      } catch (error) {
        console.error('Failed to load resources for overview:', error);
      } finally {
        if (active) setResourceLoading(false);
      }
    };

    loadResources();
    return () => {
      active = false;
    };
  }, [canReadResources]);

  const topProjects = useMemo(() => {
    if (!canReadProjects) return [];
    return [...projects]
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 3);
  }, [projects, canReadProjects]);

  const upcomingTodos = useMemo(() => {
    if (!canReadTodos) return [];
    return [...todos]
      .filter((todo) => todo.status !== 'Completed')
      .sort((a, b) => {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .slice(0, 4);
  }, [todos, canReadTodos]);

  const notePreview = useMemo(() => {
    if (!canReadNotes) return [];
    return notes.slice(0, 3);
  }, [notes, canReadNotes]);

  const diaryPreview = useMemo(() => {
    if (!canReadDiary) return [];
    return [...diaryEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [diaryEntries, canReadDiary]);

  const resourceTopCategories = useMemo(() => {
    if (!canReadResources) return [];
    return Object.entries(resourceSummary.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [resourceSummary.categories, canReadResources]);

  const overviewLoading =
    loading ||
    (canReadProjects && projectsLoading) ||
    (canReadNotes && notesLoading) ||
    (canReadTodos && todosLoading) ||
    (canReadDiary && diaryLoading) ||
    (canReadResources && resourceLoading);

  if (overviewLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const summaryCards = [
    {
      title: 'Projects',
      value: canReadProjects ? projectStats.total : '—',
      subtitle: canReadProjects
        ? `${projectStats.byStatus.Completed || 0} completed · ${projectStats.byStatus['In Progress'] || 0} in progress`
        : 'No access',
      icon: FileText,
      href: '/projects',
      canAccess: canReadProjects,
    },
    {
      title: 'Resources',
      value: canReadResources ? resourceSummary.total : '—',
      subtitle: canReadResources
        ? `${resourceSummary.featured} featured · ${resourceTopCategories[0]?.[0] || '—'} top category`
        : 'No access',
      icon: BookOpen,
      href: '/resources',
      canAccess: canReadResources,
    },
    {
      title: 'Notes',
      value: canReadNotes ? noteStats.total : '—',
      subtitle: canReadNotes ? `${noteStats.pinned} pinned for quick access` : 'No access',
      icon: StickyNote,
      href: '/notes',
      canAccess: canReadNotes,
    },
    {
      title: 'Todos',
      value: canReadTodos ? (todoStats?.total ?? todos.length) : '—',
      subtitle: canReadTodos
        ? `${todoStats?.completed ?? todos.filter((todo) => todo.status === 'Completed').length} completed`
        : 'No access',
      icon: CheckSquare,
      href: '/todos',
      canAccess: canReadTodos,
    },
    {
      title: 'Diary',
      value: canReadDiary ? (diaryStats?.totalEntries ?? diaryEntries.length) : '—',
      subtitle: canReadDiary
        ? `${diaryStats?.entriesThisMonth ?? 0} entries this month`
        : 'No access',
      icon: Book,
      href: '/diary',
      canAccess: canReadDiary,
    },
  ];

  const todoOverview = canReadTodos
    ? {
        total: todoStats?.total ?? todos.length,
        completed: todoStats?.completed ?? todos.filter((todo) => todo.status === 'Completed').length,
        inProgress: todoStats?.inProgress ?? todos.filter((todo) => todo.status === 'In Progress').length,
        overdue: todoStats?.overdue ?? 0,
      }
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Get a snapshot of everything happening across projects, resources, notes, todos, and diary entries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border shadow-sm">
            <CardContent className="flex h-full flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-auto">
                <Button asChild variant="ghost" size="sm" className="px-0" disabled={!card.canAccess}>
                  <Link href={card.href}>{card.canAccess ? 'View details' : 'Permission required'}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Project Momentum</CardTitle>
              <CardDescription>Progress across active initiatives</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Avg progress {projectStats.avgProgress}%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Active', 'In Progress', 'Completed', 'On Hold'].map((status) => (
                <div key={status} className="rounded-lg border p-4 text-sm">
                  <p className="text-muted-foreground">{status}</p>
                  <p className="text-2xl font-semibold">{projectStats.byStatus[status as keyof typeof projectStats.byStatus] || 0}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {canReadProjects && topProjects.length > 0 ? (
                topProjects.map((project) => (
                  <div key={project._id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.status} · {project.priority || 'Medium'} priority</p>
                    </div>
                    <div className="flex items-center gap-3 sm:w-56">
                      <Progress value={project.progress || 0} className="h-2" />
                      <span className="text-sm font-medium">{project.progress ?? 0}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{canReadProjects ? 'No projects available yet.' : 'Project access unavailable.'}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/projects">Manage projects</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Health</CardTitle>
            <CardDescription>Snapshot of your to-do pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todoOverview ? (
              <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">Total</p>
                    <p className="text-xl font-semibold">{todoOverview.total}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">Completed</p>
                    <p className="text-xl font-semibold">{todoOverview.completed}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">In Progress</p>
                    <p className="text-xl font-semibold">{todoOverview.inProgress}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">Overdue</p>
                    <p className="text-xl font-semibold">{todoOverview.overdue}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next up</p>
                  {upcomingTodos.length > 0 ? (
                    upcomingTodos.map((todo) => (
                      <div key={todo._id} className="flex items-start justify-between rounded-lg border p-3">
                        <div>
                          <p className="text-sm font-medium">{todo.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '—'} · {todo.priority} priority
                          </p>
                        </div>
                        <Badge variant={todo.status === 'Completed' ? 'secondary' : 'outline'} className="text-xs">
                          {todo.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">All caught up for now.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Todo data is unavailable for your account.</p>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4">
            <Button asChild size="sm" variant="outline" disabled={!canReadTodos}>
              <Link href="/todos">Review task board</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Resource Library</CardTitle>
              <CardDescription>Top categories powering your work</CardDescription>
            </div>
            {canReadResources && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BookmarkCheck className="h-3.5 w-3.5" />
                {resourceSummary.featured} featured
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {canReadResources ? (
              resourceTopCategories.length > 0 ? (
                resourceTopCategories.map(([category, count]) => {
                  const share = resourceSummary.total ? Math.round((count / resourceSummary.total) * 100) : 0;
                  return (
                    <div key={category} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-xs text-muted-foreground">{share}% of library</p>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">Add resources to populate this view.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Resource overview is unavailable for your role.</p>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4">
            <Button asChild size="sm" variant="outline" disabled={!canReadResources}>
              <Link href="/resources">Browse resources</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Diary Highlights</CardTitle>
            <CardDescription>Capture ideas and reflections at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <StickyNote className="h-4 w-4" />
                Quick notes
              </div>
              {canReadNotes && notePreview.length > 0 ? (
                notePreview.map((note) => (
                  <div key={note._id} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{note.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{note.content || 'No content provided.'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{canReadNotes ? 'No notes yet.' : 'Notes unavailable.'}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Book className="h-4 w-4" />
                Recent diary entries
              </div>
              {canReadDiary && diaryPreview.length > 0 ? (
                diaryPreview.map((entry) => (
                  <div key={entry._id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{entry.mood}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{entry.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{canReadDiary ? 'No diary entries captured yet.' : 'Diary unavailable.'}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/30 px-6 py-4 flex flex-wrap gap-3">
            <Button asChild size="sm" variant="outline" disabled={!canReadNotes}>
              <Link href="/notes">Open notes</Link>
            </Button>
            <Button asChild size="sm" variant="outline" disabled={!canReadDiary}>
              <Link href="/diary">Open diary</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
