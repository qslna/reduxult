'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Instagram, Plus, Grid3X3, Camera, Hash, Palette, Lightbulb, Target, Award, Users, Sparkles, Eye, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Designer } from '@/types';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import InstagramStyleCMS from '@/components/admin/InstagramStyleCMS';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

interface Props {
  designer: Designer;
}

export default function DesignerDetail({ designer }: Props) {
  const { isAdmin } = useAdminAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get designer-specific content based on their role and specialty
  const getDesignerContent = () => {
    const baseContent = {
      philosophy: {
        title: "DESIGN PHILOSOPHY",
        subtitle: "창작 철학",
        description: "독창적인 시각과 혁신적인 접근을 통해 패션과 예술의 새로운 경계를 탐구합니다.",
        quote: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs"
      },
      specialties: [
        {
          id: 'creative-direction',
          title: 'CREATIVE DIRECTION',
          subtitle: '크리에이티브 디렉션',
          description: '브랜드의 전체적인 창작 방향성을 설정하고 일관된 비전을 구현합니다.',
          icon: '🎯',
          galleryId: `${designer.id}-creative-direction`
        },
        {
          id: 'concept-development',
          title: 'CONCEPT DEVELOPMENT',
          subtitle: '컨셉 개발',
          description: '독창적인 아이디어를 구체적인 창작물로 발전시키는 전문성을 갖추고 있습니다.',
          icon: '💡',
          galleryId: `${designer.id}-concept-development`
        },
        {
          id: 'visual-storytelling',
          title: 'VISUAL STORYTELLING',
          subtitle: '비주얼 스토리텔링',
          description: '시각적 언어를 통해 깊이 있는 이야기와 감정을 전달합니다.',
          icon: '📖',
          galleryId: `${designer.id}-visual-storytelling`
        }
      ],
      process: [
        {
          id: 'research-inspiration',
          title: '리서치 & 영감',
          titleEn: 'RESEARCH & INSPIRATION',
          description: '다양한 문화, 예술, 자연에서 영감을 얻고 깊이 있는 리서치를 진행합니다.',
          icon: '🔍',
          galleryId: `${designer.id}-process-research`
        },
        {
          id: 'concept-sketching',
          title: '컨셉 스케치',
          titleEn: 'CONCEPT SKETCHING',
          description: '아이디어를 시각화하고 다양한 형태로 실험하며 발전시킵니다.',
          icon: '✏️',
          galleryId: `${designer.id}-process-sketching`
        },
        {
          id: 'development-refinement',
          title: '개발 & 정제',
          titleEn: 'DEVELOPMENT & REFINEMENT',
          description: '선택된 컨셉을 구체화하고 완성도 높은 작품으로 발전시킵니다.',
          icon: '⚡',
          galleryId: `${designer.id}-process-development`
        },
        {
          id: 'final-presentation',
          title: '최종 프레젠테이션',
          titleEn: 'FINAL PRESENTATION',
          description: '완성된 작품을 효과적으로 발표하고 세상과 소통합니다.',
          icon: '🎪',
          galleryId: `${designer.id}-process-presentation`
        }
      ],
      achievements: [
        {
          id: 'redux-foundation',
          year: '2024',
          title: 'REDUX Collective 창립',
          description: '6인의 디자이너와 함께 창작 집단 REDUX를 설립하여 새로운 패션 문화를 제시합니다.',
          type: 'milestone'
        },
        {
          id: 'first-exhibition',
          year: '2024',
          title: '첫 번째 개인전 개최',
          description: '개인 작품 세계를 대중에게 선보이며 독창적인 예술적 비전을 공유했습니다.',
          type: 'exhibition'
        },
        {
          id: 'collaboration-success',
          year: '2024',
          title: '성공적인 협업 프로젝트',
          description: '다양한 분야의 아티스트들과 협업하여 융합적 창작의 가능성을 입증했습니다.',
          type: 'collaboration'
        }
      ]
    };

    // Customize content based on designer's role
    switch(designer.role) {
      case 'Creative Director':
        baseContent.specialties[0].description = '팀 전체의 창작 방향성을 이끌고 프로젝트의 일관된 비전을 구현합니다.';
        break;
      case 'Fashion Designer':
        baseContent.specialties[0].title = 'FASHION DESIGN';
        baseContent.specialties[0].description = '독창적인 패션 디자인을 통해 새로운 스타일과 트렌드를 제시합니다.';
        break;
      case 'Visual Artist':
        baseContent.specialties[0].title = 'VISUAL ART';
        baseContent.specialties[0].description = '시각 예술을 통해 독특한 미학적 경험과 감동을 전달합니다.';
        break;
      default:
        break;
    }

    return baseContent;
  };

  const content = getDesignerContent();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(219, 39, 119, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `
          }} />
        </div>

        {/* Back Button */}
        <Link
          href="/designers"
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-black/70 transition-all z-20"
        >
          <ArrowLeft size={20} />
          <span>Back to Designers</span>
        </Link>

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
            <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mr-6">
              <Palette className="w-12 h-12 text-purple-400" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-2">
                {designer.name}
              </h1>
              <p className="text-xl sm:text-2xl font-light text-gray-300">
                {designer.nameKo}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className="flex items-center justify-center gap-6 mb-8"
            variants={fadeInUp}
          >
            <span className="px-4 py-2 bg-purple-600/20 rounded-full text-purple-300 font-medium uppercase tracking-wider text-sm">
              {designer.role}
            </span>
            {designer.instagramHandle && (
              <a
                href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={18} />
                <span>{designer.instagramHandle}</span>
              </a>
            )}
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto mb-12"
            variants={fadeInUp}
          >
            <p className="text-base sm:text-lg leading-relaxed text-gray-400 mb-8">
              {designer.bio}
            </p>
          </motion.div>

          {/* Hero Profile Gallery - Admin can manage */}
          <motion.div 
            className="mt-16"
            variants={fadeInUp}
          >
            {isAdmin ? (
              <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-center">Hero Profile Gallery Management</h3>
                <InstagramStyleCMS
                  galleryId={`${designer.id}-hero`}
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
                      <Camera className="w-8 h-8 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 text-sm">Profile {index + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Design Philosophy Section */}
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
              {content.philosophy.title}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              {content.philosophy.description}
            </p>
            <blockquote className="border-l-4 border-purple-500 pl-6 italic text-lg sm:text-xl text-white max-w-3xl mx-auto">
              "{content.philosophy.quote}"
              <footer className="text-sm text-gray-400 mt-2">— {content.philosophy.author}</footer>
            </blockquote>
          </motion.div>

          {/* Philosophy Gallery */}
          {isAdmin ? (
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">Philosophy Gallery Management</h3>
              <InstagramStyleCMS
                galleryId={`${designer.id}-philosophy`}
                aspectRatio="16:9"
                columns={2}
                maxItems={4}
                allowedTypes={['image', 'video']}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[1, 2].map((_, index) => (
                <motion.div
                  key={index}
                  className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <Lightbulb className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                    <span className="text-gray-300">Philosophy {index + 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Specialties Section */}
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
              SPECIALTIES
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              전문 분야에서의 깊이 있는 경험과 독창적인 접근 방식을 통해 차별화된 창작물을 선보입니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.specialties.map((specialty, index) => (
              <motion.div
                key={specialty.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setActiveSection(activeSection === specialty.id ? null : specialty.id)}
              >
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
                  
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {specialty.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {specialty.title}
                  </h3>
                  
                  <h4 className="text-lg font-medium mb-4 text-gray-300">
                    {specialty.subtitle}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {specialty.description}
                  </p>

                  {/* Specialty Gallery */}
                  {isAdmin && activeSection === specialty.id ? (
                    <div className="mt-4">
                      <h5 className="text-xs font-medium mb-3 text-purple-400">Specialty Gallery</h5>
                      <InstagramStyleCMS
                        galleryId={specialty.galleryId}
                        aspectRatio="square"
                        columns={1}
                        maxItems={4}
                        allowedTypes={['image']}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    {activeSection === specialty.id && isAdmin ? 'Managing gallery ↑' : 'Click to explore →'}
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
              아이디어의 발상부터 완성된 작품까지, 체계적이고 창의적인 작업 과정을 통해 최고의 결과물을 창조합니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.process.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                  {index + 1}
                </div>
                
                <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {step.titleEn}
                  </h3>
                  
                  <h4 className="text-base font-medium mb-4 text-gray-300">
                    {step.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Process Gallery */}
                  {isAdmin ? (
                    <div className="mt-4">
                      <h5 className="text-xs font-medium mb-3 text-purple-400">Process Gallery</h5>
                      <InstagramStyleCMS
                        galleryId={step.galleryId}
                        aspectRatio="4:3"
                        columns={1}
                        maxItems={3}
                        allowedTypes={['image']}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 aspect-[4/3] bg-gray-800 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Connection Line */}
                {index < content.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-purple-500/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
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
              PORTFOLIO SHOWCASE
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              대표작들을 통해 창작 세계의 깊이와 다양성을 경험해보세요.
            </p>
          </motion.div>

          {/* Portfolio Gallery */}
          {isAdmin ? (
            <div className="bg-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-center">Portfolio Gallery Management</h3>
              <InstagramStyleCMS
                galleryId={`${designer.id}-portfolio`}
                aspectRatio="auto"
                columns={3}
                maxItems={20}
                allowedTypes={['image', 'video']}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designer.portfolioImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:from-purple-900/20 group-hover:to-pink-900/20 transition-colors duration-500">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 text-sm">Work {index + 1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
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
              ACHIEVEMENTS
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              창작 여정에서 이룬 주요 성과와 의미 있는 순간들을 돌아봅니다.
            </p>
          </motion.div>

          <div className="space-y-8">
            {content.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="flex items-start gap-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center">
                    {achievement.type === 'milestone' && <Star className="w-8 h-8 text-purple-400" />}
                    {achievement.type === 'exhibition' && <Award className="w-8 h-8 text-purple-400" />}
                    {achievement.type === 'collaboration' && <Users className="w-8 h-8 text-purple-400" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-purple-400">{achievement.year}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs px-2 py-1 bg-purple-600/20 rounded-full text-purple-300 uppercase tracking-wider">
                      {achievement.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{achievement.description}</p>
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
              COLLABORATE WITH {designer.name.toUpperCase()}
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              창의적인 프로젝트나 협업 기회가 있으시다면 언제든 연락해 주세요. 함께 특별한 작품을 만들어가겠습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} />
                Start Collaboration
              </motion.a>
              
              {designer.instagramHandle && (
                <motion.a
                  href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram size={20} />
                  Follow on Instagram
                </motion.a>
              )}
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
          <h4 className="font-semibold text-purple-300 mb-2">Admin Mode: {designer.name} Page</h4>
          <div className="text-sm text-purple-200 space-y-1">
            <p>• Hero Gallery: 6 images</p>
            <p>• Philosophy Gallery: 4 media</p>
            <p>• Specialties: 3 galleries (4 images each)</p>
            <p>• Process: 4 stages (3 images each)</p>
            <p>• Portfolio: 20 media slots</p>
            <p>• Total: 42+ manageable media slots</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}