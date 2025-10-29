import { GRADIENTS, COMPONENT_STYLES } from '@/lib/design-system';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthErrorBoundary>
      <div className={`min-h-screen ${GRADIENTS.auth} flex items-center justify-center p-4 sm:p-6 md:p-8`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
