'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/use-permission';
import { UserRole } from '@/models/user';
import { AdminNav } from '@/components/admin/AdminNav';

/**
 * Admin Layout - Protects all /admin/* routes
 * Redirects non-admins to dashboard
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (!loading && !user) {
      // Not logged in - redirect to signin
      router.push('/signin');
    } else if (!loading && !isAdmin) {
      // Logged in but not admin - redirect to dashboard
      router.push('/dashboard');
    }
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <AdminNav />
      {children}
    </div>
  );
}
