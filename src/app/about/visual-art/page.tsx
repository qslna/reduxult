'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ImageGallery from '@/components/ui/ImageGallery';
import EditableImage from '@/components/admin/EditableImage';
import { CATEGORIES } from '@/utils/constants';

type CategoryData = {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  coverImage: string;
  images: string[];
};

export default function VisualArtPage() {
  const category = CATEGORIES['visual-art'];
  const [categoryData, setCategoryData] = useState<CategoryData>({
    ...category,
    coverImage: category.coverImage,
    images: [...category.images] as string[]
  });

  const handleMainImageUpdate = (newSrc: string) => {
    setCategoryData(prev => ({ ...prev, coverImage: newSrc }));
  };

  const handleGalleryUpdate = (newImages: string[]) => {
    setCategoryData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="section-padding">
        <div className="container">
          {/* Back Button */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
          >
            <ArrowLeft size={20} />
            <span>Back to About</span>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="heading-1 mb-4">{categoryData.title}</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {categoryData.description}
            </p>
          </motion.div>

          {/* Main Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-900 mb-20"
          >
            <EditableImage
              src={categoryData.coverImage}
              alt={categoryData.title}
              className="object-cover"
              sizes="100vw"
              onUpdate={handleMainImageUpdate}
              category="about/visual-art/hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Art Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="heading-3 mb-6">Art Beyond Fashion</h2>
            <div className="space-y-6 text-gray-400">
              <p className="body-large">
                REDUX의 비주얼 아트는 패션과 순수 예술의 경계를 넘나드는 실험적 작업들로 구성됩니다. 
                우리는 의류를 캔버스로, 몸을 조각으로 인식하며, 
                착용 가능한 예술작품을 창조합니다.
              </p>
              <p className="body-large">
                각 작품은 개념적 접근과 시각적 실험을 통해 탄생합니다. 
                재료의 물성, 형태의 해체와 재구성, 색채의 심리학적 효과를 탐구하며, 
                관람자에게 새로운 미적 경험을 제공합니다.
              </p>
            </div>
          </motion.div>

          {/* Art Concepts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="heading-3 mb-8">Core Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-lg backdrop-blur-sm"
              >
                <Palette className="w-12 h-12 mb-4 text-white/70" />
                <h3 className="heading-4 mb-3">Material Exploration</h3>
                <p className="text-gray-400">
                  전통적인 소재와 혁신적인 신소재를 결합하여 
                  텍스처와 형태의 새로운 가능성을 탐구합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-lg backdrop-blur-sm"
              >
                <Eye className="w-12 h-12 mb-4 text-white/70" />
                <h3 className="heading-4 mb-3">Visual Narrative</h3>
                <p className="text-gray-400">
                  각 작품은 독립적인 이야기를 담고 있으며, 
                  착용자와 관람자 사이의 대화를 유도합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-lg backdrop-blur-sm"
              >
                <Sparkles className="w-12 h-12 mb-4 text-white/70" />
                <h3 className="heading-4 mb-3">Aesthetic Innovation</h3>
                <p className="text-gray-400">
                  기존의 미적 관념에 도전하며, 
                  새로운 아름다움의 기준을 제시합니다.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="heading-3 mb-8">Gallery</h2>
            <ImageGallery
              images={categoryData.images}
              columns={3}
              category="about/visual-art/gallery"
              editable
              onImagesUpdate={handleGalleryUpdate}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}