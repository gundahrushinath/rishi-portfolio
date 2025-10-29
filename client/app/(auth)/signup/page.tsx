'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { UserPlus, Mail } from 'lucide-react';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormError } from '@/components/auth/FormError';
import { FormInput } from '@/components/auth/FormInput';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { useAuthForm } from '@/hooks/use-auth-form';

export default function SignUpPage() {
  const {
    formData,
    errors,
    loading,
    success,
    updateField,
    handleSubmit,
  } = useAuthForm('signup');
  const router = useRouter();

  if (success) {
    return (
      <SuccessMessage
        title="Check Your Email!"
        description={`We've sent a verification link to ${formData.email}`}
      >
        <div className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-md text-sm">
          <p className="font-semibold mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Verification Email Sent
          </p>
          <p className="mb-2">
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-xs">
            The link will expire in 24 hours. If you don't see it, check your spam folder.
          </p>
        </div>
        <div className="text-center space-y-2">
          <Button
            onClick={() => router.push('/signin')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Sign In
          </Button>
          <p className="text-xs text-slate-400">
            Already verified?{' '}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300">
              Sign in now
            </Link>
          </p>
        </div>
      </SuccessMessage>
    );
  }

  return (
    <AuthCard
      icon={UserPlus}
      title="Create an Account"
      description="Join us and get access to exclusive content"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && <FormError message={errors.general} />}
        
        <FormInput
          id="name"
          label="Name"
          type="text"
          placeholder="Enter Name"
          value={formData.name || ''}
          onChange={(value) => updateField('name', value)}
          required
        />

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
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword || ''}
          onChange={(value) => updateField('confirmPassword', value)}
          required
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm sm:text-base"
          disabled={loading}
        >
          {loading && <Spinner className="mr-2" />}
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign in"
        linkHref="/signin"
      />
    </AuthCard>
  );
}
