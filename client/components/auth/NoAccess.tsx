'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Home, Mail } from 'lucide-react';

interface NoAccessProps {
  feature: string;
  permission: string;
  description?: string;
}

export function NoAccess({ feature, permission, description }: NoAccessProps) {
  const router = useRouter();

  // Format permission for display (e.g., "DIARY_READ" -> "Diary Read")
  const formatPermission = (perm: string) => {
    return perm
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl">No Access to {feature}</CardTitle>
              <CardDescription className="text-base mt-2">
                {description || `You don't have permission to access this page`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="border-destructive/50">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-lg">Permission Required</AlertTitle>
            <AlertDescription className="text-base mt-2">
              The <strong className="font-semibold">{formatPermission(permission)}</strong> permission 
              is required to access the {feature} section. Please contact your administrator to request access.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Need Access?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Contact your system administrator and request the following permission to be added to your account.
            </p>
            <code className="text-xs bg-background px-3 py-2 rounded border block">
              {permission}
            </code>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="default"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button 
              onClick={() => router.back()} 
              variant="outline"
              className="flex-1"
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
