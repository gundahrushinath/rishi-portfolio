'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Authentication Error</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                There was a problem with authentication. Please try signing in again.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/signin')}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button onClick={() => router.push('/')} className="flex-1">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
