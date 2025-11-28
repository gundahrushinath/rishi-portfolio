'use client';

/**
 * Example: Dashboard Sidebar with RBAC
 * Shows how to add role-based navigation to the sidebar
 */

import { useRouter, usePathname } from 'next/navigation';
import { useRole, usePermission } from '@/hooks/use-permission';
import { UserRole, Permission } from '@/models/user';
import { RoleGuard } from '@/components/auth/PermissionGuard';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Notebook,
  CheckSquare,
  Library,
  Settings,
  Users,
  Shield,
} from 'lucide-react';
import { ICON_SIZES } from '@/lib/design-system';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  role?: UserRole;
  requireAdmin?: boolean;
}

export function DashboardSidebarWithRBAC() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useRole(UserRole.ADMIN);

  // Define navigation items with their permission requirements
  const navigationItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      // No permission check - everyone can access
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      permission: Permission.PROJECT_READ,
    },
    {
      title: 'Notes',
      href: '/notes',
      icon: Notebook,
      permission: Permission.NOTE_READ,
    },
    {
      title: 'Diary',
      href: '/diary',
      icon: BookOpen,
      permission: Permission.DIARY_READ,
    },
    {
      title: 'Todos',
      href: '/todos',
      icon: CheckSquare,
      permission: Permission.TODO_READ,
    },
    {
      title: 'Resources',
      href: '/resources',
      icon: Library,
      permission: Permission.RESOURCE_READ,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      permission: Permission.SETTINGS_READ,
    },
  ];

  // Admin-only items
  const adminItems: NavItem[] = [
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      requireAdmin: true,
    },
    {
      title: 'Admin Panel',
      href: '/admin',
      icon: Shield,
      requireAdmin: true,
    },
  ];

  // Filter items based on permissions
  const visibleNavItems = navigationItems.filter(item => {
    // If no permission required, show it
    if (!item.permission) return true;
    
    // Check if user has the required permission
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return usePermission(item.permission);
  });

  // Only show admin items if user is admin
  const visibleAdminItems = isAdmin ? adminItems : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => router.push(item.href)} 
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <item.icon className={`${ICON_SIZES.md} shrink-0`} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only visible to admins */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => router.push(item.href)} 
                      tooltip={item.title}
                      isActive={pathname === item.href}
                    >
                      <item.icon className={`${ICON_SIZES.md} shrink-0`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <SidebarTrigger className="w-full h-9" />
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * Alternative approach: Using RoleGuard component
 */
export function DashboardSidebarAlternative() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className={ICON_SIZES.md} />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Conditionally render based on permission */}
              <PermissionMenuItem 
                permission={Permission.PROJECT_READ}
                href="/projects"
                icon={FolderKanban}
                title="Projects"
              />

              <PermissionMenuItem 
                permission={Permission.NOTE_READ}
                href="/notes"
                icon={Notebook}
                title="Notes"
              />

              {/* More items... */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin section */}
        <RoleGuard role={UserRole.ADMIN}>
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => router.push('/admin/users')}>
                    <Users className={ICON_SIZES.md} />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </RoleGuard>
      </SidebarContent>
    </Sidebar>
  );
}

// Helper component for permission-based menu items
function PermissionMenuItem({ 
  permission, 
  href, 
  icon: Icon, 
  title 
}: { 
  permission: Permission;
  href: string;
  icon: LucideIcon;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasPermission = usePermission(permission);

  if (!hasPermission) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={() => router.push(href)}
        isActive={pathname === href}
        tooltip={title}
      >
        <Icon className={ICON_SIZES.md} />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
