'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Lock } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormInput } from '@/components/auth/FormInput';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { useAuthForm } from '@/hooks/use-auth-form';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const {
    formData,
    errors,
    loading,
    success,
    updateField,
    handleSubmit,
    setErrors,
  } = useAuthForm('reset-password');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setErrors({ general: 'Invalid reset link' });
      toast.error('Invalid link', {
        description: 'The password reset link is invalid or has expired.',
      });
    }
  }, [token, setErrors]);

  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e, () => {
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    }, token || undefined);
  };

  if (success) {
    return (
      <SuccessMessage
        title="Password Reset!"
        description="Your password has been successfully reset"
      >
        <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-md text-sm">
          <p className="font-semibold mb-1">✓ Success!</p>
          <p>You can now sign in with your new password.</p>
        </div>
        <div className="text-center">
          <p className="text-slate-300 mb-4">
            Redirecting to sign in page in 3 seconds...
          </p>
          <Button
            onClick={() => router.push('/signin')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Sign In Now
          </Button>
        </div>
      </SuccessMessage>
    );
  }

  return (
    <AuthCard
      icon={Lock}
      title="Reset Password"
      description="Enter your new password below"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {errors.general && <FormError message={errors.general} />}
        
        <FormInput
          id="password"
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={formData.password || ''}
          onChange={(value) => updateField('password', value)}
          required
          disabled={!token}
          helperText="Minimum 6 characters"
        />

        <FormInput
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword || ''}
          onChange={(value) => updateField('confirmPassword', value)}
          required
          disabled={!token}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
          disabled={loading || !token}
        >
          {loading && <Spinner className="mr-2" />}
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <Link href="/signin" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
