'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Initial Loading Screen Component
 * Prevents FOUC (Flash of Unstyled Content) by showing a loading screen
 * until fonts and critical CSS are loaded
 */
export default function InitialLoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const startLoadingSequence = () => {
      // Simulate progressive loading
      let currentProgress = 0;
      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 15 + 5; // Random progress between 5-20
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressTimer);
        }
        setProgress(currentProgress);
      }, 100);

      // Wait for fonts and critical resources to load
      const hideLoadingScreen = () => {
        // Check if fonts are loaded
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            // Add fonts-loaded class to body to show content
            document.body.classList.add('fonts-loaded');
            // Additional delay to ensure smooth transition
            hideTimer = setTimeout(() => {
              setProgress(100);
              setTimeout(() => setIsLoading(false), 300);
            }, 800);
          });
        } else {
          // Fallback for browsers without font loading API
          document.body.classList.add('fonts-loaded');
          hideTimer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => setIsLoading(false), 300);
          }, 1200);
        }
      };

      // Start font loading check after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideLoadingScreen);
      } else {
        hideLoadingScreen();
      }
    };

    startLoadingSequence();

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
      document.removeEventListener('DOMContentLoaded', startLoadingSequence);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.8, 
              ease: [0.25, 0.8, 0.25, 1] 
            }
          }}
          className="fixed inset-0 z-[10001] bg-black flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
          }}
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg, 
                transparent, 
                transparent 2px, 
                rgba(255,255,255,0.1) 2px, 
                rgba(255,255,255,0.1) 4px
              )`
            }}
          />
          
          {/* Loading Content */}
          <div className="relative z-10 text-center">
            {/* REDUX Logo with Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8,
                  ease: [0.25, 0.8, 0.25, 1]
                }
              }}
              className="mb-8"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 20px rgba(183,175,163,0.3)',
                    '0 0 40px rgba(183,175,163,0.5)',
                    '0 0 20px rgba(183,175,163,0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#ffffff',
                  lineHeight: 1
                }}
              >
                REDUX
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 0.7, 
                  y: 0,
                  transition: { 
                    delay: 0.3,
                    duration: 0.6
                  }
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                  fontWeight: 300,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginTop: '0.5rem'
                }}
              >
                Fashion Designer Collective
              </motion.p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: 1, 
                scaleX: 1,
                transition: { 
                  delay: 0.5,
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }}
              className="relative mx-auto"
              style={{ width: 'min(300px, 80vw)' }}
            >
              {/* Progress Bar Background */}
              <div 
                className="h-0.5 bg-white/10 rounded-full overflow-hidden"
              >
                {/* Progress Fill */}
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #B7AFA3, #D4CCC5, #B7AFA3)',
                    width: `${progress}%`,
                    boxShadow: '0 0 10px rgba(183,175,163,0.5)'
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ 
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                />
              </div>
              
              {/* Progress Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 0.5,
                  transition: { delay: 0.8 }
                }}
                className="text-center mt-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 300,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#ffffff'
                }}
              >
                Loading Experience... {Math.round(progress)}%
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.7
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}