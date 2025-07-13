'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingParticles from '@/components/ui/FloatingParticles';

export default function HeroSection() {

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Floating Particles */}
      <FloatingParticles count={40} className="opacity-40" />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/hero-background/background.png)',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          {/* Main Title */}
          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-none"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(255,255,255,0.05)',
              mixBlendMode: 'difference',
            }}
          >
            {'REDUX'.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="relative inline-block px-6 py-3 glass rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="font-sans text-base md:text-lg font-medium text-white uppercase tracking-widest">
              THE ROOM OF{' '}
              <span className="text-accent-mocha font-light">
                [<span className="inline-block w-4" />]
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link href="/about">
              <motion.div
                className="group relative px-8 py-4 border border-white text-white text-sm font-light uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Discover Redux</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            </Link>

            <Link href="/exhibitions">
              <motion.div
                className="group relative px-8 py-4 glass text-white text-sm font-light uppercase tracking-wider transition-all duration-300 hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Exhibitions
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </motion.div>
        <p className="text-xs font-light uppercase tracking-wide mt-3">Scroll Down</p>
      </motion.div>
    </section>
  );
}