'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceFormSchema, ResourceFormValues } from '@/lib/validation';
import { usePermission } from '@/hooks/use-permission';
import { resourceService, Resource } from '@/lib/api';
import { toast } from 'sonner';
import { Permission } from '@/models/user';
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
import { ResourceStats } from '@/components/portfolio/ResourceStats';
import { ResourceFilters } from '@/components/portfolio/ResourceFilters';
import { ResourceCard } from '@/components/portfolio/ResourceCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ResourceForm } from '@/components/portfolio/ResourceForm';

export default function ResourcesPage() {
  // Permissions
  const canCreate = usePermission(Permission.RESOURCE_CREATE);
  const canUpdate = usePermission(Permission.RESOURCE_UPDATE);
  const canDelete = usePermission(Permission.RESOURCE_DELETE);
  const canRead = usePermission(Permission.RESOURCE_READ);

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFeatured, setShowFeatured] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Tutorial',
      url: '',
      thumbnail: '',
      tags: '',
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (canRead) {
      fetchResources();
    }
  }, [canRead]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && canCreate) {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showForm) resetForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm, canCreate]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const data = await resourceService.getAll();
      setResources(data.resources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingResource(null);
    form.reset({
      title: '',
      description: '',
      category: 'Tutorial',
      url: '',
      thumbnail: '',
      tags: '',
      isFeatured: false,
    });
  };

  const handleEditClick = (resource: Resource) => {
    setEditingResource(resource._id);
    form.reset({
      title: resource.title,
      description: resource.description,
      category: resource.category as any,
      url: resource.url || '',
      thumbnail: resource.thumbnail || '',
      tags: resource.tags.join(', '),
      isFeatured: resource.isFeatured || false,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (resourceId: string) => {
    const resource = resources.find(r => r._id === resourceId);
    if (resource) {
      setResourceToDelete(resource);
    }
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await resourceService.delete(resourceToDelete._id);
      toast.success('Resource deleted successfully');
      fetchResources();
      setResourceToDelete(null);
    } catch (error) {
      console.error('Failed to delete resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleSubmit = async (values: ResourceFormValues) => {
    try {
      const formattedData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };

      if (editingResource) {
        await resourceService.update(editingResource, formattedData);
        toast.success('Resource updated successfully');
      } else {
        await resourceService.create(formattedData);
        toast.success('Resource created successfully');
      }
      fetchResources();
      resetForm();
    } catch (error) {
      console.error('Failed to save resource:', error);
      toast.error('Failed to save resource');
    }
  };

  const filteredResources = resources
    .filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        categoryFilter === 'all' || resource.category === categoryFilter;
      const matchesFeatured = !showFeatured || resource.isFeatured;

      return matchesSearch && matchesCategory && matchesFeatured;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'newest':
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'oldest':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return comparison;
    });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Resources</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              A collection of helpful tools, articles, and learning materials.
            </p>
          </div>
          {canCreate && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          )}
        </div>

        {!showForm && <ResourceStats resources={resources} />}

        {!showForm && (
          <ResourceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            showFeatured={showFeatured}
            onShowFeaturedChange={setShowFeatured}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        )}

        {showForm ? (
          <ResourceForm
            methods={form}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingResource}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[300px] rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No resources found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
                  {searchQuery
                    ? "We couldn't find any resources matching your search. Try adjusting your filters."
                    : "Get started by adding your first resource to the collection."}
                </p>
                {canCreate && !searchQuery && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
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

      <AlertDialog
        open={!!resourceToDelete}
        onOpenChange={(open) => !open && setResourceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resource "{resourceToDelete?.title}".
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
