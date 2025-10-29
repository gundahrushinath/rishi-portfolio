'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Mail } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      toast.error('Invalid link', {
        description: 'The verification link is invalid or has expired.',
      });
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await authService.verifyEmail(token!);

      setStatus('success');
      setMessage(response.message);
      toast.success('Email verified!', {
        description: 'Your email has been successfully verified.',
      });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      setMessage(errorMessage);
      toast.error('Verification failed', {
        description: errorMessage,
      });
    }
  };

  if (status === 'loading') {
    return (
      <AuthCard
        icon={Mail}
        title="Verifying Email..."
        description="Please wait while we verify your email address"
      >
        <div className="flex justify-center py-8">
          <Spinner className="h-16 w-16" />
        </div>
      </AuthCard>
    );
  }

  if (status === 'success') {
    return (
      <SuccessMessage
        title="Email Verified!"
        description={message}
      >
        <div className="text-center">
          <p className="text-slate-300 mb-4">
            Redirecting to dashboard in 3 seconds...
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard Now
          </Button>
        </div>
      </SuccessMessage>
    );
  }

  return (
    <AuthCard
      icon={Mail}
      title="Verification Failed"
      description={message}
    >
      <div className="space-y-2">
        <Button
          onClick={() => router.push('/signin')}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Go to Sign In
        </Button>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full border-slate-700 hover:bg-slate-800"
        >
          Back to Home
        </Button>
      </div>
    </AuthCard>
  );
}
