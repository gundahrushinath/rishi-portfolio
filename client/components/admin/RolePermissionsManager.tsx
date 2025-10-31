'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Save, RotateCcw } from 'lucide-react';
import { UserRole } from '@/models/user';
import api from '@/lib/api';

// All available permissions grouped by category
const PERMISSION_CATEGORIES = {
  'Projects': [
    { value: 'project:create', label: 'Create Projects', description: 'Allow creating new projects' },
    { value: 'project:read', label: 'Read Projects', description: 'View own projects' },
    { value: 'project:update', label: 'Update Projects', description: 'Edit own projects' },
    { value: 'project:delete', label: 'Delete Projects', description: 'Delete own projects' },
    { value: 'project:read:all', label: 'Read All Projects', description: 'View all users\' projects' },
  ],
  'Notes': [
    { value: 'note:create', label: 'Create Notes', description: 'Allow creating new notes' },
    { value: 'note:read', label: 'Read Notes', description: 'View own notes' },
    { value: 'note:update', label: 'Update Notes', description: 'Edit own notes' },
    { value: 'note:delete', label: 'Delete Notes', description: 'Delete own notes' },
    { value: 'note:read:all', label: 'Read All Notes', description: 'View all users\' notes' },
  ],
  'Diary': [
    { value: 'diary:create', label: 'Create Diary Entries', description: 'Allow creating diary entries' },
    { value: 'diary:read', label: 'Read Diary', description: 'View own diary entries' },
    { value: 'diary:update', label: 'Update Diary', description: 'Edit own diary entries' },
    { value: 'diary:delete', label: 'Delete Diary', description: 'Delete own diary entries' },
    { value: 'diary:read:all', label: 'Read All Diaries', description: 'View all users\' diary entries' },
  ],
  'Todos': [
    { value: 'todo:create', label: 'Create Todos', description: 'Allow creating new todos' },
    { value: 'todo:read', label: 'Read Todos', description: 'View own todos' },
    { value: 'todo:update', label: 'Update Todos', description: 'Edit own todos' },
    { value: 'todo:delete', label: 'Delete Todos', description: 'Delete own todos' },
    { value: 'todo:read:all', label: 'Read All Todos', description: 'View all users\' todos' },
  ],
  'Resources': [
    { value: 'resource:create', label: 'Create Resources', description: 'Allow creating new resources' },
    { value: 'resource:read', label: 'Read Resources', description: 'View resources' },
    { value: 'resource:update', label: 'Update Resources', description: 'Edit resources' },
    { value: 'resource:delete', label: 'Delete Resources', description: 'Delete resources' },
    { value: 'resource:read:all', label: 'Read All Resources', description: 'View all resources' },
  ],
  'User Management': [
    { value: 'user:read', label: 'Read Own Profile', description: 'View own user profile' },
    { value: 'user:update', label: 'Update Own Profile', description: 'Edit own user profile' },
    { value: 'user:delete', label: 'Delete Own Account', description: 'Delete own account' },
    { value: 'user:read:all', label: 'Read All Users', description: 'View all user profiles' },
    { value: 'user:update:all', label: 'Update All Users', description: 'Edit any user profile' },
    { value: 'user:delete:all', label: 'Delete Any User', description: 'Delete any user account' },
  ],
  'Settings': [
    { value: 'settings:read', label: 'Read Settings', description: 'View settings' },
    { value: 'settings:update', label: 'Update Settings', description: 'Modify settings' },
  ],
};

// Default permissions for each role
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: Object.values(PERMISSION_CATEGORIES).flat().map(p => p.value),
  [UserRole.USER]: [
    'project:create', 'project:read', 'project:update', 'project:delete',
    'note:create', 'note:read', 'note:update', 'note:delete',
    'diary:create', 'diary:read', 'diary:update', 'diary:delete',
    'todo:create', 'todo:read', 'todo:update', 'todo:delete',
    'resource:create', 'resource:read', 'resource:update', 'resource:delete',
    'user:read', 'user:update',
    'settings:read', 'settings:update',
  ],
  [UserRole.GUEST]: [
    'project:read',
    'note:read',
    'resource:read',
    'user:read',
    'settings:read',
  ],
};

