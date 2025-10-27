'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

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
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`,
        { withCredentials: true }
      );

      setStatus('success');
      setMessage(response.data.message);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/50 border-slate-800">
      <CardHeader className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-white">Verifying Email...</CardTitle>
              <CardDescription className="text-slate-400">
                Please wait while we verify your email address
              </CardDescription>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Email Verified!</CardTitle>
              <CardDescription className="text-slate-400">
                {message}
              </CardDescription>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-white">Verification Failed</CardTitle>
              <CardDescription className="text-slate-400">
                {message}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
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
          )}

          {status === 'error' && (
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
          )}
        </CardContent>
      </Card>
  );
}
