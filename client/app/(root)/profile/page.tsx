'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/use-permission';
import { NoAccess } from '@/components/auth/NoAccess';
import { Permission } from '@/models/user';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DATA } from '@/data/resume';
import { ResumeCard } from '@/components/portfolio/resume-card';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const canRead = usePermission(Permission.USER_READ);
  const canUpdate = usePermission(Permission.USER_UPDATE);

  // Auth loading check
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full max-w-4xl" />
        <Skeleton className="h-64 w-full max-w-4xl" />
        <div className="grid gap-4 md:grid-cols-3 max-w-4xl">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // Permission check
  if (!canRead) {
    return <NoAccess feature="Profile" permission={Permission.USER_READ} />;
  }

  if (!user) {
    return null;
  }

  const userInitials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="p-6">
      <div className="max-w-5xl space-y-10">
        <section>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    {DATA.description}
                  </p>
                </div>
                {canUpdate ? (
                  <Button>Edit Profile</Button>
                ) : (
                  <p className="text-xs text-muted-foreground">View-only mode</p>
                )}
              </div>
            </CardHeader>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" defaultValue={user.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joined">Member Since</Label>
                  <Input id="joined" defaultValue="October 2025" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Total projects created</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">Resources accessed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Account status</p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Work Experience</h2>
            <p className="text-sm text-muted-foreground">A snapshot of the teams and products I have contributed to.</p>
          </div>
          <div className="space-y-3">
            {DATA.work.map((role) => (
              <ResumeCard
                key={`${role.company}-${role.start}`}
                logoUrl={role.logoUrl}
                altText={role.company}
                title={role.company}
                subtitle={role.title}
                href={role.href}
                badges={role.badges}
                period={`${role.start} - ${role.end ?? 'Present'}`}
                description={role.description}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Education</h2>
            <p className="text-sm text-muted-foreground">Formal programs and cohorts that shaped my journey.</p>
          </div>
          <div className="space-y-3">
            {DATA.education.map((education) => (
              <ResumeCard
                key={`${education.school}-${education.start}`}
                logoUrl={education.logoUrl}
                altText={education.school}
                title={education.school}
                subtitle={education.degree}
                href={education.href}
                period={`${education.start} - ${education.end}`}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Skills</h2>
            <p className="text-sm text-muted-foreground">Tooling and technologies I reach for every day.</p>
          </div>
          <Card>
            <CardContent className="flex flex-wrap gap-2 pt-6">
              {DATA.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
