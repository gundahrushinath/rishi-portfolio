import { AlertCircle } from 'lucide-react';
import { TRANSITIONS } from '@/lib/design-system';

interface FormErrorProps {
  message: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-start gap-2 bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg text-sm ${TRANSITIONS.all}`}>
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
