'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowDown, Instagram, Mail, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import IntegratedGallery from '@/components/gallery/IntegratedGallery';
import { DESIGNERS } from '@/utils/constants';
import { useAdmin } from '@/hooks/useAdmin';
import ProfileImage from '@/components/ui/ProfileImage';

// Extended bio information for each designer
const designerBios: Record<string, string> = {
  leetaehyeon: '이태현은 REDUX의 멤버로서 기하학적 형태와 구조를 탐구하는 디자이너입니다. CINE MODE 전시에서는 "POLYHEDRON"이라는 작품을 통해 다면체의 구조와 이들이 움직일 때 생기는 파력의 양태의 경계를 탐구하며, 각도와 경계의 미묘한 순간들을 표현했습니다.',
  kimbomin: '김보민은 REDUX의 멤버로서 패션과 에디토리얼의 경계를 탐구하는 디자이너입니다. CINE MODE 전시에서는 "CHASING VOWS"라는 작품을 통해 약속과 헌신의 추상적인 상호작용을 표현했습니다.',
  parkparang: '박파랑은 디지털과 아날로그를 넘나드는 실험적 시각 예술가로, 기술과 예술의 경계에서 새로운 표현 방법을 탐구합니다. 네온 컬러와 글리치 효과를 활용한 독창적인 작품을 선보입니다.',
  choieunsol: '최은솔은 지속가능한 패션 디자인을 통해 환경과 사회적 메시지를 결합하는 디자이너입니다. 각 작품은 깊은 철학적 사고와 혁신적인 구조를 바탕으로 만들어집니다.',
  hwangjinsu: '황진수는 실험적 패션 디자인을 통해 전통적인 패션의 경계를 넘나드는 디자이너입니다. 기술과 예술의 경계에서 혁신적인 작품을 선보이며, 새로운 가능성을 탐구합니다.',
  kimgyeongsu: '김경수는 구조적 디자인을 통해 공간과 관람객의 상호작용을 탐구하는 디자이너입니다. 각 설치 작품은 공간의 새로운 의미를 발견하고 경험을 재정의합니다.',
};

interface DesignerDetailClientProps {
  designerId: string;
}

export default function DesignerDetailClient({ designerId }: DesignerDetailClientProps) {
  const router = useRouter();
  const designer = DESIGNERS[designerId as keyof typeof DESIGNERS];
  const { isAdmin } = useAdmin();

  if (!designer) {
    notFound();
  }

  const handleBackClick = () => {
    router.push('/designers');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with designer color */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 40%, ${designer.colors.primary}40 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${designer.colors.primary}20 0%, transparent 50%)`
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackClick}
            className="flex items-center gap-2 mb-8 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>디자이너 목록으로</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Designer Info */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center lg:text-left"
            >
              {/* Profile Image */}
              <motion.div 
                variants={fadeIn}
                className="w-32 h-32 mx-auto lg:mx-0 mb-6"
              >
                <ProfileImage
                  src={designer.profileImage}
                  alt={designer.nameKo}
                  size="xl"
                  shadowColor={designer.colors.primary}
                />
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
                style={{ color: designer.colors.primary }}
              >
                {designer.nameKo}
              </motion.h1>
              
              <motion.h2
                variants={fadeIn}
                className="text-xl md:text-2xl text-gray-300 mb-6"
              >
                {designer.nameEn}
              </motion.h2>

              <motion.p
                variants={fadeIn}
                className="text-lg text-gray-400 mb-8 leading-relaxed"
              >
                {designer.role}
              </motion.p>

              <motion.p
                variants={fadeIn}
                className="text-gray-300 leading-relaxed max-w-2xl mb-8"
              >
                {designerBios[designer.id] || designer.description}
              </motion.p>

              {/* Contact Links */}
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  href={designer.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>@{designer.instagramHandle}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <a
                  href={`mailto:info@redux.com`}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>연락하기</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right side - Featured Work */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="flex justify-center lg:justify-end"
            >
              <IntegratedGallery
                folder={`${designer.id}-portfolio`}
                layout="stack"
                maxItems={5}
                title="Featured Works"
                className="w-full max-w-sm"
                stackStyle="spread"
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

      {/* Gallery Sections */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              작품 갤러리
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {designer.nameKo}의 다양한 작품들을 만나보세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Portfolio Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <h3 className="text-xl font-bold mb-6 text-center">Portfolio</h3>
              <IntegratedGallery
                folder={`${designer.id}-portfolio`}
                layout="grid"
                columns={2}
                className="bg-gray-900/30 rounded-xl p-6"
              />
            </motion.div>

            {/* Cinemode Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-6 text-center">Cinemode</h3>
              <IntegratedGallery
                folder={`${designer.id}-cinemode`}
                layout="grid"
                columns={2}
                className="bg-gray-900/30 rounded-xl p-6"
              />
            </motion.div>

            {/* Showcase Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-6 text-center">Showcase</h3>
              <IntegratedGallery
                folder={`${designer.id}-showcase`}
                layout="grid"
                columns={2}
                className="bg-gray-900/30 rounded-xl p-6"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              디자인 철학
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {designerBios[designer.id] || designer.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/30 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3" style={{ color: designer.colors.primary }}>
                  전문 분야
                </h3>
                <p className="text-gray-400">{designer.role}</p>
              </div>
              
              <div className="bg-gray-900/30 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-3" style={{ color: designer.colors.primary }}>
                  협업 문의
                </h3>
                <p className="text-gray-400">
                  <a 
                    href={`mailto:info@redux.com`}
                    className="hover:text-white transition-colors"
                  >
                    info@redux.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}