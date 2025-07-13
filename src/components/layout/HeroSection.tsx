'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, Play } from 'lucide-react';
import { cn } from '@/utils/cn';
import { fadeIn, staggerContainer } from '@/utils/animations';
import StackGallery from '@/components/gallery/StackGallery';
import { GalleryImage } from '@/types';

// Mock data for hero gallery
const heroImages: GalleryImage[] = [
  {
    id: '1',
    url: '/designers/leetaehyeon/portfolio/21.png',
    name: 'Minimalist Vision',
    category: 'Portfolio',
    designer: 'leetaehyeon',
    createdAt: new Date(),
  },
  {
    id: '2', 
    url: '/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 001.jpeg',
    name: 'Editorial Grace',
    category: 'Fashion',
    designer: 'kimbomin',
    createdAt: new Date(),
  },
  {
    id: '3',
    url: '/about/visual-art/Metamorphosis.png',
    name: 'Digital Metamorphosis',
    category: 'Visual Art',
    designer: 'parkparang',
    createdAt: new Date(),
  },
  {
    id: '4',
    url: '/about/visual-art/Color Theory.png',
    name: 'Color Theory',
    category: 'Experimental',
    designer: 'collective',
    createdAt: new Date(),
  },
  {
    id: '5',
    url: '/about/visual-art/Shadow Play.png',
    name: 'Shadow Play',
    category: 'Installation',
    designer: 'collective',
    createdAt: new Date(),
  },
];

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroTexts = [
    { main: 'REDUX', sub: '한국 패션 디자이너 6인 컬렉티브' },
    { main: 'CREATIVE', sub: '실험적이고 혁신적인 패션과 비주얼 아트' },
    { main: 'COLLECTIVE', sub: '경계를 넘나드는 창작 활동' },
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Video/Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        
        {/* Animated background patterns */}
        <motion.div 
          className="absolute inset-0 opacity-20"
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

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.8, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Text content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            className="text-center lg:text-left"
          >
            {/* Main title with cycling text */}
            <motion.div
              variants={fadeIn}
              className="mb-6 h-24 lg:h-32 flex items-center justify-center lg:justify-start"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentText}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                >
                  <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    {heroTexts[currentText].main}
                  </span>
                </motion.h1>
              </AnimatePresence>
            </motion.div>

            {/* Subtitle with cycling text */}
            <motion.div
              variants={fadeIn}
              className="mb-8 h-16 flex items-center justify-center lg:justify-start"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${currentText}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed"
                >
                  {heroTexts[currentText].sub}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  EXPLORE WORKS
                </motion.button>
              </Link>
              
              <Link href="/designers">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
                >
                  <Play size={20} />
                  MEET DESIGNERS
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeIn}
              className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left"
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">6</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Designers</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Projects</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">5</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">Categories</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Stack Gallery */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate={isLoaded ? "animate" : "initial"}
            className="flex justify-center lg:justify-end"
          >
            <StackGallery 
              images={heroImages}
              className="w-full max-w-sm"
              maxItems={5}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-sm font-mono mb-2">SCROLL</span>
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}