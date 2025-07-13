'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Box, Zap, Eye } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import IntegratedGallery from '@/components/gallery/IntegratedGallery';


const installationConcepts = [
  {
    icon: Box,
    title: 'SPACE',
    description: '공간을 예술의 캔버스로 변화시켜 관객이 작품 속으로 들어가는 경험을 만듭니다.',
  },
  {
    icon: Zap,
    title: 'INTERACTION',
    description: '관객의 참여와 상호작용을 통해 완성되는 살아있는 예술 작품을 추구합니다.',
  },
  {
    icon: Eye,
    title: 'IMMERSION',
    description: '몰입적인 환경을 통해 일상에서 벗어난 새로운 감각적 경험을 제공합니다.',
  },
];

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900/20 via-black to-teal-900/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)
              `
            }}
            animate={{
              background: [
                `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 60% 60%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)`
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
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
                <span className="bg-gradient-to-r from-indigo-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                  INSTALLATION
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl lg:text-2xl text-blue-200 mb-8 leading-relaxed"
              >
                공간과 기술의 융합
                <br className="hidden md:block" />
                Space Meets Technology
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-400 leading-relaxed max-w-2xl"
              >
                REDUX는 설치 미술을 통해 공간을 예술의 캔버스로 변화시킵니다. 
                관객이 직접 참여하고 경험할 수 있는 몰입적인 환경을 만들어냅니다.
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
                folder="installation"
                layout="stack"
                className="w-full max-w-sm"
                title="Installation Gallery"
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
            className="flex flex-col items-center text-blue-200/60 hover:text-blue-200 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono mb-2">SCROLL</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Installation Concepts */}
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
              <span className="bg-gradient-to-r from-indigo-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                INSTALLATION CONCEPTS
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
            {installationConcepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                variants={fadeIn}
                className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <concept.icon size={32} className="text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-blue-200 mb-6 tracking-wide">
                  {concept.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {concept.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-blue-200">
              예술이 된 공간
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/30 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">참여형 예술</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  관객이 작품의 일부가 되어 완성되는 
                  살아있는 예술 경험을 제공합니다.
                </p>
              </div>
              
              <div className="bg-gray-900/30 rounded-lg p-6 border border-blue-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">공간의 재정의</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  기술과 예술의 융합을 통해 
                  공간 자체를 새로운 의미로 변화시킵니다.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Installation 프로젝트 제안하기
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}