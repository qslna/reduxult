'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Clock, Heart, Star, Camera, Archive, BookOpen, Users, Sparkles } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function MemoryPage() {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStack, setSelectedStack] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hero section content
  const heroContent = {
    title: "MEMORY",
    subtitle: "Fragments of time, woven together",
    description: "우리의 기억은 개별적인 순간들이 모여 하나의 이야기를 만들어냅니다. 각각의 추억이 켜켜이 쌓여 REDUX의 정체성을 형성하고, 우리가 지향하는 창작의 방향성을 제시합니다.",
    quote: "Memory is the treasury and guardian of all things.",
    author: "Cicero"
  };

  // Memory stacks data - different themed collections
  const memoryStacks = [
    {
      id: 'origins',
      title: 'ORIGINS',
      subtitle: '시작의 기억',
      description: 'REDUX가 시작된 순간들과 초기의 열정이 담긴 기억들',
      descriptionEn: 'Memories of REDUX\'s beginnings and the initial passion that started it all',
      icon: '🌱',
      color: 'from-green-500 to-emerald-600',
      galleryId: 'memory-origins',
      stackCount: 8
    },
    {
      id: 'collaborations',
      title: 'COLLABORATIONS',
      subtitle: '함께한 순간들',
      description: '6명의 디자이너가 함께 작업하며 만들어낸 특별한 순간들',
      descriptionEn: 'Special moments created by six designers working together',
      icon: '🤝',
      color: 'from-blue-500 to-indigo-600',
      galleryId: 'memory-collaborations',
      stackCount: 12
    },
    {
      id: 'breakthroughs',
      title: 'BREAKTHROUGHS',
      subtitle: '돌파의 순간',
      description: '창작 과정에서 마주한 도전과 그것을 극복한 성취의 기억들',
      descriptionEn: 'Memories of challenges faced and achievements made in the creative process',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-600',
      galleryId: 'memory-breakthroughs',
      stackCount: 10
    },
    {
      id: 'inspirations',
      title: 'INSPIRATIONS',
      subtitle: '영감의 순간들',
      description: '일상 속에서 발견한 아름다움과 창작의 영감이 된 순간들',
      descriptionEn: 'Moments of beauty discovered in daily life and sources of creative inspiration',
      icon: '✨',
      color: 'from-purple-500 to-pink-600',
      galleryId: 'memory-inspirations',
      stackCount: 15
    },
    {
      id: 'exhibitions',
      title: 'EXHIBITIONS',
      subtitle: '전시의 기록',
      description: '우리의 작품이 세상에 선보여진 특별한 전시 순간들',
      descriptionEn: 'Special exhibition moments when our works were presented to the world',
      icon: '🎨',
      color: 'from-red-500 to-rose-600',
      galleryId: 'memory-exhibitions',
      stackCount: 6
    },
    {
      id: 'milestones',
      title: 'MILESTONES',
      subtitle: '이정표가 된 순간들',
      description: 'REDUX의 성장 과정에서 중요한 이정표가 된 의미있는 순간들',
      descriptionEn: 'Meaningful moments that became important milestones in REDUX\'s growth',
      icon: '🏆',
      color: 'from-cyan-500 to-teal-600',
      galleryId: 'memory-milestones',
      stackCount: 9
    }
  ];

  // Timeline periods
  const timelinePeriods = [
    {
      id: 'foundation',
      year: '2022',
      title: 'FOUNDATION',
      subtitle: '창립',
      description: '6명의 디자이너가 만나 REDUX라는 꿈을 시작한 해',
      galleryId: 'timeline-foundation'
    },
    {
      id: 'growth',
      year: '2023',
      title: 'GROWTH',
      subtitle: '성장',
      description: '첫 번째 프로젝트들과 브랜드 정체성을 확립한 해',
      galleryId: 'timeline-growth'
    },
    {
      id: 'expansion',
      year: '2024',
      title: 'EXPANSION',
      subtitle: '확장',
      description: '다양한 분야로 영역을 넓히며 영향력을 확대한 해',
      galleryId: 'timeline-expansion'
    },
    {
      id: 'evolution',
      year: '2025',
      title: 'EVOLUTION',
      subtitle: '진화',
      description: '새로운 비전을 품고 더 큰 미래를 향해 나아가는 해',
      galleryId: 'timeline-evolution'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Floating Memory Particles Animation */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center justify-center mb-8"
            variants={fadeInUp}
          >
            <Archive className="w-16 h-16 mr-4 text-purple-500" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight">
              {heroContent.title}
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl font-light mb-8 tracking-[0.2em] uppercase text-gray-300"
            variants={fadeInUp}
          >
            {heroContent.subtitle}
          </motion.p>
          
          <motion.div 
            className="max-w-3xl mx-auto mb-12"
            variants={fadeInUp}
          >
            <p className="text-base sm:text-lg leading-relaxed text-gray-400 mb-8">
              {heroContent.description}
            </p>
            
            <blockquote className="border-l-4 border-purple-500 pl-6 italic text-lg sm:text-xl text-white">
              "{heroContent.quote}"
              <footer className="text-sm text-gray-400 mt-2">— {heroContent.author}</footer>
            </blockquote>
          </motion.div>

          {/* Hero Memory Collage - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Memory Collage Management</h3>
                <InstagramStyleCMS
                  galleryId="memory-hero"
                  aspectRatio="auto"
                  columns={3}
                  maxItems={9}
                  allowedTypes={['image']}
                />
              </div>
            ) : (
              <div className="relative">
                {/* Stack-style collage preview */}
                <div className="flex justify-center items-center space-x-4">
                  {[1, 2, 3].map((_, index) => (
                    <motion.div
                      key={index}
                      className="relative"
                      style={{
                        transform: `rotate(${index * 5 - 5}deg) translateY(${index * 10}px)`,
                        zIndex: 3 - index
                      }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 0, 
                        translateY: -10,
                        zIndex: 10
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-64 h-48 bg-gray-800 rounded-lg border-4 border-white/20 shadow-xl flex items-center justify-center group cursor-pointer">
                        <div className="text-center">
                          <Camera className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                          <span className="text-gray-300 text-sm">Memory Stack {index + 1}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Memory Stacks Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-[0.05em] uppercase">
              MEMORY STACKS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              테마별로 분류된 기억들이 쌓여 있는 특별한 컬렉션입니다. 각 스택을 클릭하여 그 안에 담긴 이야기들을 발견해보세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memoryStacks.map((stack, index) => (
              <motion.div
                key={stack.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedStack(selectedStack === stack.id ? null : stack.id)}
              >
                {/* Stack of Images Effect */}
                <div className="relative h-80">
                  {/* Background stacked cards */}
                  {[0, 1, 2].map((cardIndex) => (
                    <motion.div
                      key={cardIndex}
                      className={`absolute inset-0 rounded-2xl border border-gray-700 shadow-2xl bg-gradient-to-br ${stack.color}`}
                      style={{
                        transform: `translateY(${cardIndex * -8}px) translateX(${cardIndex * 4}px) rotate(${cardIndex * 2 - 2}deg)`,
                        zIndex: 3 - cardIndex,
                        opacity: 1 - cardIndex * 0.2
                      }}
                      whileHover={{
                        transform: `translateY(${cardIndex * -12}px) translateX(${cardIndex * 6}px) rotate(${cardIndex * 3 - 3}deg)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                  
                  {/* Main content */}
                  <motion.div 
                    className="relative z-10 h-full rounded-2xl overflow-hidden bg-gray-900/90 backdrop-blur-sm border border-gray-700 group-hover:border-purple-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {isAdmin && selectedStack === stack.id ? (
                      <div className="h-full p-4">
                        <h4 className="text-sm font-medium mb-3 text-purple-400 text-center">
                          {stack.title} Stack Management
                        </h4>
                        <InstagramStyleCMS
                          galleryId={stack.galleryId}
                          aspectRatio="4:3"
                          columns={2}
                          maxItems={stack.stackCount}
                          allowedTypes={['image']}
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-between p-6">
                        <div>
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {stack.icon}
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                            {stack.title}
                          </h3>
                          
                          <h4 className="text-lg font-medium mb-4 text-gray-300">
                            {stack.subtitle}
                          </h4>
                          
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {stack.description}
                          </p>
                          
                          <p className="text-xs text-gray-500 italic">
                            {stack.descriptionEn}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{stack.stackCount} memories</span>
                          <span className="text-purple-400">
                            {selectedStack === stack.id ? 'Managing ↑' : 'Click to explore →'}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/20 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-6 tracking-[0.05em] uppercase">
              TIMELINE
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              시간의 흐름에 따라 기록된 REDUX의 여정과 각 시기별 특별한 순간들을 만나보세요.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500 hidden md:block" />
            
            <div className="space-y-12">
              {timelinePeriods.map((period, index) => (
                <motion.div
                  key={period.id}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'} mb-8 md:mb-0`}>
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span className="text-2xl font-bold text-purple-400">{period.year}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-white">{period.title}</h3>
                      <h4 className="text-lg font-medium mb-4 text-gray-300">{period.subtitle}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">{period.description}</p>
                      
                      {/* Timeline Gallery */}
                      {isAdmin ? (
                        <div>
                          <h5 className="text-xs font-medium mb-3 text-purple-400">Timeline Gallery</h5>
                          <InstagramStyleCMS
                            galleryId={period.galleryId}
                            aspectRatio="16:9"
                            columns={2}
                            maxItems={6}
                            allowedTypes={['image']}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                            <Camera className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                            <Camera className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative z-10 hidden md:block">
                    <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-black shadow-lg" />
                  </div>
                  
                  {/* Spacer */}
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-8 tracking-[0.05em] uppercase">
              CREATE MEMORIES WITH US
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              당신의 이야기도 우리의 기억 컬렉션에 추가해보세요. 함께 만들어가는 새로운 기억들이 더 큰 창작의 영감이 됩니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} />
                Join Our Story
              </motion.a>
              <motion.a
                href="/designers"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet the Creators
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Admin Notes */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-6 right-6 md:left-auto md:right-20 md:w-80 bg-purple-900/90 backdrop-blur-sm border border-purple-500/50 rounded-lg p-4 z-40"
        >
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Memory Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Collage: 9 images</p>
            <p>• Memory Stacks: 6 stacks (69 total images)</p>
            <p>• Timeline: 4 periods (6 images each)</p>
            <p>• Total: 102 manageable media slots</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}