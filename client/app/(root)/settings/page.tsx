'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/use-permission';
import { NoAccess } from '@/components/auth/NoAccess';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Lock,
  Shield,
  Palette,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { Permission } from '@/models/user';

export default function SettingsPage() {
  const { user, updateUser, loading } = useAuth();
  const canRead = usePermission(Permission.SETTINGS_READ);
  const canUpdate = usePermission(Permission.SETTINGS_UPDATE);

  // Username state
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Auth loading check
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Permission check
  if (!canRead) {
    return <NoAccess feature="Settings" permission={Permission.SETTINGS_READ} />;
  }

  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
    }
  }, [user]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || username.trim().length === 0) {
      toast.error('Name cannot be empty');
      return;
    }

    if (username.trim() === user?.name) {
      toast.info('No changes to save');
      return;
    }

    setUsernameLoading(true);

    try {
      const response = await authService.updateProfile(username.trim());
      updateUser(response.user);
      toast.success('Name updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update name';
      toast.error(errorMessage);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm');
      return;
    }

    setDeleteLoading(true);

    try {
      await authService.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete account';
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 h-full">
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-6 pr-4">
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Account Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account preferences and security settings
                </p>
              </div>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <CardTitle>Account Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateUsername} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="settings-name">Full Name</Label>
                      <Input 
                        id="settings-name" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your full name"
                        disabled={usernameLoading || !canUpdate}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-email">Email Address</Label>
                      <Input 
                        id="settings-email" 
                        type="email" 
                        defaultValue={user?.email || ''}
                        disabled
                        className="bg-muted cursor-not-allowed opacity-60"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                    <Button type="submit" disabled={usernameLoading || !canUpdate}>
                      {usernameLoading && <Spinner className="mr-2" />}
                      {usernameLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {!canUpdate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        You don&apos;t have permission to update settings
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        disabled={passwordLoading || !canUpdate}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        disabled={passwordLoading || !canUpdate}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        disabled={passwordLoading || !canUpdate}
                      />
                    </div>
                    <Button type="submit" disabled={passwordLoading || !canUpdate}>
                      {passwordLoading && <Spinner className="mr-2" />}
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                    {!canUpdate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        You don&apos;t have permission to update settings
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects via email
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Project Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new resources and features
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={!canUpdate}
                    >
                      Delete Account
                    </Button>
                  </div>
                  {!canUpdate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      You don&apos;t have permission to delete your account
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="delete-password">Enter your password to confirm</Label>
              <Input
                id="delete-password"
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                disabled={deleteLoading}
              />
            </div>
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <p className="font-medium">Warning:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>All your projects will be deleted</li>
                <li>All your resources will be removed</li>
                <li>This action cannot be reversed</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeletePassword('');
              }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading || !deletePassword}
            >
              {deleteLoading && <Spinner className="mr-2" />}
              {deleteLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      </ScrollArea>
    </div>
  );
}
