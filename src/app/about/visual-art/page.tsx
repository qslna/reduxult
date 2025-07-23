'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Palette, Brush, Eye, Layers, Sparkles, Frame, Zap, Target } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function VisualArtPage() {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeArtist, setActiveArtist] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hero section content
  const heroContent = {
    title: "VISUAL ART",
    subtitle: "Where imagination meets creation",
    description: "비주얼 아트는 단순한 시각적 표현을 넘어 사고와 감정, 철학을 전달하는 언어입니다. REDUX의 비주얼 아트는 다양한 매체와 기법을 통해 독창적인 시각 언어를 창조합니다.",
    quote: "Art is not what you see, but what you make others see.",
    author: "Edgar Degas"
  };

  // Art techniques/mediums
  const artMediums = [
    {
      id: 'digital-art',
      title: 'DIGITAL ART',
      subtitle: '디지털 아트',
      description: '최신 디지털 도구를 활용한 혈신적인 시각 표현',
      descriptionEn: 'Innovative visual expression using cutting-edge digital tools',
      icon: '💻',
      color: 'from-blue-500 to-cyan-600',
      galleryId: 'visual-digital'
    },
    {
      id: 'traditional-art',
      title: 'TRADITIONAL ART',
      subtitle: '전통 미술',
      description: '전통적인 기법과 현대적 감성의 조화로운 만남',
      descriptionEn: 'Harmonious blend of traditional techniques and modern sensibilities',
      icon: '🎨',
      color: 'from-red-500 to-orange-600',
      galleryId: 'visual-traditional'
    },
    {
      id: 'mixed-media',
      title: 'MIXED MEDIA',
      subtitle: '복합 매체',
      description: '다양한 재료와 기법의 실험적 결합',
      descriptionEn: 'Experimental combination of various materials and techniques',
      icon: '🎭',
      color: 'from-purple-500 to-pink-600',
      galleryId: 'visual-mixed'
    },
    {
      id: 'conceptual-art',
      title: 'CONCEPTUAL ART',
      subtitle: '개념 미술',
      description: '아이디어와 철학이 중심이 되는 지적 예술',
      descriptionEn: 'Intellectual art where ideas and philosophy take center stage',
      icon: '🧠',
      color: 'from-green-500 to-teal-600',
      galleryId: 'visual-conceptual'
    },
    {
      id: 'street-art',
      title: 'STREET ART',
      subtitle: '스트리트 아트',
      description: '도시 공간에서 태어난 자유롭고 역동적인 표현',
      descriptionEn: 'Free and dynamic expression born in urban spaces',
      icon: '🎨',
      color: 'from-yellow-500 to-red-600',
      galleryId: 'visual-street'
    },
    {
      id: 'graphic-design',
      title: 'GRAPHIC DESIGN',
      subtitle: '그래픽 디자인',
      description: '시각적 커뮤니케이션을 위한 전략적 디자인',
      descriptionEn: 'Strategic design for effective visual communication',
      icon: '🔺',
      color: 'from-indigo-500 to-purple-600',
      galleryId: 'visual-graphic'
    }
  ];

  // Artist showcase data
  const artistShowcase = [
    {
      id: 'kim-bomin',
      name: 'KIM BOMIN',
      role: 'Creative Director',
      specialty: 'Brand Visual Identity',
      description: '브랜드의 시각적 정체성을 창조하고 전략적 비주얼 커뮤니케이션을 주도합니다.',
      galleryId: 'artist-kimbomin-visual'
    },
    {
      id: 'park-parang',
      name: 'PARK PARANG',
      role: 'Visual Artist',
      specialty: 'Contemporary Visual Expression',
      description: '현대적 시각 예술의 새로운 가능성을 탐구하며 독창적인 작품을 선보입니다.',
      galleryId: 'artist-parkparang-visual'
    },
    {
      id: 'lee-taehyeon',
      name: 'LEE TAEHYEON',
      role: 'Fashion Designer',
      specialty: 'Fashion Visual Narrative',
      description: '패션의 시각적 서사를 통해 의상에 담긴 이야기를 예술로 승화시킵니다.',
      galleryId: 'artist-leetaehyeon-visual'
    },
    {
      id: 'choi-eunsol',
      name: 'CHOI EUNSOL',
      role: 'Art Director',
      specialty: 'Conceptual Art Direction',
      description: '개념적 예술 연출을 통해 작품에 깊이와 맥락을 부여합니다.',
      galleryId: 'artist-choieunsol-visual'
    },
    {
      id: 'hwang-jinsu',
      name: 'HWANG JINSU',
      role: 'Film Director',
      specialty: 'Cinematic Visual Language',
      description: '영상적 시각 언어를 통해 정적 이미지에 움직임의 매력을 더합니다.',
      galleryId: 'artist-hwangjinsu-visual'
    },
    {
      id: 'kim-gyeongsu',
      name: 'KIM GYEONGSU',
      role: 'Installation Artist',
      specialty: 'Spatial Visual Installation',
      description: '공간적 시각 설치를 통해 관객과 작품 간의 새로운 소통을 창조합니다.',
      galleryId: 'artist-kimgyeongsu-visual'
    }
  ];

  // Creative process sections
  const creativeProcess = [
    {
      id: 'inspiration',
      title: '영감 수집',
      titleEn: 'INSPIRATION GATHERING',
      description: '일상의 순간들에서 창작의 씨앗을 발견하고 수집합니다.',
      icon: '🔍',
      galleryId: 'process-inspiration'
    },
    {
      id: 'conceptualization',
      title: '컨셉 개발',
      titleEn: 'CONCEPTUALIZATION',
      description: '수집된 영감을 바탕으로 구체적인 예술적 컨셉을 개발합니다.',
      icon: '💡',
      galleryId: 'process-conceptualization'
    },
    {
      id: 'experimentation',
      title: '실험과 탐구',
      titleEn: 'EXPERIMENTATION',
      description: '다양한 기법과 매체를 실험하며 최적의 표현 방법을 찾습니다.',
      icon: '⚙️',
      galleryId: 'process-experimentation'
    },
    {
      id: 'refinement',
      title: '정제와 완성',
      titleEn: 'REFINEMENT',
      description: '작품의 세부를 다듬고 완성도를 높여 최종 작품을 완성합니다.',
      icon: '✨',
      galleryId: 'process-refinement'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Artistic Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="brush-strokes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q5,0 10,10 Q15,20 20,10" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
                <path d="M0,5 Q10,15 20,5" stroke="white" strokeWidth="0.3" fill="none" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brush-strokes)" />
          </svg>
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
            <Palette className="w-16 h-16 mr-4 text-purple-500" />
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

          {/* Hero Art Gallery - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Visual Art Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId="visual-art-hero"
                  aspectRatio="4:3"
                  columns={3}
                  maxItems={6}
                  allowedTypes={['image']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((_, index) => (
                  <motion.div
                    key={index}
                    className="aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <Frame className="w-8 h-8 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 text-sm">Art Piece {index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Art Mediums Section */}
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
              ART MEDIUMS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              다양한 매체와 기법을 통해 각기 다른 예술적 표현을 탐구하며, 각 매체의 고유한 특성을 최대한 활용합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artMediums.map((medium, index) => (
              <motion.div
                key={medium.id}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Medium Preview */}
                <div className="aspect-[4/3] relative">
                  {isAdmin ? (
                    <InstagramStyleCMS
                      galleryId={medium.galleryId}
                      aspectRatio="4:3"
                      columns={1}
                      maxItems={4}
                      allowedTypes={['image']}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${medium.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{medium.icon}</div>
                        <p className="text-white font-medium">{medium.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Medium Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {medium.title}
                  </h3>
                  
                  <h4 className="text-lg font-medium mb-4 text-gray-300">
                    {medium.subtitle}
                  </h4>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                    {medium.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 italic">
                    {medium.descriptionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Showcase Section */}
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
              ARTIST SHOWCASE
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              6명의 디자이너가 각자의 전문 분야에서 선보이는 독창적인 비주얼 아트 작품들을 만나보세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artistShowcase.map((artist, index) => (
              <motion.div
                key={artist.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveArtist(activeArtist === artist.id ? null : artist.id)}
              >
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                  
                  {/* Artist Visual Work Area */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    {isAdmin && activeArtist === artist.id ? (
                      <div className="h-full p-4">
                        <h4 className="text-sm font-medium mb-3 text-purple-400 text-center">
                          {artist.name} Visual Work
                        </h4>
                        <InstagramStyleCMS
                          galleryId={artist.galleryId}
                          aspectRatio="4:5"
                          columns={1}
                          maxItems={5}
                          allowedTypes={['image']}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:from-purple-900/20 group-hover:to-pink-900/20 transition-colors duration-500">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Brush className="w-10 h-10 text-purple-400" />
                          </div>
                          <p className="text-sm text-gray-400">{artist.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{artist.role}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Artist Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-purple-400 font-medium mb-2 uppercase tracking-wider text-sm">
                      {artist.role}
                    </p>
                    <p className="text-gray-300 font-medium mb-3 text-sm">
                      {artist.specialty}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {artist.description}
                    </p>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      {activeArtist === artist.id && isAdmin ? 'Managing visual work ↑' : 'Click to explore work →'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Process Section */}
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
              CREATIVE PROCESS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              예술 작품의 탄생부터 완성까지, 우리의 체계적이고 첽신적인 창작 과정을 소개합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creativeProcess.map((process, index) => (
              <motion.div
                key={process.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Process Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                  {index + 1}
                </div>
                
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group h-full">
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
                        aspectRatio="square"
                        columns={1}
                        maxItems={3}
                        allowedTypes={['image']}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Connection Line */}
                {index < creativeProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-purple-500/30" />
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
              EXPLORE VISUAL POSSIBILITIES
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              당신의 비전을 시각적으로 표현해보세요. REDUX와 함께 당신만의 독창적인 비주얼 아트를 창조합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={20} />
                Start Creating
              </motion.a>
              <motion.a
                href="/designers"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet Our Artists
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Visual Art Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 6 artworks</p>
            <p>• Art Mediums: 6 mediums (4 images each)</p>
            <p>• Artist Showcase: 6 artists (5 works each)</p>
            <p>• Creative Process: 4 stages (3 images each)</p>
            <p>• Total: 66 manageable media slots</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}