import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Type definitions
interface AnimationOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number | {
    amount?: number;
    from?: number | "start" | "center" | "end" | "edges" | "random" | [number, number];
    each?: number;
    grid?: [number, number] | "auto";
    axis?: "x" | "y";
    ease?: string;
  };
  scrollTrigger?: ScrollTrigger.Vars;
  onComplete?: () => void;
  onStart?: () => void;
  [key: string]: unknown;
}

interface MagneticOptions {
  strength?: number;
  distance?: number;
}

interface TypewriterOptions {
  text?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

interface ScrollAnimationOptions extends AnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  markers?: boolean;
}

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation constants
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  extra_slow: 2.0,
};

export const ANIMATION_EASE = {
  power1: 'power1.out',
  power2: 'power2.out',
  power3: 'power3.out',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  bounce: 'bounce.out',
  expo: 'expo.out',
  circ: 'circ.out',
};

// Framer Motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const slideInUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
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
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// Advanced animations
export const textReveal = {
  initial: { y: '100%' },
  animate: { y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const imageReveal = {
  initial: { scale: 1.1, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
};

export const maskReveal = {
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const modalTransition = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
};

// GSAP Animation Functions
export class GSAPAnimations {
  static fadeIn(element: string | Element, options: AnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power2,
        ...options,
      }
    );
  }

  static fadeInUp(element: string | Element, options: AnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power3,
        ...options,
      }
    );
  }

  static slideInLeft(element: string | Element, options: AnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power3,
        ...options,
      }
    );
  }

  static slideInRight(element: string | Element, options: AnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power3,
        ...options,
      }
    );
  }

  static scaleIn(element: string | Element, options: AnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.back,
        ...options,
      }
    );
  }

  static textReveal(element: string | Element, options: AnimationOptions = {}) {
    const tl = gsap.timeline();
    
    tl.set(element, { overflow: 'hidden' })
      .fromTo(
        `${element} > *`,
        { y: '100%' },
        {
          y: 0,
          duration: ANIMATION_DURATION.slow,
          ease: ANIMATION_EASE.power3,
          stagger: 0.1,
          ...options,
        }
      );
    
    return tl;
  }

  static imageParallax(element: string | Element, options: ScrollAnimationOptions = {}) {
    return gsap.to(element, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        ...options.scrollTrigger,
      },
      ...options,
    });
  }

  static fadeInStagger(elements: string | Element[], options: AnimationOptions = {}) {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power2,
        stagger: 0.1,
        ...options,
      }
    );
  }

  static revealOnScroll(element: string | Element, options: ScrollAnimationOptions = {}) {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.power3,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          ...options.scrollTrigger,
        },
        ...options,
      }
    );
  }

  static horizontalScroll(container: string | Element, options: ScrollAnimationOptions = {}) {
    const sections = gsap.utils.toArray(`${container} > *`);
    
    return gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${(sections.length - 1) * window.innerWidth}`,
        ...options.scrollTrigger,
      },
      ...options,
    });
  }

  static magneticEffect(element: string | Element, options: MagneticOptions = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const strength = options.strength || 0.3;
    const distance = options.distance || 100;

    const onMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = mouseEvent.clientX - centerX;
      const deltaY = mouseEvent.clientY - centerY;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (dist < distance) {
        const factor = (distance - dist) / distance;
        gsap.to(el, {
          x: deltaX * strength * factor,
          y: deltaY * strength * factor,
          duration: 0.3,
          ease: ANIMATION_EASE.power2,
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: ANIMATION_EASE.elastic,
      });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }

  static morphingBackground(element: string | Element, options: AnimationOptions & { colors?: string[] } = {}) {
    const colors = options.colors || ['#000000', '#111111', '#222222'];
    
    return gsap.to(element, {
      backgroundColor: colors[1],
      duration: ANIMATION_DURATION.extra_slow,
      ease: ANIMATION_EASE.power1,
      repeat: -1,
      yoyo: true,
      ...options,
    });
  }

  static typewriterEffect(element: string | Element, options: TypewriterOptions = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    const text = options.text || el.textContent || '';
    const speed = options.speed || 0.05;
    
    el.textContent = '';
    
    const { delay } = options;
    
    return gsap.to(el, {
      duration: text.length * speed,
      ease: 'none',
      delay,
      onUpdate: function() {
        const progress = this.progress();
        const currentLength = Math.floor(progress * text.length);
        el.textContent = text.slice(0, currentLength);
      }
    });
  }

  static smoothScroll(options: { duration?: number; easing?: (t: number) => number; smooth?: boolean } = {}) {
    const LenisClass = (window as any).Lenis;
    if (!LenisClass) return;
    
    const lenis = new LenisClass({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      ...options,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return lenis;
  }

  static cursorFollow(options: { color?: string } = {}) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: ${options.color || '#ffffff'};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.2s ease;
    `;
    document.body.appendChild(cursor);

    const onMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      gsap.to(cursor, {
        x: mouseEvent.clientX - 10,
        y: mouseEvent.clientY - 10,
        duration: 0.1,
        ease: ANIMATION_EASE.power2,
      });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.2,
        ease: ANIMATION_EASE.back,
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
        ease: ANIMATION_EASE.back,
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      cursor.remove();
    };
  }
}

// Animation utilities
export const createTimeline = (options: gsap.TimelineVars = {}) => {
  return gsap.timeline(options);
};

export const killAllAnimations = () => {
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

// React hook for GSAP animations
export const useGSAP = (callback: () => void | (() => void)) => {
  if (typeof window === 'undefined') return;
  
  const cleanup = callback();
  
  return () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
    killAllAnimations();
  };
};