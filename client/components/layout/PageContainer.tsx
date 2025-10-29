import { ReactNode } from 'react';
import { COMPONENT_STYLES, LAYOUTS } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  center?: boolean;
}

export function PageContainer({ 
  children, 
  className,
  maxWidth = '7xl',
  center = false 
}: PageContainerProps) {
  const maxWidthClass = maxWidth === 'full' ? '' : `max-w-${maxWidth}`;
  
  return (
    <div className={cn(
      COMPONENT_STYLES.page,
      className
    )}>
      <div className={cn(
        maxWidthClass,
        'mx-auto',
        COMPONENT_STYLES.container,
        center && LAYOUTS.flexColCenter
      )}>
        {children}
      </div>
    </div>
  );
}
