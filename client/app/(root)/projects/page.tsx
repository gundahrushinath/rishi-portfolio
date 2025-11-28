'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectFormSchema, ProjectFormValues } from '@/lib/validation';
import { useProjects } from '@/hooks/use-projects';
import { Project } from '@/lib/api';
import { Plus, Archive, Star, Trash2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { NoAccess } from '@/components/auth/NoAccess';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/models/user';
import { ProjectForm } from '@/components/portfolio/ProjectForm';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectFilters } from '@/components/portfolio/ProjectFilters';
import { ProjectStats } from '@/components/portfolio/ProjectStats';

export default function ProjectsPage() {
  const { loading: authLoading } = useAuth();
  const {
    projects,
    isLoading,
    stats,
    selectedProjects,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    showArchived,
    setShowArchived,
    showFeatured,
    setShowFeatured,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    createProject,
    updateProject,
    deleteProject,
    bulkDeleteProjects,
    bulkArchiveProjects,
    bulkFeatureProjects,
    toggleProjectSelection,
    setSelectedProjects,
  } = useProjects();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'delete' | 'archive' | 'feature' | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'Active',
      priority: 'Medium',
      tags: '',
      technologies: '',
      dueDate: '',
      startDate: '',
      link: '',
      githubUrl: '',
      liveUrl: '',
      progress: 0,
      notes: '',
      isFeatured: false,
      isArchived: false,
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && canCreate) {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showForm) resetForm();
        setSelectedProjects(new Set());
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, canCreate, setSelectedProjects]);

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    form.reset({
      title: '', description: '', status: 'Active', priority: 'Medium', tags: '', technologies: '',
      dueDate: '', startDate: '', link: '', githubUrl: '', liveUrl: '', progress: 0, notes: '',
      isFeatured: false, isArchived: false,
    });
  };

  const handleEdit = (project: Project) => {
    if (!canUpdate) {
      toast.error('You do not have permission to edit projects');
      return;
    }
    setEditingProject(project._id);
    form.reset({
      title: project.title, description: project.description, status: project.status, priority: project.priority || 'Medium',
      tags: (project.tags || []).join(', '), technologies: (project.technologies || []).join(', '),
      dueDate: project.dueDate || '', startDate: project.startDate || '', link: project.link || '',
      githubUrl: project.githubUrl || '', liveUrl: project.liveUrl || '', progress: project.progress || 0,
      notes: project.notes || '', isFeatured: project.isFeatured || false, isArchived: project.isArchived || false,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (projectId: string) => {
    if (!canDelete) {
      toast.error('You do not have permission to delete projects');
      return;
    }
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleBulkAction = async () => {
    if (selectedProjects.size === 0 || !bulkActionType) return;
    try {
      const projectIds = Array.from(selectedProjects);
      if (bulkActionType === 'delete') {
        await bulkDeleteProjects(projectIds);
      } else if (bulkActionType === 'archive') {
        await bulkArchiveProjects(projectIds);
      } else if (bulkActionType === 'feature') {
        await bulkFeatureProjects(projectIds);
      }
      setSelectedProjects(new Set());
      setBulkActionDialogOpen(false);
      setBulkActionType(null);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      if (editingProject) {
        await updateProject(editingProject, values);
      } else {
        await createProject(values);
      }
      resetForm();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.error || 'Failed to save project');
    }
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!canRead) {
    return <NoAccess feature="Projects" permission={Permission.PROJECT_READ} />;
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage and track your portfolio projects</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {canDelete && selectedProjects.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    Bulk Actions ({selectedProjects.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setBulkActionType('archive'); setBulkActionDialogOpen(true); }}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setBulkActionType('feature'); setBulkActionDialogOpen(true); }}>
                    <Star className="mr-2 h-4 w-4" />
                    Mark as Featured
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => { setBulkActionType('delete'); setBulkActionDialogOpen(true); }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {canCreate && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        {!showForm && <ProjectStats stats={stats} />}

        {/* Search and Filters */}
        {!showForm && (
          <ProjectFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            showArchived={showArchived}
            onShowArchivedChange={setShowArchived}
            showFeatured={showFeatured}
            onShowFeaturedChange={setShowFeatured}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        )}

        {/* Form */}
        {showForm && (
          <ProjectForm
            form={form}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingProject}
          />
        )}

        {/* Projects Grid */}
        {!showForm && (
          <>
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Get started by creating your first project'}
                  </p>
                  {canCreate && !searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    isSelected={selectedProjects.has(project._id)}
                    onToggleSelect={toggleProjectSelection}
                    onEdit={handleEdit}
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

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog */}
      <AlertDialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkActionType === 'delete' && 'Delete Projects'}
              {bulkActionType === 'archive' && 'Archive Projects'}
              {bulkActionType === 'feature' && 'Feature Projects'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkActionType === 'delete' && `Are you sure you want to delete ${selectedProjects.size} project(s)? This action cannot be undone.`}
              {bulkActionType === 'archive' && `Archive ${selectedProjects.size} project(s)?`}
              {bulkActionType === 'feature' && `Mark ${selectedProjects.size} project(s) as featured?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setBulkActionDialogOpen(false); setBulkActionType(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkAction}
              className={bulkActionType === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
