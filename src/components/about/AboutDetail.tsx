'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Grid, Maximize2, X } from 'lucide-react';
import { AboutSection } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';

interface Props {
  section: AboutSection;
}

export default function AboutDetail({ section }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [images, setImages] = useState<string[]>(section.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagesUpdate = (newImages: string[]) => {
    setImages(newImages);
    // TODO: API 호출로 서버에 저장
  };

  // 관련 섹션 찾기
  const relatedSections = [
    'collective',
    'visual-art',
    'fashion-film',
    'installation',
    'memory'
  ]
    .filter(id => id !== section.id)
    .slice(0, 2);

  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container">
        {/* Back Button */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to About</span>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {section.title}
          </h1>
          <p className="text-xl text-gray-400 mb-2">{section.titleKo}</p>
          <p className="text-lg text-gray-500 max-w-3xl">
            {section.description}
          </p>

          {/* Admin Mode Toggle */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              {isAdmin ? 'Exit Admin' : 'Admin Mode'}
            </button>
          )}
        </motion.div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video overflow-hidden rounded-lg bg-gray-900 mb-16"
        >
          <Image
            src={section.coverImage}
            alt={section.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Content Based on Section Type */}
        <div className="space-y-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              {getDetailedDescription(section.id)}
            </p>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-8">Gallery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-900 group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${section.title} ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={16} />
                  </div>
                </motion.div>
              ))}
              
              {/* Admin: Add Images */}
              {isAdmin && (
                <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <ImageUploader
                    currentImages={images}
                    onImagesChange={handleImagesUpdate}
                    folder={`about/${section.id}`}
                    aspectRatio="4/3"
                    multiple
                    maxImages={20}
                  />
                </div>
              )}
            </div>

            {/* Empty State */}
            {images.length === 0 && !isAdmin && (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-lg">
                <Grid className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">갤러리가 곧 공개됩니다</p>
              </div>
            )}
          </motion.div>

          {/* Related Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-16 border-t border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-8">Explore More</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedSections.map((relatedId) => {
                const relatedTitle = relatedId.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return (
                  <Link
                    key={relatedId}
                    href={`/about/${relatedId}`}
                    className="group block p-6 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all"
                  >
                    <h4 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                      {relatedTitle}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      더 알아보기 →
                    </p>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Fullscreen view"
              width={1920}
              height={1080}
              className="object-contain max-h-full"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}

// 섹션별 상세 설명
function getDetailedDescription(sectionId: string): string {
  const descriptions: Record<string, string> = {
    'collective': `REDUX Collective는 다양한 배경을 가진 창작자들이 모여 만든 실험적인 프로젝트입니다. 
    패션 디자이너, 비주얼 아티스트, 영상 감독, 그리고 설치 미술가들이 함께 작업하며, 
    각자의 전문성을 바탕으로 장르의 경계를 넘나드는 혁신적인 작품을 만들어갑니다. 
    우리는 개인의 창의성과 집단의 시너지가 만나는 지점에서 새로운 예술적 가능성을 발견합니다.`,
    
    'visual-art': `시각 예술은 REDUX의 핵심 표현 방식 중 하나입니다. 
    전통적인 회화와 조각에서부터 디지털 아트와 미디어 아트까지, 
    다양한 매체를 활용하여 현대적인 미학을 탐구합니다. 
    특히 패션과 순수 예술의 경계를 허물고, 웨어러블 아트와 같은 새로운 형태의 작품을 선보입니다.`,
    
    'fashion-film': `패션 필름은 의상의 움직임과 이야기를 영상으로 담아내는 예술입니다. 
    REDUX는 단순한 상품 홍보를 넘어서, 패션을 통해 감정과 내러티브를 전달하는 
    시네마틱한 작품을 만듭니다. 각 필름은 독특한 시각적 언어와 음악, 
    그리고 퍼포먼스가 어우러진 종합 예술 작품입니다.`,
    
    'installation': `공간 설치 작업은 관람객과 작품이 직접적으로 상호작용하는 통합적인 예술 경험을 제공합니다. 
    REDUX의 인스톨레이션은 패션, 빛, 소리, 그리고 공간이 하나로 어우러져 
    몰입감 있는 환경을 만들어냅니다. 관람객은 단순한 구경꾼이 아닌, 
    작품의 일부가 되어 새로운 감각적 경험을 하게 됩니다.`,
    
    'memory': `기억은 REDUX 작업의 중요한 영감의 원천입니다. 
    개인적인 추억에서부터 집단적 기억까지, 시간의 흔적을 패션과 예술로 재해석합니다. 
    빈티지 소재의 재활용, 전통 기법의 현대적 재해석, 그리고 노스탤지어를 불러일으키는 
    디자인을 통해 과거와 현재, 미래를 연결하는 작품을 만들어갑니다.`,
  };

  return descriptions[sectionId] || '';
}