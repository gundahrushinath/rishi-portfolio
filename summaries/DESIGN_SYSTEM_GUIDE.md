# Design System Guide

This guide explains how to use the centralized design system to maintain consistency across the application.

## Overview

The design system is defined in `lib/design-system.ts` and provides centralized constants for:
- Spacing
- Animations
- Z-Index layers
- Component styles
- Typography
- Transitions
- Gradients
- Icon sizes
- Layouts

## Core Principles

1. **Theme-Aware**: Use CSS variables (e.g., `bg-background`, `text-foreground`) instead of hardcoded colors
2. **Centralized Constants**: Import from `lib/design-system.ts` instead of inline values
3. **Consistent Spacing**: Use SPACING constants for margins, padding, and gaps
4. **Reusable Components**: Build on shared components in `components/auth`, `components/layout`, etc.

## Usage Examples

### Spacing

```tsx
import { SPACING } from '@/lib/design-system';

// Use in className
<div className={SPACING.section}> // py-16 md:py-24
<div className={SPACING.container}> // px-4 sm:px-6 lg:px-8
```

### Icon Sizes

```tsx
import { ICON_SIZES } from '@/lib/design-system';

<Mail className={ICON_SIZES.md} /> // h-5 w-5
<ArrowLeft className={ICON_SIZES.sm} /> // h-4 w-4
```

### Typography

```tsx
import { TYPOGRAPHY } from '@/lib/design-system';

<h1 className={TYPOGRAPHY.h1}>Main Heading</h1>
<p className={TYPOGRAPHY.body}>Body text</p>
```

### Component Styles

```tsx
import { COMPONENT_STYLES } from '@/lib/design-system';

<div className={COMPONENT_STYLES.page}>
  <div className={COMPONENT_STYLES.container}>
    // Content
  </div>
</div>
```

### Transitions

```tsx
import { TRANSITIONS } from '@/lib/design-system';

<button className={TRANSITIONS.all}>
  // Smooth transitions on all properties
</button>

<input className={TRANSITIONS.colors}>
  // Smooth color transitions only
</input>
```

### Z-Index

```tsx
import { Z_INDEX } from '@/lib/design-system';

<header className={`sticky top-0 ${Z_INDEX.sticky}`}>
<div className={`fixed inset-0 ${Z_INDEX.modal}`}>
```

### Gradients

```tsx
import { GRADIENTS } from '@/lib/design-system';

<div className={GRADIENTS.auth}>
  // Authentication page gradient background
</div>
```

## Reusable Components

### Auth Components

All authentication pages should use these components:

- **AuthCard**: Card container with icon, title, and description
- **FormInput**: Consistent form input with validation support
- **FormError**: Error message display with icon
- **SuccessMessage**: Success state display
- **AuthFooter**: Footer with links and navigation

```tsx
import { AuthCard, FormInput, FormError } from '@/components/auth';

<AuthCard 
  icon={Mail} 
  title="Sign In"
  description="Enter your credentials"
>
  <FormInput
    label="Email"
    type="email"
    icon={Mail}
    error={errors.email}
    // ... other props
  />
  {errors.general && <FormError error={errors.general} />}
</AuthCard>
```

### Layout Components

- **PageContainer**: Consistent page wrapper with max-width and padding
- **Section**: Section wrapper with optional title and description

```tsx
import { PageContainer, Section } from '@/components/layout';

<PageContainer maxWidth="7xl">
  <Section 
    title="About" 
    description="Learn more about us"
  >
    // Content
  </Section>
</PageContainer>
```

### Loading States

Use the Loading component for consistent loading indicators:

```tsx
import { Loading, LoadingSkeleton, LoadingCard } from '@/components/ui/loading';

// Spinner with text
<Loading size="md" text="Loading..." />

// Full-screen loading
<Loading fullScreen />

// Skeleton for cards
<LoadingSkeleton className="h-20 w-full" />
```

## Toast Notifications

Use Sonner for all toast notifications:

```tsx
import { toast } from 'sonner';
import { toastUtils } from '@/lib/toast';

// Success
toast.success('Success!', { description: 'Action completed' });

// Error
toast.error('Error!', { description: 'Something went wrong' });

// Using utilities
toastUtils.auth.signInSuccess();
toastUtils.validation.invalidEmail();
```

