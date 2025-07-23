'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface ReduxLoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
  showProgress?: boolean;
}

const ReduxLoadingScreen: React.FC<ReduxLoadingScreenProps> = ({
  onComplete,
  duration = 3000,
  showProgress = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    'Initializing REDUX...',
    'Loading gallery assets...',
    'Preparing CMS interface...',
    'Finalizing experience...'
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;
    let currentStepIndex = 0;

    // Animate text reveal
    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        { 
          opacity: 0,
          y: 50,
          rotationX: -90,
          transformOrigin: '50% 50% -20px'
        },
        { 
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.5
        }
      );

      // Animate underline
      gsap.fromTo(textRef.current.querySelector('.underline'),
        { scaleX: 0 },
        { 
          scaleX: 1, 
          duration: 1.2, 
          delay: 1.5,
          ease: 'power2.out'
        }
      );
    }

    // Progress animation
    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 3 + 1, 100);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 500);
          }
          
          return newProgress;
        });
      }, 80);

      // Step progression
      const stepDuration = duration / loadingSteps.length;
      const updateStep = () => {
        if (currentStepIndex < loadingSteps.length) {
          setCurrentStep(loadingSteps[currentStepIndex]);
          currentStepIndex++;
          stepTimeout = setTimeout(updateStep, stepDuration);
        }
      };
      updateStep();
    } else {
      // Simple timed completion
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (stepTimeout) clearTimeout(stepTimeout);
    };
  }, [duration, onComplete, showProgress]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'power2.inOut' }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px'
            }}
          />
        </div>

        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center">
          {/* Main REDUX text */}
          <div ref={textRef} className="relative mb-8">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight">
              {'REDUX'.split('').map((char, index) => (
                <span 
                  key={index}
                  className="char inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
            </h1>
            
            {/* Animated underline */}
            <div className="underline absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transform origin-left" />
          </div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-gray-300 mb-12"
          >
            Fashion Designer Collective
          </motion.p>

          {/* Progress section */}
          {showProgress && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="w-full max-w-md mx-auto px-4"
            >
              {/* Progress bar */}
              <div className="relative mb-4">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    ref={progressRef}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                  />
                </div>
                
                {/* Progress percentage */}
                <div className="absolute -top-6 right-0 text-xs text-gray-400 font-mono">
                  {Math.round(progress)}%
                </div>
              </div>

              {/* Loading step */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-400 min-h-[20px]"
                >
                  {currentStep}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${10 + (i * 7)}%`,
                  top: `${20 + (i * 5)}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + (i * 0.3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Corner decorations */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white opacity-40"
          />
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white opacity-40"
          />
          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3.4, duration: 0.8 }}
            className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white opacity-40"
          />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 3.6, duration: 0.8 }}
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white opacity-40"
          />
        </div>

        {/* Exit animation overlay */}
        <motion.div
          initial={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: 'power2.inOut' }}
          className="absolute inset-0 bg-black origin-top z-20"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ReduxLoadingScreen;