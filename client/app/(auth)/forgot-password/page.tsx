'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { KeyRound, Mail } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormInput } from '@/components/auth/FormInput';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      toast.success('Email sent!', {
        description: 'Check your inbox for password reset instructions.',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email';
      setError(errorMessage);
      toast.error('Request failed', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage
        title="Check Your Email"
        description="If an account exists with that email, we've sent password reset instructions."
      >
        <div className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-md text-sm">
          <p className="font-semibold mb-1">📧 Email Sent!</p>
          <p>Please check your inbox and follow the instructions to reset your password.</p>
          <p className="mt-2 text-xs">The link will expire in 1 hour.</p>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400">
            Didn't receive the email? Check your spam folder.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
          >
            Try Another Email
          </Button>
        </div>
        <div className="text-center">
          <Link href="/signin" className="text-sm text-blue-400 hover:text-blue-300">
            ← Back to sign in
          </Link>
        </div>
      </SuccessMessage>
    );
  }

  return (
    <AuthCard
      icon={KeyRound}
      title="Forgot Password?"
      description="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />
        
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={setEmail}
          required
          icon={Mail}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
          disabled={loading}
        >
          {loading && <Spinner className="mr-2" />}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      
      <div className="mt-6 text-center space-y-2">
        <Link href="/signin" className="text-sm text-blue-400 hover:text-blue-300 block">
          ← Back to sign in
        </Link>
        <div className="text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
