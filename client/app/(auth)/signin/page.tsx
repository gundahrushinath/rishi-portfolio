'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LogIn } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormInput } from '@/components/auth/FormInput';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useAuthForm } from '@/hooks/use-auth-form';

export default function SignInPage() {
  const {
    formData,
    errors,
    loading,
    updateField,
    handleSubmit,
  } = useAuthForm('signin');

  return (
    <AuthCard
      icon={LogIn}
      title="Welcome Back"
      description="Sign in to access your dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && <FormError message={errors.general} />}
        
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter Email Address"
          value={formData.email || ''}
          onChange={(value) => updateField('email', value)}
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={formData.password || ''}
          onChange={(value) => updateField('password', value)}
          required
          labelExtra={
            <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
              Forgot password?
            </Link>
          }
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
          disabled={loading}
        >
          {loading && <Spinner className="mr-2" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <AuthFooter
        text="Don't have an account?"
        linkText="Sign up"
        linkHref="/signup"
      />
    </AuthCard>
  );
}
