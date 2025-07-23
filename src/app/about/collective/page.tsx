'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

export default function CollectivePage() {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Hero section content
  const heroContent = {
    title: "COLLECTIVE",
    subtitle: "Six minds, one creative vision",
    description: "REDUX represents the convergence of six distinct creative voices, united by a shared passion for pushing the boundaries of fashion and art. Our collective approach combines individual expertise with collaborative innovation.",
    quote: "Together, we are more than the sum of our parts.",
    author: "REDUX Collective"
  };

  // Process sections data
  const processSteps = [
    {
      id: 'direction',
      title: '디렉팅',
      titleEn: 'DIRECTION',
      description: '창작의 방향성을 제시하고 전체적인 비전을 구현합니다.',
      descriptionEn: 'We provide creative direction and implement the overall vision.',
      icon: '📋',
      galleryId: 'collective-direction'
    },
    {
      id: 'space-design',
      title: '공간 연출',
      titleEn: 'SPACE DESIGN',
      description: '공간을 통해 이야기를 전달하고 감정을 불러일으킵니다.',
      descriptionEn: 'We tell stories and evoke emotions through spatial design.',
      icon: '🏛️',
      galleryId: 'collective-space'
    },
    {
      id: 'digital-web',
      title: '디지털 웹 디자인',
      titleEn: 'DIGITAL WEB DESIGN',
      description: '디지털 공간에서의 사용자 경험을 설계합니다.',
      descriptionEn: 'We design user experiences in digital spaces.',
      icon: '💻',
      galleryId: 'collective-digital'
    },
    {
      id: 'art-graphic',
      title: '아트 그래픽',
      titleEn: 'ART GRAPHIC',
      description: '시각적 아이덴티티를 통해 브랜드의 본질을 표현합니다.',
      descriptionEn: 'We express brand essence through visual identity.',
      icon: '🎨',
      galleryId: 'collective-art'
    },
    {
      id: 'video-editing',
      title: '영상 & 편집',
      titleEn: 'VIDEO & EDITING',
      description: '움직이는 이미지로 스토리를 완성합니다.',
      descriptionEn: 'We complete stories through moving images.',
      icon: '🎬',
      galleryId: 'collective-video'
    },
    {
      id: 'promotion-branding',
      title: '홍보 브랜딩',
      titleEn: 'PROMOTION BRANDING',
      description: '브랜드의 가치를 세상에 알리고 확산시킵니다.',
      descriptionEn: 'We promote and spread brand values to the world.',
      icon: '📢',
      galleryId: 'collective-promotion'
    }
  ];

  // Team showcase data
  const teamMembers = [
    {
      id: 'kim-bomin',
      name: 'KIM BOMIN',
      role: 'Creative Director',
      specialty: 'Brand Strategy & Creative Vision',
      galleryId: 'collective-team-kimbomin'
    },
    {
      id: 'park-parang',
      name: 'PARK PARANG', 
      role: 'Visual Artist',
      specialty: 'Visual Art & Graphic Design',
      galleryId: 'collective-team-parkparang'
    },
    {
      id: 'lee-taehyeon',
      name: 'LEE TAEHYEON',
      role: 'Fashion Designer',
      specialty: 'Fashion Design & Styling',
      galleryId: 'collective-team-leetaehyeon'
    },
    {
      id: 'choi-eunsol',
      name: 'CHOI EUNSOL',
      role: 'Art Director',
      specialty: 'Art Direction & Concept',
      galleryId: 'collective-team-choieunsol'
    },
    {
      id: 'hwang-jinsu',
      name: 'HWANG JINSU',
      role: 'Film Director',
      specialty: 'Video Production & Directing',
      galleryId: 'collective-team-hwangjinsu'
    },
    {
      id: 'kim-gyeongsu',
      name: 'KIM GYEONGSU',
      role: 'Installation Artist',
      specialty: 'Space Design & Installation',
      galleryId: 'collective-team-kimgyeongsu'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px'
            }}
          />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate={isLoaded ? "animate" : "initial"}
          viewport={{ once: true }}
        >
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 tracking-tight"
            variants={fadeInUp}
          >
            {heroContent.title}
          </motion.h1>
          
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

          {/* Hero Image Gallery - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId="collective-hero"
                  aspectRatio="16:9"
                  columns={2}
                  maxItems={4}
                  allowedTypes={['image', 'video']}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Placeholder for hero images */}
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Collective Vision 01</span>
                </div>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Collective Vision 02</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Process Section */}
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
              OUR PROCESS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              우리의 창작 과정은 6가지 핵심 영역으로 구성됩니다. 각 영역에서의 전문성이 하나의 완성된 작품을 만들어냅니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                  {step.titleEn}
                </h3>
                
                <h4 className="text-lg font-medium mb-4 text-gray-300">
                  {step.title}
                </h4>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                <p className="text-sm text-gray-500 mb-6 italic">
                  {step.descriptionEn}
                </p>

                {/* Process Gallery - Each step has its own CMS */}
                {isAdmin ? (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium mb-3 text-purple-400">Gallery Management</h5>
                    <InstagramStyleCMS
                      galleryId={step.galleryId}
                      aspectRatio="4:3"
                      columns={2}
                      maxItems={6}
                      allowedTypes={['image', 'video']}
                    />
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center">Process<br/>Image</span>
                    </div>
                    <div className="aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center">Process<br/>Image</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase Section */}
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
              THE COLLECTIVE
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              6명의 디자이너가 각자의 전문성을 바탕으로 하나의 비전을 구현합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                  
                  {/* Member Image - Individual CMS for each team member */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    {isAdmin ? (
                      <div className="h-full">
                        <InstagramStyleCMS
                          galleryId={member.galleryId}
                          aspectRatio="4:5"
                          columns={1}
                          maxItems={3}
                          allowedTypes={['image']}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">👤</span>
                          </div>
                          <p className="text-sm text-gray-400">{member.name}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-purple-400 font-medium mb-2 uppercase tracking-wider text-sm">
                      {member.role}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {member.specialty}
                    </p>
                  </div>
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
              JOIN OUR VISION
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              우리와 함께 패션과 아트의 경계를 넘나드는 새로운 창작의 여정에 참여하세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
              <motion.a
                href="/designers"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meet the Team
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: Collective Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 4 images/videos</p>
            <p>• Process Steps: 6 galleries (6 images each)</p>
            <p>• Team Members: 6 individual galleries (3 images each)</p>
            <p>• Total: 58 manageable media slots</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}