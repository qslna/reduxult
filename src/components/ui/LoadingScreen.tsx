'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { LoadingScreenProps } from '@/types';

export default function LoadingScreen({ 
  isLoading, 
  progress = 0, 
  message = 'Loading...' 
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
            <motion.div 
              className="absolute inset-0 opacity-30"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
                `,
                backgroundSize: '100% 100%',
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            {/* Main Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  REDUX
                </span>
                <span className="text-white/60">66</span>
              </h1>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              {/* Progress Bar */}
              <div className="w-64 mx-auto mb-6">
                <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-white via-gray-300 to-white rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${displayProgress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-32, 256] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
                
                {/* Progress Text */}
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>{message}</span>
                  <span>{displayProgress}%</span>
                </div>
              </div>

              {/* Spinning Dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-400 text-sm tracking-wide"
            >
              세계 최고 수준의 디자이너 포트폴리오
            </motion.p>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
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