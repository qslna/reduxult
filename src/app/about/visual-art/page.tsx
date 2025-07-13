'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Palette, Lightbulb, Zap } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import IntegratedGallery from '@/components/gallery/IntegratedGallery';

const processSteps = [
  {
    number: '01',
    title: 'CONCEPT',
    description: '아이디어의 시작부터 컨셉 정립까지, 끊임없는 대화와 실험을 통해 우리만의 시각적 언어를 만듭니다.',
    icon: Lightbulb
  },
  {
    number: '02',
    title: 'CREATION',
    description: '다양한 매체와 기법을 활용하여 컨셉을 시각적으로 구현하고 새로운 표현의 가능성을 탐구합니다.',
    icon: Palette
  },
  {
    number: '03',
    title: 'CONNECTION',
    description: '작품을 통해 관객과 소통하고 감정적 연결을 만들어내며 기억에 남을 순간을 디자인합니다.',
    icon: Zap
  },
];

export default function VisualArtPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #fff 35px, #fff 70px)',
              width: '200%',
              height: '200%',
              top: '-50%',
              left: '-50%',
            }}
            animate={{
              x: [0, 70],
              y: [0, 70],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
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
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  VISUAL ART
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                시각적 경험의 확장
                <br className="hidden md:block" />
                Beyond Fashion, Into Art
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-400 leading-relaxed max-w-2xl"
              >
                REDUX는 패션을 넘어 다양한 시각 예술로 표현의 영역을 확장합니다.
                각 작품은 우리의 철학과 감성을 담아 새로운 시각적 언어를 만들어냅니다.
              </motion.p>
            </motion.div>

            {/* Right side - Dynamic Stack Gallery */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="flex justify-center lg:justify-end"
            >
              <IntegratedGallery 
                folder="visual-art"
                layout="stack"
                maxItems={5}
                title="Visual Art Gallery"
                className="w-full max-w-sm"
                stackStyle="spread"
                href="/admin/gallery?folder=visual-art"
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
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono mb-2">SCROLL</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Process Section */}
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
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                CREATIVE PROCESS
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
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="text-6xl md:text-7xl font-thin text-white/20 mb-6 group-hover:text-white/30 transition-colors">
                  {step.number}
                </div>
                
                <div className="mb-6">
                  <step.icon className="w-12 h-12 mx-auto text-white/60 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-wide">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              작품 갤러리
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
              시각 예술의 다양한 표현을 통해 전달하는 REDUX의 창작 세계를 만나보세요.
            </p>
          </motion.div>

          <IntegratedGallery
            folder="visual-art"
            layout="masonry"
            title=""
            acceptedTypes="all"
            className="mt-8"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              예술로 확장되는 디자인
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              REDUX의 비주얼 아트는 패션의 경계를 넘어 <br className="hidden md:block" />
              새로운 창작의 영역을 탐구합니다.
            </p>
            
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              전체 포트폴리오 보기
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}