## Color System

Always use theme-aware colors:

### Background & Text
- `bg-background` - Main background
- `bg-foreground` - Foreground elements
- `text-foreground` - Main text
- `text-muted-foreground` - Muted text

### Semantic Colors
- `bg-primary` / `text-primary` - Primary brand color
- `bg-secondary` / `text-secondary` - Secondary elements
- `bg-destructive` / `text-destructive` - Errors and warnings
- `bg-muted` / `text-muted` - Muted elements

### Opacity Modifiers
- `bg-primary/10` - 10% opacity
- `border-primary/50` - 50% opacity border

## Best Practices

### ✅ DO

```tsx
// Use design system constants
import { SPACING, ICON_SIZES } from '@/lib/design-system';
<div className={SPACING.container}>
  <Icon className={ICON_SIZES.md} />
</div>

// Use theme colors
<div className="bg-background text-foreground">

// Use reusable components
<AuthCard icon={Mail} title="Sign In">
```

### ❌ DON'T

```tsx
// Don't hardcode colors
<div className="bg-slate-900 text-blue-400">

// Don't hardcode sizes
<Icon className="h-5 w-5" />

// Don't duplicate component logic
// Use existing components instead
```

## Animation Delays

For consistent animations, use the blur fade delay:

```tsx
import { ANIMATION } from '@/lib/design-system';

<BlurFade delay={ANIMATION.blur_fade_delay * 3}>
```

## Responsive Design

The design system includes responsive utilities:

```tsx
// Spacing adapts to screen size
SPACING.section // py-16 md:py-24
SPACING.container // px-4 sm:px-6 lg:px-8

// Typography adapts to screen size
TYPOGRAPHY.h1 // text-4xl md:text-5xl lg:text-6xl
```

## Icons

Always use Lucide React icons with consistent sizing:

```tsx
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { ICON_SIZES } from '@/lib/design-system';

<Mail className={ICON_SIZES.md} />
<ArrowLeft className={ICON_SIZES.sm} />
```

## Forms

Use FormInput for all form fields:

```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  icon={Mail}
  placeholder="you@example.com"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  disabled={isLoading}
/>
```

## Error Handling

Use FormError for consistent error display:

```tsx
import { FormError } from '@/components/auth';

{errors.general && <FormError error={errors.general} />}
```

## Layout Structure

Standard page structure:

```tsx
<PageContainer>
  <Section title="Page Title">
    {/* Main content */}
  </Section>
  
  <Section title="Another Section">
    {/* More content */}
  </Section>
</PageContainer>
```

## Dashboard Layout

Dashboard pages use consistent layout:

```tsx
<SidebarProvider>
  <DashboardSidebar currentPath={pathname} />
  <main className="flex-1">
    <DashboardHeader />
    <div className={COMPONENT_STYLES.container}>
      {/* Page content */}
    </div>
  </main>
</SidebarProvider>
```

## Adding New Components

When creating new components:

1. Import design system constants
2. Use theme-aware colors
3. Include proper transitions
4. Support dark/light mode
5. Follow accessibility guidelines
6. Add TypeScript types

Example:

```tsx
import { TRANSITIONS, COMPONENT_STYLES } from '@/lib/design-system';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  children: ReactNode;
  className?: string;
}

export function MyComponent({ children, className }: MyComponentProps) {
  return (
    <div className={cn(
      'bg-background text-foreground',
      COMPONENT_STYLES.card,
      TRANSITIONS.all,
      className
    )}>
      {children}
    </div>
  );
}
```

## Maintenance

When updating the design system:

1. Update `lib/design-system.ts` with new constants
2. Document changes in this guide
3. Update affected components
4. Test in both light and dark modes
5. Verify responsive behavior

## Resources

- Design tokens: `lib/design-system.ts`
- Toast utilities: `lib/toast.ts`
- Validation helpers: `lib/validation.ts`
- Reusable components: `components/auth/*`, `components/layout/*`
- UI primitives: `components/ui/*`
