'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, Users, Film, Palette, Clock } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { buildImageKitUrl } from '@/lib/imagekit';

const aboutSections = [
  {
    title: 'Visual Art',
    description: '시각적 창조와 예술적 표현의 경계를 탐험합니다',
    href: '/about/visual-art',
    icon: Eye,
    image: '/about/visual-art/Metamorphosis.png',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Collective',
    description: '협업과 공동 창작을 통한 새로운 가능성을 발견합니다',
    href: '/about/collective',
    icon: Users,
    image: '/about/visual-art/Collective Vision.png',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Fashion Film',
    description: '패션과 영상의 만남으로 스토리텔링을 완성합니다',
    href: '/about/fashion-film',
    icon: Film,
    image: '/about/visual-art/Digital Dreams.png',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Installation',
    description: '공간과 관람객의 상호작용을 통한 몰입형 경험을 제공합니다',
    href: '/about/installation',
    icon: Palette,
    image: '/about/visual-art/Form & Void.png',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Memory',
    description: '시간과 기억의 흔적을 디자인으로 보존하고 재해석합니다',
    href: '/about/memory',
    icon: Clock,
    image: '/about/visual-art/Analog Memories.png',
    color: 'from-yellow-500 to-orange-500',
  },
];

export default function AboutShowcase() {
  return (
    <section className="relative py-20 bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              ABOUT
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
          >
            다섯 가지 카테고리로 구성된 창의적 영역에서 
            <br className="hidden md:block" />
            혁신적인 디자인 솔루션을 탐구합니다
          </motion.p>
        </motion.div>

        {/* About Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {aboutSections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={fadeIn}
              className="group relative"
            >
              <Link href={section.href}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={buildImageKitUrl(section.image, {
                        width: 400,
                        height: 300,
                        quality: 85,
                        format: 'webp'
                      })}
                      alt={section.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <section.icon size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {section.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center text-white/60 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium mr-2">자세히 보기</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-2xl"
                    whileHover={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-16"
        >
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-semibold rounded-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              모든 카테고리 둘러보기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}