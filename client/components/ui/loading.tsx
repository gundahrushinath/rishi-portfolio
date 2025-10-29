import { Spinner } from './spinner';
import { ICON_SIZES } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: ICON_SIZES.sm,
  md: ICON_SIZES.md,
  lg: ICON_SIZES.lg,
  xl: ICON_SIZES.xl,
};

export function Loading({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className 
}: LoadingProps) {
  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4',
      className
    )}>
      <Spinner className={cn(sizeMap[size])} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton components for more granular loading states
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  );
}

export function LoadingCard() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-20 w-full" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <LoadingSkeleton className="h-8 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
}
