'use client';

import { useEffect } from 'react';
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
  Video,
  File,
  Code,
  ExternalLink,
  Download
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

const resources = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    description: 'Learn advanced React patterns and best practices for scalable applications',
    type: 'Video',
    icon: Video,
    category: 'Tutorial',
    duration: '2h 30m',
  },
  {
    id: 2,
    title: 'TypeScript Handbook',
    description: 'Complete guide to TypeScript for modern web development',
    type: 'Document',
    icon: File,
    category: 'Documentation',
    pages: '150 pages',
  },
  {
    id: 3,
    title: 'Next.js Best Practices',
    description: 'Production-ready Next.js patterns and optimization techniques',
    type: 'Code',
    icon: Code,
    category: 'Code Sample',
    files: '25 files',
  },
  {
    id: 4,
    title: 'Full-Stack Development Course',
    description: 'Complete MERN stack development course with real-world projects',
    type: 'Video',
    icon: Video,
    category: 'Course',
    duration: '15h',
  },
  {
    id: 5,
    title: 'UI/UX Design System',
    description: 'Comprehensive design system with reusable components and guidelines',
    type: 'Document',
    icon: File,
    category: 'Design',
    pages: '80 pages',
  },
  {
    id: 6,
    title: 'API Development Templates',
    description: 'REST API templates with authentication and database integration',
    type: 'Code',
    icon: Code,
    category: 'Template',
    files: '15 files',
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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
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
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
                <p className="text-muted-foreground">
                  Access exclusive tutorials, documentation, and code samples
                </p>
              </div>

              {/* Resource Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">20</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Code Samples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10</div>
                  </CardContent>
                </Card>
              </div>

              {/* Resources Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <resource.icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>
                      <CardTitle className="mt-4 text-lg">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{resource.type}</span>
                        <span>{resource.duration || resource.pages || resource.files}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" className="flex-1" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
