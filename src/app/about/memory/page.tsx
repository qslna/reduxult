'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Clock, Heart, Camera } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import IntegratedGallery from '@/components/gallery/IntegratedGallery';


const memoryCategories = [
  {
    icon: Clock,
    title: 'TIME',
    description: '시간의 흐름과 변화하는 순간들을 포착하여 영원히 간직할 수 있는 형태로 재해석합니다.',
  },
  {
    icon: Heart,
    title: 'EMOTION',
    description: '감정의 깊이와 개인적 경험을 시각적 언어로 번역하여 공감과 연결을 만들어냅니다.',
  },
  {
    icon: Camera,
    title: 'MOMENT',
    description: '일상의 소중한 순간들을 예술적 관점에서 재구성하여 새로운 의미를 부여합니다.',
  },
];

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-900/20 via-black to-orange-900/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Text content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
              >
                <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  MEMORY
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl lg:text-2xl text-amber-200 mb-8 leading-relaxed"
              >
                시간과 기억의 보존
                <br className="hidden md:block" />
                Preserving Moments in Time
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-400 leading-relaxed max-w-2xl"
              >
                기억은 시간을 초월하는 가장 소중한 자산입니다. 
                REDUX는 개인적이고 집단적인 기억들을 디자인을 통해 보존하고 
                새로운 세대에게 전달하는 방법을 탐구합니다.
              </motion.p>
            </motion.div>

            {/* Right side - Stack Gallery */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="flex justify-center lg:justify-end"
            >
              <IntegratedGallery 
                folder="memory"
                layout="stack"
                className="w-full max-w-sm"
                title="Memory Gallery"
                maxItems={5}
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-amber-200/60 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono mb-2">SCROLL</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Memory Categories */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                MEMORY DIMENSIONS
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {memoryCategories.map((category, index) => (
              <motion.div
                key={category.title}
                variants={fadeIn}
                className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <category.icon size={32} className="text-amber-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-amber-200 mb-6 tracking-wide">
                  {category.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-amber-200">
              기억의 디자인 철학
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/30 rounded-lg p-6 border border-amber-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">과거의 보존</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  소중한 순간들을 잃지 않도록 디지털과 아날로그 매체를 통해 
                  영구적으로 보존하는 방법을 연구합니다.
                </p>
              </div>
              
              <div className="bg-gray-900/30 rounded-lg p-6 border border-amber-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">현재의 기록</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  지금 이 순간의 소중함을 인식하고 의미 있는 방식으로 
                  기록하여 미래의 기억으로 만들어갑니다.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Memory 프로젝트 참여하기
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}