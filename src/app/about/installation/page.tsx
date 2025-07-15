'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Move3D, Zap } from 'lucide-react';
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
  installationProcess: string[];
};

export default function InstallationPage() {
  const category = CATEGORIES.installation;
  const [categoryData, setCategoryData] = useState<CategoryData>({
    ...category,
    coverImage: category.coverImage,
    installationProcess: category.processImages ? [...category.processImages] as string[] : []
  });

  const handleMainImageUpdate = (newSrc: string) => {
    setCategoryData(prev => ({ ...prev, coverImage: newSrc }));
  };

  const handleGalleryUpdate = (newImages: string[]) => {
    setCategoryData(prev => ({ ...prev, installationProcess: newImages }));
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
            className="relative aspect-[16/9] overflow-hidden rounded-lg bg-zinc-900 mb-20"
          >
            <EditableImage
              src={categoryData.coverImage}
              alt={categoryData.title}
              className="object-cover"
              sizes="100vw"
              onUpdate={handleMainImageUpdate}
              category="about/installation/hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          </motion.div>

          {/* Installation Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="heading-3 mb-6">Space as Canvas</h2>
            <div className="space-y-6 text-gray-400">
              <p className="body-large">
                REDUX의 인스톨레이션 작업은 패션이 공간과 만나는 지점을 탐구합니다. 
                우리는 의류를 단순한 착용물이 아닌, 공간을 변화시키는 조형 요소로 인식합니다.
              </p>
              <p className="body-large">
                각 인스톨레이션은 관람자의 움직임과 시선을 고려하여 설계됩니다. 
                빛, 그림자, 재료의 물성이 만들어내는 공간적 경험을 통해 
                패션의 새로운 차원을 제시합니다.
              </p>
              <p className="body-large">
                우리의 작업은 일시적이면서도 영구적인 인상을 남깁니다. 
                전시가 끝난 후에도 관람자의 기억 속에서 계속해서 진화하는 
                살아있는 예술작품이 되기를 희망합니다.
              </p>
            </div>
          </motion.div>

          {/* Installation Elements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="heading-3 mb-8">Key Elements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 p-8"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <Layers className="w-12 h-12 mb-4 text-white/80 relative z-10" />
                <h3 className="heading-4 mb-3 relative z-10">Layered Narratives</h3>
                <p className="text-gray-400 relative z-10">
                  다층적 구조를 통해 복합적인 의미를 전달하며, 
                  관람 각도에 따라 다른 이야기를 발견할 수 있습니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 p-8"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <Move3D className="w-12 h-12 mb-4 text-white/80 relative z-10" />
                <h3 className="heading-4 mb-3 relative z-10">Spatial Dynamics</h3>
                <p className="text-gray-400 relative z-10">
                  관람자의 움직임에 반응하는 동적 요소들이 
                  공간과 작품 사이의 상호작용을 유도합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 p-8"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <Zap className="w-12 h-12 mb-4 text-white/80 relative z-10" />
                <h3 className="heading-4 mb-3 relative z-10">Sensory Experience</h3>
                <p className="text-gray-400 relative z-10">
                  시각을 넘어 촉각, 청각적 요소를 결합하여 
                  총체적인 감각 경험을 제공합니다.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Process Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="heading-3 mb-4">Installation Process</h2>
            <p className="text-gray-400 mb-8">
              아이디어 스케치부터 최종 설치까지, 인스톨레이션의 전 과정을 기록했습니다.
            </p>
            <ImageGallery
              images={categoryData.installationProcess}
              columns={3}
              category="about/installation/process"
              editable
              onImagesUpdate={handleGalleryUpdate}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}