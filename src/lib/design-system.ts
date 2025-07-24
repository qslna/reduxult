// Design System - Centralized styling and layout utilities
// 일관된 디자인 시스템과 레이아웃 유틸리티 제공

export const DESIGN_TOKENS = {
  // Typography
  fonts: {
    primary: 'Inter',
    display: 'Playfair Display',
    mono: 'JetBrains Mono'
  },

  // Colors (CSS variables)
  colors: {
    primary: {
      black: '#000000',
      white: '#ffffff'
    },
    gray: {
      dark: 'var(--gray-dark)',
      medium: 'var(--gray-medium)', 
      light: 'var(--gray-light)'
    },
    accent: {
      mocha: 'var(--accent-mocha)'
    }
  },

  // Spacing scale
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px',
    '2xl': '40px',
    '3xl': '60px',
    '4xl': '80px',
    '5xl': '120px'
  },

  // Breakpoints
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1600px'
  },

  // Z-index scale
  zIndex: {
    dropdown: 100,
    sticky: 500,
    fixed: 800,
    modal: 1000,
    notification: 1100,
    tooltip: 1200
  },

  // Animation easing
  easing: {
    standard: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
  },

  // Animation durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  }
} as const;

// Layout component base classes
export const LAYOUT_CLASSES = {
  // Container utilities
  container: {
    fluid: 'w-full px-4 sm:px-6 lg:px-8',
    constrained: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8'
  },

  // Section utilities
  section: {
    base: 'py-16 lg:py-24',
    compact: 'py-8 lg:py-12',
    spacious: 'py-24 lg:py-32'
  },

  // Grid utilities
  grid: {
    base: 'grid gap-6 lg:gap-8',
    cols2: 'grid-cols-1 lg:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  },

  // Flex utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    column: 'flex flex-col',
    wrap: 'flex flex-wrap'
  }
} as const;

// Typography utilities
export const TYPOGRAPHY = {
  // Display text
  display: {
    hero: 'font-light tracking-wider',
    title: 'font-light tracking-wide',
    subtitle: 'font-normal tracking-wide'
  },

  // Body text
  body: {
    large: 'text-lg leading-relaxed',
    base: 'text-base leading-relaxed',
    small: 'text-sm leading-relaxed'
  },

  // UI text
  ui: {
    label: 'text-xs uppercase tracking-wider font-medium',
    button: 'text-sm uppercase tracking-wider font-medium',
    caption: 'text-xs leading-tight'
  }
} as const;

// Component styling utilities
export const COMPONENT_STYLES = {
  // Button styles
  button: {
    base: 'inline-block relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer',
    primary: 'bg-transparent text-white border-2 border-white hover:text-black before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-white before:transition-[left] before:duration-300 before:ease-in-out before:z-[-1] hover:before:left-0',
    secondary: 'bg-transparent text-black border-2 border-black hover:text-white before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-black before:transition-[left] before:duration-300 before:ease-in-out before:z-[-1] hover:before:left-0'
  },

  // Link styles
  link: {
    base: 'text-white no-underline transition-all duration-300 ease-in-out',
    underline: 'relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full',
    subtle: 'text-white/70 hover:text-white transition-colors duration-300 ease-in-out'
  },

  // Card styles
  card: {
    base: 'bg-white/[0.02] border border-white/10 backdrop-blur-sm',
    hover: 'hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 ease-in-out'
  },

  // Form styles
  form: {
    input: 'w-full bg-transparent border-b border-white/20 text-white transition-all duration-300 ease-in-out focus:outline-none focus:border-white',
    label: 'absolute left-0 text-white/50 pointer-events-none transition-all duration-300 ease-in-out'
  }
} as const;

// Animation utilities
export const ANIMATIONS = {
  // Fade animations
  fadeIn: 'opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]',
  fadeInUp: 'opacity-0 translate-y-4 animate-[fadeInUp_0.6s_ease-out_forwards]',
  fadeInDown: 'opacity-0 -translate-y-4 animate-[fadeInDown_0.6s_ease-out_forwards]',

  // Scale animations
  scaleIn: 'scale-95 opacity-0 animate-[scaleIn_0.3s_ease-out_forwards]',
  scaleOut: 'scale-105 opacity-100 animate-[scaleOut_0.3s_ease-in_forwards]',

  // Slide animations
  slideInLeft: 'opacity-0 -translate-x-4 animate-[slideInLeft_0.4s_ease-out_forwards]',
  slideInRight: 'opacity-0 translate-x-4 animate-[slideInRight_0.4s_ease-out_forwards]',

  // Stagger utilities
  stagger: {
    delay1: '[animation-delay:0.1s]',
    delay2: '[animation-delay:0.2s]',
    delay3: '[animation-delay:0.3s]',
    delay4: '[animation-delay:0.4s]',
    delay5: '[animation-delay:0.5s]'
  }
} as const;

// Responsive utilities
export const RESPONSIVE = {
  // Hide/show utilities
  hide: {
    mobile: 'hidden md:block',
    tablet: 'hidden lg:block',
    desktop: 'block lg:hidden'
  },
  
  // Text sizing
  text: {
    responsive: 'text-sm md:text-base lg:text-lg',
    heading: 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
    display: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
  },

  // Spacing
  padding: {
    section: 'px-4 sm:px-6 lg:px-8',
    container: 'py-8 md:py-12 lg:py-16'
  }
} as const;

// Layout component types
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface ContainerProps extends LayoutProps {
  size?: 'fluid' | 'constrained' | 'narrow' | 'wide';
}

export interface SectionProps extends LayoutProps {
  spacing?: 'compact' | 'base' | 'spacious';
}

// Utility functions
export const layoutUtils = {
  // Combine classes with base classes
  combineClasses: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  },

  // Get responsive breakpoint
  getBreakpoint: (size: keyof typeof DESIGN_TOKENS.breakpoints): string => {
    return DESIGN_TOKENS.breakpoints[size];
  },

  // Generate responsive class
  responsive: (base: string, breakpoints: Record<string, string>): string => {
    const classes = [base];
    Object.entries(breakpoints).forEach(([bp, value]) => {
      classes.push(`${bp}:${value}`);
    });
    return classes.join(' ');
  }
};

// Export commonly used combinations
export const COMMON_CLASSES = {
  // Page layouts
  page: layoutUtils.combineClasses(
    'min-h-screen',
    'bg-black',
    'text-white',
    'overflow-x-hidden'
  ),

  // Hero sections
  hero: layoutUtils.combineClasses(
    LAYOUT_CLASSES.section.spacious,
    LAYOUT_CLASSES.flex.center,
    'min-h-screen',
    'text-center',
    'relative',
    'overflow-hidden'
  ),

  // Content sections
  content: layoutUtils.combineClasses(
    LAYOUT_CLASSES.section.base,
    LAYOUT_CLASSES.container.constrained
  ),

  // Navigation
  nav: layoutUtils.combineClasses(
    'fixed',
    'top-0',
    'left-0',
    'w-full',
    `z-[${DESIGN_TOKENS.zIndex.fixed}]`,
    'transition-all',
    'duration-300',
    'ease-in-out'
  )
} as const;