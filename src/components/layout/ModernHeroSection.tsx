'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
// import FloatingCrystal from '@/components/3d/FloatingCrystal';
// import ParticleField from '@/components/3d/ParticleField';
import Link from 'next/link';

export default function ModernHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Parallax transforms
  const titleY = useTransform(scrollY, [0, 500], [0, -100]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute w-96 h-96 opacity-20 bg-accent-mocha/20 rounded-full blur-3xl"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <motion.div style={{ y: titleY }}>
          <motion.h1 
            className="text-6xl sm:text-8xl lg:text-9xl font-display font-black tracking-tighter mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white animate-gradient">
              REDUX
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-body font-light mt-4 text-gray-400">
              COLLECTIVE
            </span>
          </motion.h1>
        </motion.div>
        
        <motion.div style={{ y: subtitleY }}>
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            실험적 패션과 비주얼 아트의 경계를 탐구하는
            <br />
            한국 디자이너 6인 컬렉티브
          </motion.p>
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/designers">
            <motion.button
              className="group relative px-8 py-4 bg-white text-black font-medium rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">디자이너 만나기</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-mocha to-accent-warm"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
          
          <Link href="/exhibitions">
            <motion.button
              className="px-8 py-4 border border-white/20 text-white font-medium rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              전시 둘러보기
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm font-mono tracking-wider">SCROLL</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-accent-mocha/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-warm/10 rounded-full blur-3xl" />
    </section>
  );
}