export default function RolePermissionsManager() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);
  const [permissions, setPermissions] = useState<Record<UserRole, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load permissions from server on mount
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await api.get('/roles/permissions');
      if (response.data.permissions) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Fall back to defaults if loading fails
      toast.error('Failed to load permissions, using defaults');
    }
  };

  const currentPermissions = permissions[selectedRole] || [];

  const togglePermission = (permission: string) => {
    setPermissions(prev => {
      const rolePerms = prev[selectedRole] || [];
      const newPerms = rolePerms.includes(permission)
        ? rolePerms.filter(p => p !== permission)
        : [...rolePerms, permission];
      
      setHasChanges(true);
      return { ...prev, [selectedRole]: newPerms };
    });
  };

  const toggleAllInCategory = (category: string) => {
    const categoryPermissions = PERMISSION_CATEGORIES[category as keyof typeof PERMISSION_CATEGORIES];
    const categoryValues = categoryPermissions.map(p => p.value);
    const allSelected = categoryValues.every(p => currentPermissions.includes(p));

    setPermissions(prev => {
      const rolePerms = prev[selectedRole] || [];
      const newPerms = allSelected
        ? rolePerms.filter(p => !categoryValues.includes(p))
        : [...new Set([...rolePerms, ...categoryValues])];
      
      setHasChanges(true);
      return { ...prev, [selectedRole]: newPerms };
    });
  };

  const resetToDefaults = async () => {
    if (confirm('Reset all permissions to default values? This will discard any custom changes.')) {
      setLoading(true);
      try {
        const response = await api.post('/roles/permissions/reset');
        setPermissions(response.data.permissions);
        setHasChanges(false);
        toast.success('Permissions reset to defaults');
      } catch (error) {
        console.error('Error resetting permissions:', error);
        toast.error('Failed to reset permissions');
      } finally {
        setLoading(false);
      }
    }
  };

  const savePermissions = async () => {
    setLoading(true);
    try {
      await api.put('/roles/permissions', { permissions });
      toast.success('Permissions saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionStats = (role: UserRole) => {
    const rolePerms = permissions[role] || [];
    const total = Object.values(PERMISSION_CATEGORIES).flat().length;
    return `${rolePerms.length}/${total}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Role Permissions Manager</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                size="sm"
                onClick={savePermissions}
                disabled={loading || !hasChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          <CardDescription>
            Customize permissions for each role. Changes will apply to all users with that role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value={UserRole.ADMIN}>
                <div className="flex items-center gap-2">
                  <span>Admin</span>
                  <Badge variant="secondary" className="text-xs">
                    {getPermissionStats(UserRole.ADMIN)}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value={UserRole.USER}>
                <div className="flex items-center gap-2">
                  <span>User</span>
                  <Badge variant="secondary" className="text-xs">
                    {getPermissionStats(UserRole.USER)}
                  </Badge>
                </div>
              </TabsTrigger>
              <TabsTrigger value={UserRole.GUEST}>
                <div className="flex items-center gap-2">
                  <span>Guest</span>
                  <Badge variant="secondary" className="text-xs">
                    {getPermissionStats(UserRole.GUEST)}
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => {
                const allSelected = perms.every(p => currentPermissions.includes(p.value));
                const someSelected = perms.some(p => currentPermissions.includes(p.value));

                return (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() => toggleAllInCategory(category)}
                            aria-label={`Toggle all ${category} permissions`}
                          />
                          <Label className="text-base font-semibold cursor-pointer">
                            {category}
                          </Label>
                          <Badge variant={allSelected ? "default" : someSelected ? "secondary" : "outline"}>
                            {perms.filter(p => currentPermissions.includes(p.value)).length}/{perms.length}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {perms.map((permission) => (
                        <div key={permission.value} className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                          <Checkbox
                            id={`${selectedRole}-${permission.value}`}
                            checked={currentPermissions.includes(permission.value)}
                            onCheckedChange={() => togglePermission(permission.value)}
                          />
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={`${selectedRole}-${permission.value}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
