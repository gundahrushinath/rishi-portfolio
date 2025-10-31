'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission, useRole } from '@/hooks/use-permission';
import { Permission, UserRole } from '@/models/user';
import { PageContainer } from '@/components/layout';

/**
 * Example: Page protected by role
 * Only admins can access this page
 */
export default function AdminOnlyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = useRole(UserRole.ADMIN);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <PageContainer>
      <h1>Admin Only Page</h1>
      <p>Only admins can see this content.</p>
    </PageContainer>
  );
}
