/**
 * Design System Constants
 * Centralized design tokens for consistent UI/UX across the application
 */

// Spacing Scale (consistent with Tailwind)
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

// Animation Durations
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  blur_fade_delay: 0.04,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  navbar: 30,
  modal: 40,
  toast: 50,
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Border Radius (consistent with theme)
export const RADIUS = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  full: '9999px',
} as const;

// Container Max Widths
export const CONTAINER = {
  xs: '20rem',      // 320px
  sm: '24rem',      // 384px
  md: '28rem',      // 448px
  lg: '32rem',      // 512px
  xl: '36rem',      // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px
} as const;

// Common Component Styles
export const COMPONENT_STYLES = {
  // Card variants
  card: {
    default: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    elevated: 'rounded-lg border bg-card text-card-foreground shadow-lg',
    interactive: 'rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300',
  },
  
  // Auth card specific
  authCard: 'w-full max-w-md bg-card/50 backdrop-blur-sm border shadow-xl',
  
  // Button sizes (consistent)
  button: {
    sizes: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
  },
  
  // Input styles
  input: 'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm',
  
  // Container padding
  container: 'px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  section: 'py-12 sm:py-16 lg:py-20',
  
  // Page layout
  page: 'min-h-screen',
  pageContent: 'mx-auto max-w-7xl',
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  h1: 'text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl',
  h2: 'text-3xl font-bold tracking-tight sm:text-4xl',
  h3: 'text-2xl font-bold tracking-tight sm:text-3xl',
  h4: 'text-xl font-bold tracking-tight sm:text-2xl',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',
  caption: 'text-xs',
  lead: 'text-xl text-muted-foreground',
  muted: 'text-sm text-muted-foreground',
} as const;

// Transition Classes
export const TRANSITIONS = {
  all: 'transition-all duration-300 ease-in-out',
  colors: 'transition-colors duration-300',
  transform: 'transition-transform duration-300',
  opacity: 'transition-opacity duration-300',
  shadow: 'transition-shadow duration-300',
} as const;

// Common Color Classes
export const COLORS = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
  accent: 'text-accent',
  destructive: 'text-destructive',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
} as const;

// Background Gradients
export const GRADIENTS = {
  auth: 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800',
  dashboard: 'bg-gradient-to-br from-background via-muted/10 to-background',
  hero: 'bg-gradient-to-b from-background via-background to-muted/20',
  card: 'bg-gradient-to-br from-card to-card/80',
} as const;

// Icon Sizes
export const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-10 w-10',
} as const;

// Common Layout Classes
export const LAYOUTS = {
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6',
  grid3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
  gridAuto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
} as const;

// Responsive Padding/Margin Utilities
export const RESPONSIVE = {
  paddingX: 'px-4 sm:px-6 lg:px-8',
  paddingY: 'py-4 sm:py-6 lg:py-8',
  padding: 'p-4 sm:p-6 lg:p-8',
  marginX: 'mx-4 sm:mx-6 lg:mx-8',
  marginY: 'my-4 sm:my-6 lg:my-8',
  margin: 'm-4 sm:m-6 lg:m-8',
  gap: 'gap-4 sm:gap-6 lg:gap-8',
  textSize: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
  },
} as const;
