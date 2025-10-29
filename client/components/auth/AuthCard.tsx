import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { COMPONENT_STYLES, ANIMATION, TRANSITIONS } from '@/lib/design-system';

interface AuthCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ icon: Icon, title, description, children }: AuthCardProps) {
  return (
    <Card className={`${COMPONENT_STYLES.authCard} ${TRANSITIONS.all} w-full max-w-md mx-auto`}>
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full bg-primary/10 ${TRANSITIONS.all} hover:bg-primary/20`}>
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">{children}</CardContent>
    </Card>
  );
}
