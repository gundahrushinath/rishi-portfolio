'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/loading';
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  Settings, 
  BookOpen,
  LogOut,
  User,
  Bell,
  Plus,
  Video,
  File,
  Code,
  ExternalLink,
  Download,
  Calendar,
  Tag,
  Trash2,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Resource, resourceService } from '@/lib/api';

const navigationItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Projects',
    icon: FileText,
    href: '/dashboard/projects',
  },
  {
    title: 'Resources',
    icon: BookOpen,
    href: '/dashboard/resources',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

function DashboardSidebar() {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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

export default function ResourcesPage() {
  const { user, loading, isAuthenticated, signout } = useAuth();
  const router = useRouter();

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [loading, isAuthenticated, router]);

  // Fetch resources on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchResources();
    }
  }, [isAuthenticated, user]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const data = await resourceService.getAll();
      setResources(data.resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to load resources');
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

  if (loading || isLoading) {
    return <Loading fullScreen text="Loading resources..." />;
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
              <h1 className="text-xl font-semibold">Resources</h1>
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
                  <p className="text-muted-foreground">
                    Access curated learning materials and resources
                  </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Resource
                </Button>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                  const getCategoryIcon = () => {
                    if (resource.category === 'Video' || resource.category === 'Course') return Video;
                    if (resource.category === 'Documentation' || resource.category === 'Article') return File;
                    return Code;
                  };
                  const ResourceIcon = getCategoryIcon();
                  return (
                    <Card key={resource._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="rounded-lg bg-primary/10 p-3">
                            <ResourceIcon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant="outline">{resource.category}</Badge>
                        </div>
                        <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created: {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {resource.isFeatured && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                            Edit
                          </Button>
                          {resource.url && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteClick(resource._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </main>
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
            <div className="space-y-4 py-4">
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
    </SidebarProvider>
  );
}
