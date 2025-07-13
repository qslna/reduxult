'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/utils/cn';

interface CursorState {
  x: number;
  y: number;
  isPointer: boolean;
  isHidden: boolean;
}

export default function CursorFollower() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isPointer: false,
    isHidden: false,
  });
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursor(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const handleMouseEnter = () => {
      setCursor(prev => ({ ...prev, isHidden: false }));
    };

    const handleMouseLeave = () => {
      setCursor(prev => ({ ...prev, isHidden: true }));
    };

    const handlePointerEnter = () => {
      setCursor(prev => ({ ...prev, isPointer: true }));
    };

    const handlePointerLeave = () => {
      setCursor(prev => ({ ...prev, isPointer: false }));
    };

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add pointer detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handlePointerEnter);
      el.addEventListener('mouseleave', handlePointerLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handlePointerEnter);
        el.removeEventListener('mouseleave', handlePointerLeave);
      });
    };
  }, []);

  // Don't show on mobile devices
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile || cursor.isHidden) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={cn(
          'fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference',
          currentTheme && `theme-${currentTheme}`
        )}
        animate={{
          x: cursor.x - 4,
          y: cursor.y - 4,
          scale: cursor.isPointer ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>

      {/* Outer cursor ring */}
      <motion.div
        className={cn(
          'fixed top-0 left-0 pointer-events-none z-[9998] border border-white/30 rounded-full',
          currentTheme && `theme-${currentTheme}`
        )}
        animate={{
          x: cursor.x - 16,
          y: cursor.y - 16,
          scale: cursor.isPointer ? 1.5 : 1,
          opacity: cursor.isPointer ? 0.8 : 0.4,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.8,
        }}
      >
        <div className="w-8 h-8" />
      </motion.div>

      {/* Trailing particles for theme accent */}
      {currentTheme && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          animate={{
            x: cursor.x - 2,
            y: cursor.y - 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 10,
            mass: 1,
          }}
        >
          <div 
            className={cn(
              'w-1 h-1 rounded-full opacity-60',
              currentTheme === 'leetaehyeon' && 'bg-red-500',
              currentTheme === 'kimbomin' && 'bg-yellow-500',
              currentTheme === 'parkparang' && 'bg-green-500'
            )}
          />
        </motion.div>
      )}
    </>
  );
}