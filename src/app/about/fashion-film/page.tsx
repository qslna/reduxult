'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Camera, Film, Clapperboard } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function FashionFilmPage() {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hero section content
  const heroContent = {
    title: "FASHION FILM",
    subtitle: "Moving imagery, timeless stories",
    description: "우리의 패션 필름은 단순한 영상을 넘어 감정과 이야기를 전달하는 예술 작품입니다. 각 프레임마다 디자이너의 비전과 브랜드의 철학이 살아 숨쉽니다.",
    quote: "Fashion is not just what you wear, it's how you move through the world.",
    author: "REDUX Film Division"
  };

  // Film projects data
  const filmProjects = [
    {
      id: 'ethereal-motion',
      title: 'ETHEREAL MOTION',
      subtitle: '이더리얼 모션',
      description: '꿈과 현실의 경계에서 펼쳐지는 패션의 시적 표현',
      descriptionEn: 'Poetic expression of fashion unfolding at the boundary between dreams and reality',
      duration: '3:42',
      year: '2024',
      director: 'HWANG JINSU',
      galleryId: 'film-ethereal-motion'
    },
    {
      id: 'urban-shadows',
      title: 'URBAN SHADOWS',
      subtitle: '어반 섀도우즈',
      description: '도시의 그림자 속에서 발견하는 새로운 아름다움',
      descriptionEn: 'Discovering new beauty in the shadows of the city',
      duration: '4:15',
      year: '2024',
      director: 'COLLECTIVE',
      galleryId: 'film-urban-shadows'
    },
    {
      id: 'textile-dreams',
      title: 'TEXTILE DREAMS',
      subtitle: '텍스타일 드림즈',
      description: '직물의 촉감과 움직임으로 표현하는 감성의 언어',
      descriptionEn: 'The language of emotion expressed through the texture and movement of textiles',
      duration: '2:58',
      year: '2024',
      director: 'LEE TAEHYEON',
      galleryId: 'film-textile-dreams'
    },
    {
      id: 'metamorphosis',
      title: 'METAMORPHOSIS',
      subtitle: '메타모르포시스',
      description: '변화와 성장의 순간을 포착한 변신의 이야기',
      descriptionEn: 'A story of transformation capturing moments of change and growth',
      duration: '5:23',
      year: '2024',
      director: 'KIM BOMIN',
      galleryId: 'film-metamorphosis'
    }
  ];

  // Production process sections
  const productionProcess = [
    {
      id: 'concept-development',
      title: '컨셉 개발',
      titleEn: 'CONCEPT DEVELOPMENT',
      description: '브랜드의 철학과 메시지를 영상 언어로 번역합니다.',
      icon: '💡',
      galleryId: 'production-concept'
    },
    {
      id: 'pre-production',
      title: '프리 프로덕션',
      titleEn: 'PRE-PRODUCTION',
      description: '스토리보드부터 캐스팅까지 모든 준비 과정을 관리합니다.',
      icon: '📋',
      galleryId: 'production-pre'
    },
    {
      id: 'cinematography',
      title: '시네마토그래피',
      titleEn: 'CINEMATOGRAPHY',
      description: '빛과 그림자, 움직임으로 감정을 표현합니다.',
      icon: '🎬',
      galleryId: 'production-cinematography'
    },
    {
      id: 'post-production',
      title: '포스트 프로덕션',
      titleEn: 'POST-PRODUCTION',
      description: '편집과 색보정으로 완성된 작품을 만들어냅니다.',
      icon: '✂️',
      galleryId: 'production-post'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            background: `
              linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
              linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
            `,
            backgroundSize: '40px 40px',
            animation: 'filmGrain 20s linear infinite'
          }} />
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
            <Film className="w-16 h-16 mr-4 text-purple-500" />
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

          {/* Hero Video Gallery - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Film Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId="fashion-film-hero"
                  aspectRatio="16:9"
                  columns={2}
                  maxItems={4}
                  allowedTypes={['image', 'video']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-300">Fashion Film Reel 01</span>
                  </div>
                </div>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors">
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-300">Fashion Film Reel 02</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Film Projects Section */}
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
              FEATURED FILMS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              각각의 패션 필름은 고유한 스토리와 미학을 담고 있으며, 브랜드의 정체성을 영상으로 표현합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filmProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Project Video/Image Area */}
                <div className="aspect-video relative">
                  {isAdmin ? (
                    <InstagramStyleCMS
                      galleryId={project.galleryId}
                      aspectRatio="16:9"
                      columns={1}
                      maxItems={3}
                      allowedTypes={['image', 'video']}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-purple-900/20 group-hover:to-pink-900/20 transition-colors duration-500">
                      <div className="text-center">
                        <Clapperboard className="w-16 h-16 mx-auto mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-sm text-gray-400">{project.title}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-20 h-20 bg-purple-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                        {project.year}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">
                        {project.duration}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      Dir. {project.director}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <h4 className="text-lg font-medium mb-4 text-gray-300">
                    {project.subtitle}
                  </h4>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <p className="text-sm text-gray-500 italic">
                    {project.descriptionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Process Section */}
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
              PRODUCTION PROCESS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              아이디어부터 완성된 작품까지, 패션 필름 제작의 모든 단계를 전문적으로 관리합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productionProcess.map((process, index) => (
              <motion.div
                key={process.id}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {process.icon}
                </div>
                
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                  {process.titleEn}
                </h3>
                
                <h4 className="text-base font-medium mb-4 text-gray-300">
                  {process.title}
                </h4>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {process.description}
                </p>

                {/* Process Gallery */}
                {isAdmin ? (
                  <div className="mt-4">
                    <h5 className="text-xs font-medium mb-3 text-purple-400">Process Gallery</h5>
                    <InstagramStyleCMS
                      galleryId={process.galleryId}
                      aspectRatio="4:3"
                      columns={1}
                      maxItems={4}
                      allowedTypes={['image', 'video']}
                    />
                  </div>
                ) : (
                  <div className="mt-4 aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                )}
              </motion.div>
            ))}
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
              CREATE WITH US
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              당신의 브랜드 스토리를 영상으로 만들어보세요. REDUX와 함께 특별한 패션 필름을 제작합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Film size={20} />
                Start Your Project
              </motion.a>
              <motion.a
                href="/exhibitions"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Work
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Fashion Film Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 4 videos/images</p>
            <p>• Film Projects: 4 individual galleries (3 media each)</p>
            <p>• Production Process: 4 process galleries (4 media each)</p>
            <p>• Total: 32 manageable media slots</p>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes filmGrain {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1px, -1px); }
          20% { transform: translate(1px, 1px); }
          30% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          70% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          90% { transform: translate(-1px, -1px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}