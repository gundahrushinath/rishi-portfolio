import { ReactNode } from 'react';
import { COMPONENT_STYLES, TYPOGRAPHY } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  description?: string;
  centered?: boolean;
}

export function Section({ 
  children, 
  className, 
  id,
  title,
  description,
  centered = false
}: SectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        COMPONENT_STYLES.section,
        className
      )}
    >
      {(title || description) && (
        <div className={cn(
          'mb-12',
          centered && 'text-center'
        )}>
          {title && (
            <h2 className={TYPOGRAPHY.h2}>{title}</h2>
          )}
          {description && (
            <p className={cn(TYPOGRAPHY.lead, 'mt-4')}>{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
