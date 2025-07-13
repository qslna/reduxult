'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import VideoHeroSection from '@/components/layout/VideoHeroSection';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Lazy load heavy components for better performance
const AboutShowcase = dynamic(() => import('@/components/layout/AboutShowcase'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
});

const DesignersPreview = dynamic(() => import('@/components/layout/DesignersPreview'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
});

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen 
            isLoading={isLoading}
            progress={loadingProgress}
            message="창의적 비전을 로딩 중..."
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Hero Section */}
        <VideoHeroSection />

        {/* About Preview Section */}
        <section className="relative">
          <AboutShowcase />
        </section>

        {/* Designers Preview Section */}
        <section className="relative">
          <DesignersPreview />
        </section>

        {/* Featured Works Section */}
        <section className="relative py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  FEATURED WORKS
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                세계 최고 수준의 디자인 작품들을 만나보세요. 
                각 디자이너의 독창적인 비전과 혁신적인 접근법이 담긴 프로젝트들입니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                함께 만들어가는 디자인의 미래
              </h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                REDUX66에서 창의적 파트너십을 시작하세요. 
                혁신적인 아이디어와 최고의 디자인 퀄리티로 프로젝트를 성공으로 이끌어드립니다.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  프로젝트 문의하기
                </motion.a>
                
                <motion.a
                  href="/about"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
                >
                  더 알아보기
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
}