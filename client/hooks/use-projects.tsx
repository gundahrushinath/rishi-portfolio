import { useState, useEffect, useMemo, useCallback } from 'react';
import { projectService, Project, ProjectFilters } from '@/lib/api';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { ProjectFormValues } from '@/lib/validation';

export function useProjects() {
  const canRead = usePermission(Permission.PROJECT_READ);
  const canCreate = usePermission(Permission.PROJECT_CREATE);
  const canUpdate = usePermission(Permission.PROJECT_UPDATE);
  const canDelete = usePermission(Permission.PROJECT_DELETE);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchProjects = useCallback(async () => {
    if (!canRead) return;
    try {
      setIsLoading(true);
      const filters: ProjectFilters = { sortBy, order: sortOrder };
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (priorityFilter !== 'all') filters.priority = priorityFilter;
      if (searchQuery) filters.search = searchQuery;
      if (showArchived) filters.isArchived = true;
      if (showFeatured) filters.isFeatured = true;
      const data = await projectService.getAll(filters);
      setProjects(data.projects);
    } catch (error: any) {
      if (error.response?.status !== 403) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      }
    } finally {
      setIsLoading(false);
    }
  }, [canRead, sortBy, sortOrder, statusFilter, priorityFilter, searchQuery, showArchived, showFeatured]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (values: ProjectFormValues) => {
    const projectData = {
      title: values.title.trim(),
      description: values.description?.trim() || '',
      status: values.status,
      priority: values.priority,
      tags: (values.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
      technologies: (values.technologies || '').split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech.length > 0),
      dueDate: values.dueDate || undefined,
      startDate: values.startDate || undefined,
      link: values.link?.trim() || '',
      githubUrl: values.githubUrl?.trim() || '',
      liveUrl: values.liveUrl?.trim() || '',
      progress: values.progress,
      notes: values.notes?.trim() || '',
      isFeatured: values.isFeatured,
      isArchived: values.isArchived,
    };

    const data = await projectService.create(projectData);
    setProjects((prev) => [data.project, ...prev]);
    toast.success('Project created successfully');
    return data.project;
  };

  const updateProject = async (projectId: string, values: ProjectFormValues) => {
    const projectData = {
      title: values.title.trim(),
      description: values.description?.trim() || '',
      status: values.status,
      priority: values.priority,
      tags: (values.tags || '').split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0),
      technologies: (values.technologies || '').split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech.length > 0),
      dueDate: values.dueDate || undefined,
      startDate: values.startDate || undefined,
      link: values.link?.trim() || '',
      githubUrl: values.githubUrl?.trim() || '',
      liveUrl: values.liveUrl?.trim() || '',
      progress: values.progress,
      notes: values.notes?.trim() || '',
      isFeatured: values.isFeatured,
      isArchived: values.isArchived,
    };

    const data = await projectService.update(projectId, projectData);
    setProjects((prev) => prev.map((p) => (p._id === projectId ? data.project : p)));
    toast.success('Project updated successfully');
    return data.project;
  };

  const deleteProject = async (projectId: string) => {
    await projectService.delete(projectId);
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
    toast.success('Project deleted successfully');
  };

  const bulkDeleteProjects = async (projectIds: string[]) => {
    await projectService.bulkDelete(projectIds);
    setProjects((prev) => prev.filter((p) => !projectIds.includes(p._id)));
    toast.success(`${projectIds.length} project(s) deleted`);
  };

  const bulkArchiveProjects = async (projectIds: string[]) => {
    await projectService.bulkUpdate(projectIds, { isArchived: true });
    await fetchProjects();
    toast.success(`${projectIds.length} project(s) archived`);
  };

  const bulkFeatureProjects = async (projectIds: string[]) => {
    await projectService.bulkUpdate(projectIds, { isFeatured: true });
    await fetchProjects();
    toast.success(`${projectIds.length} project(s) marked as featured`);
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];
    if (!showArchived) filtered = filtered.filter((p) => !p.isArchived);
    return filtered;
  }, [projects, showArchived]);

  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const byStatus = {
      Active: filteredProjects.filter((p) => p.status === 'Active').length,
      'In Progress': filteredProjects.filter((p) => p.status === 'In Progress').length,
      Completed: filteredProjects.filter((p) => p.status === 'Completed').length,
      'On Hold': filteredProjects.filter((p) => p.status === 'On Hold').length,
      Cancelled: filteredProjects.filter((p) => p.status === 'Cancelled').length,
    };
    const featured = filteredProjects.filter((p) => p.isFeatured).length;
    const avgProgress = total > 0 ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / total) : 0;
    return { total, byStatus, featured, avgProgress };
  }, [filteredProjects]);

  return {
    // Data
    projects: filteredProjects,
    isLoading,
    stats,
    selectedProjects,
    
    // Permissions
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    
    // Filters
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
    
    // Actions
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    bulkDeleteProjects,
    bulkArchiveProjects,
    bulkFeatureProjects,
    toggleProjectSelection,
    setSelectedProjects,
  };
}
