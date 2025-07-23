'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Box, Map, Users, Lightbulb, Ruler, Hammer, Eye, Layers, Zap, Building } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function InstallationPage() {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeInstallation, setActiveInstallation] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hero section content
  const heroContent = {
    title: "INSTALLATION",
    subtitle: "Transforming spaces, creating experiences",
    description: "인스톨레이션 예술은 공간을 변화시키고 관객과의 새로운 소통을 창조합니다. REDUX의 인스톨레이션은 물리적 공간의 경계를 넘어 참여자의 감정과 인식을 전환시키는 예술적 경험을 제공합니다.",
    quote: "Architecture is a social act and the material theater of human activity.",
    author: "Spiro Kostof"
  };

  // Installation environments/types
  const installationTypes = [
    {
      id: 'gallery-installation',
      title: 'GALLERY INSTALLATION',
      subtitle: '갤러리 인스톨레이션',
      description: '미술관과 갤러리 공간의 특성을 활용한 내밀한 예술 경험',
      descriptionEn: 'Intimate artistic experiences utilizing the characteristics of museum and gallery spaces',
      icon: '🏢',
      color: 'from-blue-500 to-indigo-600',
      galleryId: 'installation-gallery'
    },
    {
      id: 'outdoor-installation',
      title: 'OUTDOOR INSTALLATION',
      subtitle: '야외 인스톨레이션',
      description: '자연과 도시 환경에서 펼쳐지는 오픈 스케일 예술 경험',
      descriptionEn: 'Open-scale artistic experiences unfolding in natural and urban environments',
      icon: '🌳',
      color: 'from-green-500 to-teal-600',
      galleryId: 'installation-outdoor'
    },
    {
      id: 'interactive-installation',
      title: 'INTERACTIVE INSTALLATION',
      subtitle: '인터랙티브 인스톨레이션',
      description: '참여자의 상호작용을 통해 완성되는 역동적 예술 경험',
      descriptionEn: 'Dynamic artistic experiences completed through participant interaction',
      icon: '🤝',
      color: 'from-purple-500 to-pink-600',
      galleryId: 'installation-interactive'
    },
    {
      id: 'digital-installation',
      title: 'DIGITAL INSTALLATION',
      subtitle: '디지털 인스톨레이션',
      description: '첫단 기술과 예술의 결합으로 만들어지는 미래지향적 경험',
      descriptionEn: 'Future-oriented experiences created through cutting-edge technology and art',
      icon: '🗺️',
      color: 'from-cyan-500 to-blue-600',
      galleryId: 'installation-digital'
    },
    {
      id: 'temporary-installation',
      title: 'TEMPORARY INSTALLATION',
      subtitle: '임시 인스톨레이션',
      description: '제한된 시간 동안 존재하는 일시적이지만 강렬한 예술적 메시지',
      descriptionEn: 'Temporary but powerful artistic messages existing for a limited time',
      icon: '⏰',
      color: 'from-orange-500 to-red-600',
      galleryId: 'installation-temporary'
    },
    {
      id: 'immersive-installation',
      title: 'IMMERSIVE INSTALLATION',
      subtitle: '몰입형 인스톨레이션',
      description: '참여자를 완전히 둘러싸는 전인격적인 감각적 영향력',
      descriptionEn: 'Comprehensive sensory impact that completely surrounds participants',
      icon: '🌌',
      color: 'from-indigo-500 to-purple-600',
      galleryId: 'installation-immersive'
    }
  ];

  // Featured installations showcase
  const featuredInstallations = [
    {
      id: 'flux-chamber',
      title: 'FLUX CHAMBER',
      subtitle: '플럭스 챔버',
      description: '빛과 소리, 공간의 변화를 통해 시간의 흐름을 체험하는 몰입형 설치',
      year: '2024',
      location: 'Seoul Art Center',
      dimensions: '12m x 8m x 4m',
      materials: 'LED, Sensors, Steel, Fabric',
      galleryId: 'featured-flux-chamber'
    },
    {
      id: 'memory-garden',
      title: 'MEMORY GARDEN',
      subtitle: '메모리 가든',
      description: '개인적 기억과 집단적 기억이 만나는 인터랙티브 공간 설치',
      year: '2024',
      location: 'Hongdae Art Space',
      dimensions: '15m x 10m x 3m',
      materials: 'Mirror, Plants, Video, Touch Sensors',
      galleryId: 'featured-memory-garden'
    },
    {
      id: 'urban-echo',
      title: 'URBAN ECHO',
      subtitle: '어반 에코',
      description: '도시의 소음과 리듬을 시각화하는 야외 디지털 설치',
      year: '2023',
      location: 'Cheonggyecheon Plaza',
      dimensions: '20m x 5m x 6m',
      materials: 'Projection, Speakers, Motion Sensors',
      galleryId: 'featured-urban-echo'
    },
    {
      id: 'textile-cosmos',
      title: 'TEXTILE COSMOS',
      subtitle: '텍스타일 코스모스',
      description: '직물과 연결의 은유를 통해 우주적 공간을 창조하는 설치',
      year: '2023',
      location: 'DDP Gallery',
      dimensions: '8m x 8m x 5m',
      materials: 'Fabric, Wire, LED, Arduino',
      galleryId: 'featured-textile-cosmos'
    }
  ];

  // Installation process workflow
  const installationProcess = [
    {
      id: 'concept-spatial-planning',
      title: '컨셉 및 공간 계획',
      titleEn: 'CONCEPT & SPATIAL PLANNING',
      description: '예술적 컨셉을 공간적 디자인으로 번역하고 공간의 특성을 분석합니다.',
      icon: '📝',
      galleryId: 'process-concept-planning'
    },
    {
      id: 'material-research',
      title: '재료 연구 및 실험',
      titleEn: 'MATERIAL RESEARCH',
      description: '컨셉을 구현할 최적의 재료와 기술을 연구하고 테스트합니다.',
      icon: '🧪',
      galleryId: 'process-material-research'
    },
    {
      id: 'fabrication-construction',
      title: '제작 및 시공',
      titleEn: 'FABRICATION & CONSTRUCTION',
      description: '설계된 설치를 실제로 제작하고 공간에 설치하는 과정입니다.',
      icon: '🔨',
      galleryId: 'process-fabrication'
    },
    {
      id: 'testing-calibration',
      title: '테스트 및 보정',
      titleEn: 'TESTING & CALIBRATION',
      description: '설치된 작품의 기능적, 예술적 요소를 세밀하게 조정합니다.',
      icon: '⚙️',
      galleryId: 'process-testing'
    },
    {
      id: 'exhibition-documentation',
      title: '전시 및 기록',
      titleEn: 'EXHIBITION & DOCUMENTATION',
      description: '공개 전시를 통해 발표하고 전 과정을 체계적으로 기록합니다.',
      icon: '📷',
      galleryId: 'process-exhibition'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* 3D Grid Background Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0'
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
            <Box className="w-16 h-16 mr-4 text-purple-500" />
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

          {/* Hero Installation Gallery - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Installation Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId="installation-hero"
                  aspectRatio="16:9"
                  columns={2}
                  maxItems={4}
                  allowedTypes={['image', 'video']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((_, index) => (
                  <motion.div
                    key={index}
                    className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <Building className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300">Installation Space {index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Installation Types Section */}
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
              INSTALLATION TYPES
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              다양한 공간과 환경에서 펼쳐지는 인스톨레이션 예술의 범위와 가능성을 탐구합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {installationTypes.map((type, index) => (
              <motion.div
                key={type.id}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Type Preview */}
                <div className="aspect-[4/3] relative">
                  {isAdmin ? (
                    <InstagramStyleCMS
                      galleryId={type.galleryId}
                      aspectRatio="4:3"
                      columns={1}
                      maxItems={3}
                      allowedTypes={['image', 'video']}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                      <div className="text-center">
                        <div className="text-4xl mb-2">{type.icon}</div>
                        <p className="text-white font-medium text-sm">{type.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Type Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {type.title}
                  </h3>
                  
                  <h4 className="text-lg font-medium mb-4 text-gray-300">
                    {type.subtitle}
                  </h4>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                    {type.description}
                  </p>
                  
                  <p className="text-xs text-gray-500 italic">
                    {type.descriptionEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Installations Section */}
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
              FEATURED INSTALLATIONS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              REDUX가 제작한 대표적인 인스톨레이션 작품들을 통해 공간 예술의 무한한 가능성을 경험해보세요.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredInstallations.map((installation, index) => (
              <motion.div
                key={installation.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveInstallation(activeInstallation === installation.id ? null : installation.id)}
              >
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                  
                  {/* Installation Visual Area */}
                  <div className="aspect-video relative overflow-hidden">
                    {isAdmin && activeInstallation === installation.id ? (
                      <div className="h-full p-4">
                        <h4 className="text-sm font-medium mb-3 text-purple-400 text-center">
                          {installation.title} Documentation
                        </h4>
                        <InstagramStyleCMS
                          galleryId={installation.galleryId}
                          aspectRatio="16:9"
                          columns={1}
                          maxItems={6}
                          allowedTypes={['image', 'video']}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-purple-900/20 group-hover:to-pink-900/20 transition-colors duration-500">
                        <div className="text-center">
                          <Box className="w-16 h-16 mx-auto mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                          <p className="text-sm text-gray-400 font-medium">{installation.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{installation.year}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Installation Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                          {installation.year}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                          {installation.location}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                      {installation.title}
                    </h3>
                    
                    <h4 className="text-lg font-medium mb-4 text-gray-300">
                      {installation.subtitle}
                    </h4>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                      {installation.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
                      <div>
                        <span className="font-medium text-gray-400">Dimensions:</span><br/>
                        {installation.dimensions}
                      </div>
                      <div>
                        <span className="font-medium text-gray-400">Materials:</span><br/>
                        {installation.materials}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      {activeInstallation === installation.id && isAdmin ? 'Managing documentation ↑' : 'Click to explore documentation →'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Process Section */}
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
              INSTALLATION PROCESS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              컨셉의 발상부터 완성된 설치의 전시까지, 인스톨레이션 예술의 전체 제작 과정을 단계별로 소개합니다.
            </p>
          </motion.div>

          <div className="space-y-12">
            {installationProcess.map((process, index) => (
              <motion.div
                key={process.id}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Process Content */}
                <div className="flex-1">
                  <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="text-3xl">{process.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{process.titleEn}</h3>
                        <h4 className="text-lg font-medium text-gray-300">{process.title}</h4>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {process.description}
                    </p>
                    
                    {/* Process Gallery */}
                    {isAdmin ? (
                      <div>
                        <h5 className="text-sm font-medium mb-3 text-purple-400">Process Documentation</h5>
                        <InstagramStyleCMS
                          galleryId={process.galleryId}
                          aspectRatio="16:9"
                          columns={2}
                          maxItems={4}
                          allowedTypes={['image', 'video']}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Visual Spacer */}
                <div className="w-16 flex justify-center">
                  <div className="w-1 h-24 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                </div>
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
              TRANSFORM YOUR SPACE
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              당신의 공간을 예술적 경험의 무대로 만들어보세요. REDUX와 함께 특별한 인스톨레이션을 기획합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={20} />
                Start Your Installation
              </motion.a>
              <motion.a
                href="/exhibitions"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Exhibitions
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Installation Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 4 videos/images</p>
            <p>• Installation Types: 6 types (3 media each)</p>
            <p>• Featured Installations: 4 projects (6 media each)</p>
            <p>• Process Steps: 5 stages (4 media each)</p>
            <p>• Total: 66 manageable media slots</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}