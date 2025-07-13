'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Users, Lightbulb, Target } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import IntegratedGallery from '@/components/gallery/IntegratedGallery';


const collectiveValues = [
  {
    icon: Users,
    title: 'COLLABORATION',
    description: '개별 디자이너들의 독창성이 모여 더 큰 창작의 힘을 만들어냅니다.',
  },
  {
    icon: Lightbulb,
    title: 'INNOVATION',
    description: '새로운 아이디어와 실험적 접근을 통해 디자인의 경계를 확장합니다.',
  },
  {
    icon: Target,
    title: 'VISION',
    description: '명확한 비전과 목표를 바탕으로 일관된 디자인 철학을 구현합니다.',
  },
];

export default function CollectivePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
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
                <span className="bg-gradient-to-r from-purple-200 via-blue-300 to-purple-200 bg-clip-text text-transparent">
                  COLLECTIVE
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeIn}
                className="text-lg md:text-xl lg:text-2xl text-purple-200 mb-8 leading-relaxed"
              >
                집단 창작의 힘
                <br className="hidden md:block" />
                The Power of Collective Creation
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-400 leading-relaxed max-w-2xl"
              >
                REDUX는 개별 디자이너들의 고유한 창작 세계가 만나 새로운 시너지를 만들어내는 
                집단입니다. 우리는 협업을 통해 더 큰 창작의 가능성을 탐구합니다.
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
                folder="collective"
                layout="stack"
                className="w-full max-w-sm"
                title="Collective Gallery"
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
            className="flex flex-col items-center text-purple-200/60 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono mb-2">SCROLL</span>
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Collective Values */}
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
              <span className="bg-gradient-to-r from-purple-200 via-blue-300 to-purple-200 bg-clip-text text-transparent">
                COLLECTIVE VALUES
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
            {collectiveValues.map((value, index) => (
              <motion.div
                key={value.title}
                variants={fadeIn}
                className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <value.icon size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-purple-200 mb-6 tracking-wide">
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-purple-200">
              함께 만드는 새로운 디자인
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/30 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">다양성 속의 통일</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  각기 다른 배경과 스타일을 가진 디자이너들이 
                  하나의 브랜드 아이덴티티로 융합됩니다.
                </p>
              </div>
              
              <div className="bg-gray-900/30 rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">실험과 혁신</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  안전한 영역을 벗어나 새로운 가능성을 탐구하며 
                  디자인의 미래를 제시합니다.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              REDUX 컬렉티브 프로젝트 참여하기
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}