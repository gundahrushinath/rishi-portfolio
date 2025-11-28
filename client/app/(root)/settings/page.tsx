'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  PERSONALIZATION_STORAGE_KEY,
  accentOptions,
  accentSamples,
  applyPersonalizationToDocument,
  defaultPersonalizationPrefs,
  mergePersonalizationPrefs,
  type PersonalizationPreferences,
} from '@/lib/personalization';

export default function SettingsPage() {
  const { user, updateUser, loading } = useAuth();
  const canRead = usePermission(Permission.SETTINGS_READ);
  const canUpdate = usePermission(Permission.SETTINGS_UPDATE);

  const NOTIFICATION_STORAGE_KEY = 'dashboard-notification-preferences';

  const defaultNotificationPrefs = {
    emailUpdates: true,
    projectDigest: true,
    securityAlerts: true,
    productNews: false,
  } as const;

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

  // Preference state
  const [notificationPrefs, setNotificationPrefs] = useState<typeof defaultNotificationPrefs>(defaultNotificationPrefs);
  const [personalizationPrefs, setPersonalizationPrefs] = useState<PersonalizationPreferences>(defaultPersonalizationPrefs);
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSavedAt, setPrefsSavedAt] = useState<Date | null>(null);
  const [prefsReady, setPrefsReady] = useState(false);
  const { setTheme } = useTheme();

  const notificationSettings = [
    {
      key: 'emailUpdates' as const,
      title: 'Email notifications',
      description: 'Receive actionable updates about your workspace and invites.',
    },
    {
      key: 'projectDigest' as const,
      title: 'Weekly project digest',
      description: 'Get a summary of progress, blockers, and achievements every Monday.',
    },
    {
      key: 'securityAlerts' as const,
      title: 'Security alerts',
      description: 'Be notified instantly if we detect unusual sign-in activity.',
    },
    {
      key: 'productNews' as const,
      title: 'Product announcements',
      description: 'Hear about new features, beta programs, and upcoming events.',
    },
  ];

  const preferenceStatus = useMemo(() => {
    if (!prefsReady) {
      return 'Loading settings…';
    }
    if (prefsSaving) {
      return 'Saving your preferences…';
    }
    if (prefsSavedAt) {
      return `Preferences saved ${prefsSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'Preferences are up to date.';
  }, [prefsReady, prefsSaving, prefsSavedAt]);

  const handleNotificationToggle = (key: keyof typeof defaultNotificationPrefs) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePersonalizationChange = <K extends keyof PersonalizationPreferences>(
    field: K,
    value: PersonalizationPreferences[K],
  ) => {
    setPersonalizationPrefs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const planLabel = useMemo(() => {
    if (!user) return 'Personal Plan';
    return user.role === 'admin' ? 'Admin Workspace' : 'Personal Plan';
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return '—';
    try {
      return new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  }, [user?.createdAt]);

  const quickActions = [
    { label: 'View profile', href: '/profile' },
    { label: 'Review diary', href: '/diary' },
    { label: 'Manage projects', href: '/projects' },
    { label: 'Create note', href: '/notes' },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedNotifications = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      const storedPersonalization = window.localStorage.getItem(PERSONALIZATION_STORAGE_KEY);

      if (storedNotifications) {
        setNotificationPrefs({ ...defaultNotificationPrefs, ...JSON.parse(storedNotifications) });
      }

      if (storedPersonalization) {
        setPersonalizationPrefs(mergePersonalizationPrefs(JSON.parse(storedPersonalization)));
      }
    } catch (error) {
      console.error('Failed to hydrate settings preferences', error);
    } finally {
      setPrefsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!prefsReady) return;
    applyPersonalizationToDocument(personalizationPrefs);
    setTheme(personalizationPrefs.theme);
  }, [personalizationPrefs, prefsReady, setTheme]);

  useEffect(() => {
    if (!prefsReady || typeof window === 'undefined') return;

    setPrefsSaving(true);
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationPrefs));
      window.localStorage.setItem(PERSONALIZATION_STORAGE_KEY, JSON.stringify(personalizationPrefs));
      setPrefsSaving(false);
      setPrefsSavedAt(new Date());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [notificationPrefs, personalizationPrefs, prefsReady]);

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

              <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Current plan</CardDescription>
                    <CardTitle className="text-lg">{planLabel}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Member since {memberSince}</p>
                    <p className="mt-1">Email: {user?.email}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/profile">Update profile</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/dashboard">Go to overview</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Security snapshot</CardDescription>
                    <CardTitle className="text-lg">Good standing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Password strength</span>
                      <Badge variant="outline">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-factor auth</span>
                      <Badge variant="secondary">Coming soon</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">Stay alerted with security notifications for unusual sign-ins.</p>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Quick actions</CardDescription>
                    <CardTitle className="text-lg">Jump back in</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {quickActions.map((action) => (
                      <Button asChild key={action.href} variant="secondary" size="sm">
                        <Link href={action.href}>{action.label}</Link>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
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
                  {notificationSettings.map((setting, index) => (
                    <div key={setting.key} className="space-y-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium capitalize">{setting.title}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <Switch
                          checked={notificationPrefs[setting.key]}
                          onCheckedChange={() => handleNotificationToggle(setting.key)}
                          disabled={!canUpdate}
                        />
                      </div>
                      {index < notificationSettings.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <p>{preferenceStatus}</p>
                  {!canUpdate && <span>Read-only: insufficient permission.</span>}
                </CardFooter>
              </Card>

              {/* Personalization Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    <CardTitle>Personalization</CardTitle>
                  </div>
                  <CardDescription>
                    Tailor the dashboard to match your working style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Theme preference</Label>
                      <Select
                        value={personalizationPrefs.theme}
                        onValueChange={(value) => handlePersonalizationChange('theme', value as typeof personalizationPrefs.theme)}
                        disabled={!canUpdate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">Match system</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Interface density</Label>
                      <Select
                        value={personalizationPrefs.density}
                        onValueChange={(value) => handlePersonalizationChange('density', value as typeof personalizationPrefs.density)}
                        disabled={!canUpdate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select density" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Accent color</Label>
                    <div className="flex flex-wrap gap-3">
                      {accentOptions.map((accent) => (
                        <button
                          key={accent}
                          type="button"
                          disabled={!canUpdate}
                          aria-label={`Use ${accent} accent`}
                          className={`h-9 w-9 rounded-full border-2 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 ${
                            personalizationPrefs.accent === accent ? 'border-primary ring-2 ring-primary/40' : 'border-border'
                          } ${accentSamples[accent]}`}
                          onClick={() => handlePersonalizationChange('accent', accent)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Personalization preferences are stored on this device.
                </CardFooter>
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
