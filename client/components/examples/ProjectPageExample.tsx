'use client';

/**
 * Complete Example: Project Page with RBAC
 * Demonstrates all RBAC patterns in one component
 */

import { useState, useEffect } from 'react';
import { usePermission, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';
import { PermissionGuard, RoleGuard } from '@/components/auth/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Share2, Archive } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
}

export default function ProjectsPageExample() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Permission checks
  const canCreate = usePermission(Permission.PROJECT_CREATE);
  const canRead = usePermission(Permission.PROJECT_READ);
  const canUpdate = usePermission(Permission.PROJECT_UPDATE);
  const canDelete = usePermission(Permission.PROJECT_DELETE);
  const canReadAll = usePermission(Permission.PROJECT_READ_ALL);
  
  // Role checks
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (canRead) {
      fetchProjects();
    }
  }, [canRead]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        credentials: 'include'
      });
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Navigate to create form or open modal
    toast.info('Create project functionality');
  };

  const handleEdit = (projectId: string) => {
    toast.info(`Edit project: ${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  // Access denied if no read permission
  if (!canRead) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to view projects.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header with conditional create button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects
            {isAdmin && <Badge className="ml-2">Admin View</Badge>}
          </p>
        </div>
        
        {/* Only show create button if user has permission */}
        <PermissionGuard permission={Permission.PROJECT_CREATE}>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </PermissionGuard>
      </div>

      {/* Admin statistics - only visible to admins */}
      <RoleGuard role={UserRole.ADMIN}>
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Admin Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'Active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </RoleGuard>

      {/* Projects grid */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No projects yet</p>
            {canCreate && (
              <Button className="mt-4" onClick={handleCreate}>
                Create Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action buttons - conditionally rendered */}
                <div className="flex gap-2">
                  {/* View button - everyone with read permission */}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>

                  {/* Edit button - only with update permission */}
                  <PermissionGuard permission={Permission.PROJECT_UPDATE}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(project._id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </PermissionGuard>

                  {/* Share button - admin only or with read_all permission */}
                  {(isAdmin || canReadAll) && (
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  )}

                  {/* Delete button - only with delete permission */}
                  <PermissionGuard permission={Permission.PROJECT_DELETE}>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </PermissionGuard>

                  {/* Archive button - admin only */}
                  <RoleGuard role={UserRole.ADMIN}>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  </RoleGuard>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Admin tools section */}
      <RoleGuard role={UserRole.ADMIN}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline">Export All Projects</Button>
              <Button variant="outline">Import Projects</Button>
              <Button variant="outline">Bulk Operations</Button>
            </div>
          </CardContent>
        </Card>
      </RoleGuard>
    </div>
  );
}
