import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { validateEmail } from '@/lib/validation';
import { toast } from 'sonner';

interface FormState {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function useAuthForm(type: 'signin' | 'signup' | 'forgot-password' | 'reset-password') {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const updateField = (field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (type !== 'reset-password') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    // Password validation
    if (type !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    // Confirm password validation
    if (type === 'signup' || type === 'reset-password') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Name validation for signup
    if (type === 'signup' && !formData.name) {
      newErrors.general = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent, onSuccess?: () => void, token?: string) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;
      
      switch (type) {
        case 'signin':
          // Handled by AuthContext
          break;
        case 'signup':
          response = await authService.signup(
            formData.name!,
            formData.email,
            formData.password
          );
          setSuccess(true);
          toast.success('Account created!', {
            description: 'Please check your email to verify your account.',
          });
          break;
        case 'forgot-password':
          response = await authService.forgotPassword(formData.email);
          setSuccess(true);
          toast.success('Email sent!', {
            description: 'Check your inbox for password reset instructions.',
          });
          if (onSuccess) onSuccess();
          break;
        case 'reset-password':
          if (token) {
            response = await authService.resetPassword(token, formData.password);
            setSuccess(true);
            toast.success('Password reset successful!', {
              description: 'You can now sign in with your new password.',
            });
            if (onSuccess) onSuccess();
          }
          break;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setErrors({ general: errorMessage });
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    success,
    updateField,
    handleSubmit,
    setLoading,
    setErrors,
  };
}
