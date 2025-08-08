/**
 * Framer Motion Animation Library for Redux Portfolio
 * Replaces GSAP for better performance and smaller bundle size
 */

interface AnimationOptions {
  duration?: number;
  ease?: string | number[];
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  onStart?: () => void;
  [key: string]: unknown;
}

// Animation constants
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  extra_slow: 2.0,
};

export const ANIMATION_EASE = {
  default: [0.22, 1, 0.36, 1],
  power1: [0.25, 0.46, 0.45, 0.94],
  power2: [0.25, 0.46, 0.45, 0.94],
  power3: [0.215, 0.610, 0.355, 1.000],
  back: [0.175, 0.885, 0.32, 1.275],
  elastic: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.68, -0.55, 0.265, 1.55],
  expo: [0.19, 1, 0.22, 1],
  circ: [0.075, 0.82, 0.165, 1],
};

// Core Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.back }
};

export const slideInUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: ANIMATION_DURATION.slow, ease: ANIMATION_EASE.default }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

// Advanced animations
export const textReveal = {
  initial: { y: '100%' },
  animate: { y: 0 },
  transition: { duration: ANIMATION_DURATION.slow, ease: ANIMATION_EASE.power3 }
};

export const imageReveal = {
  initial: { scale: 1.1, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: ANIMATION_DURATION.slow, ease: ANIMATION_EASE.default }
};

export const maskReveal = {
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 1.0, ease: ANIMATION_EASE.default }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.default }
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.default }
};

// Enhanced animation variants for Redux-specific use cases
export const heroAnimation = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.extra_slow, ease: ANIMATION_EASE.power3 }
};

export const galleryItemAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.power2 }
};

export const designerCardAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  whileHover: { scale: 1.05 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.back }
};

export const navigationAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.power2 }
};

export const mobileMenuAnimation = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '100%' },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.default }
};

// Contact page animations
export const contactFormAnimation = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.power2 }
};

export const contactInfoAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.power2, staggerChildren: 0.1 }
};

// Exhibition page animations
export const exhibitionItemAnimation = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.slow, ease: ANIMATION_EASE.power2 }
};

// About page animations
export const valuesAnimation = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.power2 }
};

export const philosophyAnimation = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.power2 }
};

// CMS animations
export const adminPanelAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.default }
};

export const uploadAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.power2 }
};

// Loading animations
export const spinAnimation = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.default }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
    scale: 1.02
  },
  transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.default }
};

// Utility functions for creating custom animations
export const createStaggeredAnimation = (items: number, baseDelay = 0) => ({
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: baseDelay,
    },
  },
});

export const createParallaxAnimation = (yOffset = -50) => ({
  initial: { y: 0 },
  animate: { y: yOffset },
  transition: { duration: 0, ease: "linear" }
});

// Animation presets for common use cases
export const animationPresets = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideInUp,
  textReveal,
  imageReveal,
  heroAnimation,
  galleryItemAnimation,
  designerCardAnimation,
  navigationAnimation,
  mobileMenuAnimation,
  contactFormAnimation,
  contactInfoAnimation,
  exhibitionItemAnimation,
  valuesAnimation,
  philosophyAnimation,
  adminPanelAnimation,
  uploadAnimation,
  spinAnimation,
  pulseAnimation,
  hoverScale,
  hoverGlow,
  pageTransition,
  modalTransition
};

// Export default animation for quick access
export default animationPresets;