import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// GSAP configuration for the project
export const setupGSAP = () => {
  if (typeof window === 'undefined') return;

  // Set GSAP defaults matching the HTML version
  gsap.defaults({
    duration: 1,
    ease: 'power2.out'
  });

  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    markers: false,
    scroller: window
  });
};

// Common GSAP animations used throughout the project
export const animations = {
  // Fade in from bottom animation
  fadeInUp: (element: string | Element, options?: gsap.TweenVars) => {
    return gsap.fromTo(element, 
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        ...options
      }
    );
  },

  // Fade in with stagger for multiple elements
  fadeInUpStagger: (elements: string | Element[], options?: gsap.TweenVars) => {
    return gsap.fromTo(elements,
      {
        y: 60,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        ...options
      }
    );
  },

  // Scale in animation
  scaleIn: (element: string | Element, options?: gsap.TweenVars) => {
    return gsap.fromTo(element,
      {
        scale: 0.8,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        ...options
      }
    );
  },

  // Timeline progress animation
  timelineProgress: (element: string | Element, options?: ScrollTrigger.Vars) => {
    return gsap.to(element, {
      height: '100%',
      scrollTrigger: {
        trigger: element,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        ...options
      }
    });
  },

  // Gallery item reveal animation
  revealGalleryItems: (items: string | Element[], options?: gsap.TweenVars) => {
    return gsap.fromTo(items,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: items,
          start: 'top 80%',
          end: 'bottom 20%'
        },
        ...options
      }
    );
  },

  // Hero text reveal animation
  revealHeroText: (element: string | Element, options?: gsap.TweenVars) => {
    return gsap.fromTo(element,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        ...options
      }
    );
  },

  // Contact form info animation (from the original contact page)
  contactInfoAnimation: (elements: string | Element[], trigger: string | Element) => {
    return gsap.from(elements, {
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: trigger,
        start: 'top 80%'
      }
    });
  },

  // Contact form section animation
  contactFormAnimation: (element: string | Element) => {
    return gsap.from(element, {
      x: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%'
      }
    });
  },

  // Exhibition items animation (from exhibitions page)
  exhibitionItemAnimation: (items: string | Element[]) => {
    gsap.utils.toArray(items).forEach((item: any, index: number) => {
      const visual = item.querySelector('.exhibition-visual');
      const info = item.querySelector('.exhibition-info');
      
      if (visual) {
        gsap.from(visual, {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%'
          }
        });
      }
      
      if (info) {
        gsap.from(info, {
          x: index % 2 === 0 ? 100 : -100,
          opacity: 0,
          duration: 1.5,
          delay: 0.2,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%'
          }
        });
      }
    });
  },

  // Values animation (from collective page)
  valuesAnimation: (items: string | Element[]) => {
    gsap.utils.toArray(items).forEach((item: any, i: number) => {
      gsap.from(item, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%'
        }
      });
    });
  },

  // Philosophy text animation (from collective page)
  philosophyAnimation: (texts: string | Element[]) => {
    gsap.utils.toArray(texts).forEach((text: any, i: number) => {
      gsap.from(text, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        scrollTrigger: {
          trigger: text,
          start: 'top 80%'
        }
      });
    });
  }
};

// Mobile check utility
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Initialize GSAP animations for a component
export const initGSAPAnimations = (animationCallback: () => void) => {
  if (typeof window === 'undefined') return;
  
  // Only run animations on desktop to match original HTML behavior
  if (!isMobile()) {
    setupGSAP();
    animationCallback();
  }
};

// Cleanup function for GSAP animations
export const cleanupGSAP = () => {
  if (typeof window === 'undefined') return;
  
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
};

// Export GSAP and ScrollTrigger for direct use when needed
export { gsap, ScrollTrigger };

// Type definitions for better TypeScript support
export interface GSAPAnimationOptions extends gsap.TweenVars {
  trigger?: string | Element;
  start?: string;
  end?: string;
  stagger?: number;
}

export interface ScrollTriggerOptions extends ScrollTrigger.Vars {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean;
}