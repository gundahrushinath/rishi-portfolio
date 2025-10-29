import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TRANSITIONS } from '@/lib/design-system';

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
  showBackToHome?: boolean;
}

export function AuthFooter({ text, linkText, linkHref, showBackToHome = true }: AuthFooterProps) {
  return (
    <>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {text}{' '}
        <Link 
          href={linkHref} 
          className={`text-primary hover:text-primary/80 font-medium ${TRANSITIONS.colors}`}
        >
          {linkText}
        </Link>
      </div>
      {showBackToHome && (
        <div className="mt-4 text-center">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground ${TRANSITIONS.colors}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      )}
    </>
  );
}
