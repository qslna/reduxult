'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Phase 2.3: Revolutionary Page Transition & Interaction System
 * - Advanced route-specific transitions
 * - Loading states with brand consistency
 * - Scroll-based animations
 * - Micro-interactions
 * - 2025 fashion trend styling
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  
  // Detect route changes for loading states
  useEffect(() => {
    if (previousPath && previousPath !== pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  // Get transition variant based on route
  const getTransitionVariant = (currentPath: string, prevPath: string | null): string => {
    // Home page gets special treatment
    if (currentPath === '/') return 'fadeScale';
    
    // Designer pages get slide transitions
    if (currentPath.includes('/designers/')) return 'slideUp';
    
    // About pages get rotation effect
    if (currentPath.includes('/about/')) return 'rotateSlide';
    
    // Exhibition pages get creative transition
    if (currentPath.includes('/exhibitions')) return 'morphTransition';
    
    // Admin pages get technical transition
    if (currentPath.includes('/admin')) return 'glitchTransition';
    
    // Default sophisticated transition
    return 'sophisticatedFade';
  };

  const transitionVariant = getTransitionVariant(pathname, previousPath);

  // Advanced transition variants
  const pageVariants: Record<string, Variants> = {
    fadeScale: {
      initial: { 
        opacity: 0, 
        scale: 0.95,
        filter: 'blur(10px)'
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1]
        }
      },
      exit: { 
        opacity: 0, 
        scale: 1.05,
        filter: 'blur(5px)',
        transition: {
          duration: 0.4,
          ease: 'easeInOut'
        }
      }
    },
    
    slideUp: {
      initial: { 
        opacity: 0, 
        y: 100,
        clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
      },
      animate: { 
        opacity: 1, 
        y: 0,
        clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
        transition: {
          duration: 0.9,
          ease: [0.25, 0.8, 0.25, 1],
          clipPath: { delay: 0.1 }
        }
      },
      exit: { 
        opacity: 0, 
        y: -50,
        clipPath: 'polygon(0 0%, 100% 0%, 100% 0%, 0 0%)',
        transition: {
          duration: 0.5,
          ease: 'easeInOut'
        }
      }
    },
    
    rotateSlide: {
      initial: { 
        opacity: 0, 
        rotateX: 15,
        y: 50,
        transformPerspective: 1000
      },
      animate: { 
        opacity: 1, 
        rotateX: 0,
        y: 0,
        transition: {
          duration: 0.7,
          ease: [0.25, 0.8, 0.25, 1]
        }
      },
      exit: { 
        opacity: 0, 
        rotateX: -10,
        y: -30,
        transition: {
          duration: 0.4,
          ease: 'easeInOut'
        }
      }
    },
    
    morphTransition: {
      initial: { 
        opacity: 0,
        borderRadius: '50%',
        scale: 0.1,
        rotate: 180
      },
      animate: { 
        opacity: 1,
        borderRadius: '0%',
        scale: 1,
        rotate: 0,
        transition: {
          duration: 1.0,
          ease: [0.25, 0.8, 0.25, 1],
          borderRadius: { delay: 0.2 },
          rotate: { delay: 0.1 }
        }
      },
      exit: { 
        opacity: 0,
        borderRadius: '50%',
        scale: 0.1,
        rotate: -90,
        transition: {
          duration: 0.6,
          ease: 'easeInOut'
        }
      }
    },
    
    glitchTransition: {
      initial: { 
        opacity: 0,
        x: 20,
        skewX: 5,
        filter: 'hue-rotate(90deg) contrast(1.2)'
      },
      animate: { 
        opacity: 1,
        x: 0,
        skewX: 0,
        filter: 'hue-rotate(0deg) contrast(1)',
        transition: {
          duration: 0.6,
          ease: 'easeOut',
          filter: { delay: 0.1 }
        }
      },
      exit: { 
        opacity: 0,
        x: -20,
        skewX: -5,
        filter: 'hue-rotate(-90deg) contrast(0.8)',
        transition: {
          duration: 0.4,
          ease: 'easeInOut'
        }
      }
    },
    
    sophisticatedFade: {
      initial: { 
        opacity: 0,
        y: 30,
        scale: 0.98,
        filter: 'blur(8px) brightness(0.9)'
      },
      animate: { 
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        transition: {
          duration: 0.8,
          ease: [0.25, 0.8, 0.25, 1],
          scale: { delay: 0.1 },
          filter: { delay: 0.2 }
        }
      },
      exit: { 
        opacity: 0,
        y: -20,
        scale: 1.02,
        filter: 'blur(5px) brightness(1.1)',
        transition: {
          duration: 0.5,
          ease: 'easeInOut'
        }
      }
    }
  };

  return (
    <>
      {/* Advanced Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="redux-page-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(26,26,26,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            {/* Loading Animation */}
            <div className="loading-animation" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '25px'
            }}>
              {/* Animated Redux Logo */}
              <motion.div
                className="loading-logo"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  color: 'var(--primary-white)',
                  letterSpacing: '0.1em',
                  textShadow: '0 0 30px rgba(183,175,163,0.5)'
                }}
              >
                REDUX
              </motion.div>
              
              {/* Loading Bar */}
              <div style={{
                width: '200px',
                height: '2px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '1px',
                overflow: 'hidden'
              }}>
                <motion.div
                  animate={{
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, var(--accent-mocha), transparent)',
                    borderRadius: '1px'
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Transition Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="redux-page-container"
          variants={pageVariants[transitionVariant]}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/**
 * Scroll-based Animation Hook
 * Provides intersection observer based animations
 */
export function useScrollAnimation() {
  const [inView, setInView] = useState(false);
  
  const scrollVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.8, 0.25, 1]
      }
    }
  };
  
  return { inView, setInView, scrollVariants };
}

/**
 * Micro-interaction Component
 * For hover effects and small interactions
 */
export function MicroInteraction({ 
  children, 
  type = 'hover',
  intensity = 'medium'
}: {
  children: ReactNode;
  type?: 'hover' | 'tap' | 'focus';
  intensity?: 'subtle' | 'medium' | 'strong';
}) {
  const intensityMap = {
    subtle: { scale: 1.02, y: -2 },
    medium: { scale: 1.05, y: -5 },
    strong: { scale: 1.08, y: -8 }
  };
  
  const effects = intensityMap[intensity];
  
  return (
    <motion.div
      whileHover={type === 'hover' ? effects : undefined}
      whileTap={type === 'tap' ? { scale: 0.95 } : undefined}
      whileFocus={type === 'focus' ? effects : undefined}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.8, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Animation Container
 * For animating multiple children with delays
 */
export function StaggerContainer({ 
  children, 
  delay = 0.1 
}: { 
  children: ReactNode; 
  delay?: number; 
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.2
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/**
 * Page Loading States for Specific Routes
 */
export function RouteLoadingState({ route }: { route: string }) {
  const getLoadingMessage = (routePath: string): string => {
    if (routePath.includes('/designers')) return 'Loading Designer Portfolio...';
    if (routePath.includes('/about')) return 'Exploring REDUX Story...';
    if (routePath.includes('/exhibitions')) return 'Preparing Exhibition Space...';
    if (routePath.includes('/admin')) return 'Accessing Admin Panel...';
    return 'Loading Experience...';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="route-loading"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div style={{
        textAlign: 'center',
        color: 'var(--primary-white)'
      }}>
        <motion.h2
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            fontSize: '1.2rem',
            fontWeight: 300,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          {getLoadingMessage(route)}
        </motion.h2>
      </div>
    </motion.div>
  );
}