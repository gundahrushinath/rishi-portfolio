import { CheckCircle } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface SuccessMessageProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SuccessMessage({ title, description, children }: SuccessMessageProps) {
  return (
    <AuthCard
      icon={CheckCircle}
      title={title}
      description={description}
    >
      <div className="space-y-4">{children}</div>
    </AuthCard>
  );
}
