'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Link from 'next/link';
import { GSAPAnimations, staggerContainer, staggerItem, createTimeline } from '@/lib/animations';
import EditableVideo from '@/components/admin/EditableVideo';
import useContentStore from '@/store/useContentStore';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const { heroVideo, setHeroVideo } = useContentStore();
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // GSAP animations
      if (textRef.current) {
        const tl = createTimeline();
        
        tl.fromTo('.hero-title', 
          { 
            opacity: 0, 
            y: 100,
            clipPath: 'inset(0 0 100% 0)'
          },
          { 
            opacity: 1, 
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.2
          }
        )
        .fromTo('.hero-subtitle',
          { 
            opacity: 0, 
            y: 50 
          },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          }, 
          '-=0.6'
        )
        .fromTo('.hero-description',
          { 
            opacity: 0, 
            y: 30 
          },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, 
          '-=0.4'
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for the main title
  useEffect(() => {
    if (isLoaded) {
      const titleElement = document.querySelector('.typewriter-text');
      if (titleElement) {
        GSAPAnimations.typewriterEffect(titleElement, {
          text: 'REDUX',
          speed: 0.2,
          delay: 0.5
        });
      }
    }
  }, [isLoaded]);

  return (
    <motion.section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Background Video with Parallax */}
      <motion.div 
        ref={videoRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-800 ${isVideoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ y, scale }}
      >
        <EditableVideo
          src={heroVideo || '/video/main.mp4.mp4'}
          className="absolute inset-0 w-full h-full object-cover"
          onUpdate={setHeroVideo}
          category="hero"
          autoPlay
          muted
          loop
        />
      </motion.div>
      
      {/* Video Controls */}
      {isVideoPlaying && (
        <button
          className="absolute top-10 right-10 z-30 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110"
          onClick={() => setIsVideoPlaying(false)}
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}
      
      {!isVideoPlaying && (
        <button
          className="absolute top-10 right-10 z-30 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110"
          onClick={() => setIsVideoPlaying(true)}
        >
          <Play className="w-6 h-6 text-white ml-1" />
        </button>
      )}
      
      {/* Dynamic Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{ opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />
      </motion.div>
      
      {/* Content Container */}
      <motion.div 
        ref={textRef}
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Main Title with advanced animations */}
        <div className="mb-8 overflow-hidden">
          <motion.h1 
            className="hero-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black text-white leading-none"
            variants={staggerItem}
          >
            <span className="typewriter-text block"></span>
          </motion.h1>
          
          {/* Subtitle with mask reveal */}
          <motion.div 
            className="hero-subtitle mt-4 overflow-hidden"
            variants={staggerItem}
          >
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-[0.3em] uppercase"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block bg-black/40 backdrop-blur-sm px-4 py-2 rounded text-white">
                THE ROOM OF <span className="text-purple-400">[</span>  <span className="text-purple-400">]</span>
              </span>
            </motion.p>
          </motion.div>
        </div>
        
        {/* Description */}
        <motion.div 
          className="hero-description mb-12 max-w-2xl mx-auto"
          variants={staggerItem}
        >
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            Six visionary designers exploring the boundaries of fashion, art, and digital expression.
          </motion.p>
        </motion.div>
        
        {/* CTA Buttons with magnetic effect */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8 }}
        >
          <Link href="/about">
            <motion.button
              className="magnetic-btn group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-full overflow-hidden text-sm sm:text-base w-full sm:w-auto uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                GSAPAnimations.magneticEffect(e.currentTarget, {
                  strength: 0.5,
                  distance: 80
                });
              }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Discover Redux
              </span>
            </motion.button>
          </Link>
          
          <Link href="/exhibitions">
            <motion.button
              className="magnetic-btn group relative px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-full overflow-hidden backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                GSAPAnimations.magneticEffect(e.currentTarget, {
                  strength: 0.3,
                  distance: 60
                });
              }}
            >
              <motion.span
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                initial={false}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">View Exhibitions</span>
            </motion.button>
          </Link>
        </motion.div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-60"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-5 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }} />
      </div>
      
      {/* Corner decorations */}
      <motion.div
        className="hidden sm:block absolute top-4 sm:top-8 left-4 sm:left-8 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-t-2 border-white opacity-60 z-20"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 3 }}
      />
      <motion.div
        className="hidden sm:block absolute top-4 sm:top-8 right-4 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-t-2 border-white opacity-60 z-20"
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 3.2 }}
      />
      <motion.div
        className="hidden sm:block absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-b-2 border-white opacity-60 z-20"
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 3.4 }}
      />
      <motion.div
        className="hidden sm:block absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-b-2 border-white opacity-60 z-20"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 3.6 }}
      />
    </motion.section>
  );
}