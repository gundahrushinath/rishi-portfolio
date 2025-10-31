'use client';

import { useEffect, useState } from 'react';
import { 
  Plus,
  Video,
  File,
  Code,
  ExternalLink,
  Download,
  Calendar,
  Tag,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Resource, resourceService } from '@/lib/api';
import { CATEGORY_BADGE_COLORS } from '@/lib/theme-colors';
import { usePermission } from '@/hooks/use-permission';
import { Permission } from '@/models/user';
import { NoAccess } from '@/components/auth/NoAccess';
import { useAuth } from '@/contexts/AuthContext';

// Helper function for relative time
const getRelativeTime = (date: string) => {
  const now = new Date();
  const resourceDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - resourceDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  return resourceDate.toLocaleDateString();
};

export default function ResourcesPage() {
  const { loading: authLoading } = useAuth();
  
  // Permission checks
  const canRead = usePermission(Permission.RESOURCE_READ);
  const canCreate = usePermission(Permission.RESOURCE_CREATE);
  const canUpdate = usePermission(Permission.RESOURCE_UPDATE);
  const canDelete = usePermission(Permission.RESOURCE_DELETE);

  // Resources state
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Edit state
  const [editingResource, setEditingResource] = useState<string | null>(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  
  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tutorial' as string,
    url: '',
    thumbnail: '',
    tags: '',
    isFeatured: false,
  });

  // Fetch resources on mount
  useEffect(() => {
    // Only fetch if user has read permission and auth is loaded
    if (!authLoading && canRead) {
      fetchResources();
    }
  }, [canRead, authLoading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setDialogOpen(true);
      }
      if (e.key === 'Escape' && dialogOpen) {
        e.preventDefault();
        setDialogOpen(false);
        setEditingResource(null);
        setFormData({ title: '', description: '', category: 'Tutorial', url: '', thumbnail: '', tags: '', isFeatured: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogOpen]);

  const fetchResources = async () => {
    // Only fetch if user has read permission
    if (!canRead) return;
    
    try {
      setIsLoading(true);
      const data = await resourceService.getAll();
      setResources(data.resources);
    } catch (error: any) {
      // Don't show error if it's a 403 (permission denied) - we handle this with NoAccess component
      if (error.response?.status !== 403) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load resources');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource._id);
    setFormData({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      url: resource.url,
      thumbnail: resource.thumbnail || '',
      tags: resource.tags.join(', '),
      isFeatured: resource.isFeatured,
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (resourceId: string) => {
    setResourceToDelete(resourceId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return;

    try {
      await resourceService.delete(resourceToDelete);
      setResources(prev => prev.filter(r => r._id !== resourceToDelete));
      toast.success('Resource deleted successfully!');
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Resource title is required');
      return;
    }

    if (!formData.url.trim()) {
      toast.error('Resource URL is required');
      return;
    }

    setSubmitting(true);

    try {
      const resourceData = {
        title: formData.title.trim(),
        description: formData.description.trim() || 'No description provided',
        category: formData.category,
        url: formData.url.trim(),
        thumbnail: formData.thumbnail.trim(),
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
        isFeatured: formData.isFeatured,
      };

      if (editingResource) {
        // Update existing resource
        const data = await resourceService.update(editingResource, resourceData);
        setResources(prev => prev.map(r => r._id === editingResource ? data.resource : r));
        toast.success('Resource updated successfully!');
      } else {
        // Create new resource
        const data = await resourceService.create(resourceData);
        setResources(prev => [data.resource, ...prev]);
        toast.success('Resource created successfully!');
      }

      setDialogOpen(false);
      setEditingResource(null);
      setFormData({ title: '', description: '', category: 'Tutorial', url: '', thumbnail: '', tags: '', isFeatured: false });
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    } finally {
      setSubmitting(false);
    }
  };

  // Wait for auth to load before checking permissions
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Check if user has read permission
  if (!canRead) {
    return <NoAccess feature="Resources" permission="RESOURCE_READ" />;
  }

  if (isLoading) {
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-9 w-full" />
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
            <p className="text-muted-foreground">
              Access curated learning materials and resources
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Resource
            </Button>
          )}
        </div>

        {/* Resource Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Videos/Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resources.filter(r => r.category === 'Video' || r.category === 'Course').length}</div>
            </CardContent>
          </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Articles/Docs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resources.filter(r => r.category === 'Article' || r.category === 'Documentation').length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Featured</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{resources.filter(r => r.isFeatured).length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Resources Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
                {resources.map((resource) => {
                  const getCategoryIcon = () => {
                    if (resource.category === 'Video' || resource.category === 'Course') return Video;
                    if (resource.category === 'Documentation' || resource.category === 'Article') return File;
                    return Code;
                  };
                  const ResourceIcon = getCategoryIcon();
                  return (
                    <Card key={resource._id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="rounded-lg bg-primary/10 p-3">
                            <ResourceIcon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge className={CATEGORY_BADGE_COLORS[resource.category] || CATEGORY_BADGE_COLORS['Other']}>{resource.category}</Badge>
                        </div>
                        <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {resource.isFeatured && (
                          <Badge variant="secondary" className="w-fit text-xs">
                            Featured
                          </Badge>
                        )}
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit resource</p></TooltipContent>
                            </Tooltip>

                            {resource.url && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(resource.url, '_blank')}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>Open link</p></TooltipContent>
                              </Tooltip>
                            )}

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>Delete resource</p></TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Resource?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete "{resource.title}". This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteClick(resource._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipProvider>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">{getRelativeTime(resource.createdAt)}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p>Created: {new Date(resource.createdAt).toLocaleString()}</p>
                              {resource.updatedAt && resource.updatedAt !== resource.createdAt && (
                                <p>Updated: {new Date(resource.updatedAt).toLocaleString()}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

        {/* New Resource Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingResource(null);
            setFormData({ title: '', description: '', category: 'Tutorial', url: '', thumbnail: '', tags: '', isFeatured: false });
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
              <DialogDescription>
                {editingResource ? 'Update your resource details below.' : 'Add a new learning resource to your collection.'}
              </DialogDescription>
            </DialogHeader>
                    <form onSubmit={handleSubmit}>
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Advanced React Patterns"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the resource"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Article">Article</option>
                  <option value="Video">Video</option>
                  <option value="Course">Course</option>
                  <option value="Tool">Tool</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Library">Library</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Resource URL *</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="e.g., https://example.com/resource"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  placeholder="e.g., https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g., React, TypeScript, JavaScript"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isFeatured">Mark as featured</Label>
              </div>
            </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingResource(null);
                  setFormData({ title: '', description: '', category: 'Tutorial', url: '', thumbnail: '', tags: '', isFeatured: false });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : (editingResource ? 'Update Resource' : 'Create Resource')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setResourceToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
