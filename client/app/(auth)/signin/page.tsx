'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormInput } from '@/components/auth/FormInput';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signin(email, password);
      toast.success('Welcome back!', {
        description: 'You have successfully signed in.',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error('Sign in failed', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      icon={LogIn}
      title="Welcome Back"
      description="Sign in to access your dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={setEmail}
          required
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={setPassword}
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
