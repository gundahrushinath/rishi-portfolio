'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
  },
  {
    href: '/admin/permissions',
    label: 'Role Permissions',
    icon: Shield,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6">
      <div className="flex gap-2 border-b pb-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
