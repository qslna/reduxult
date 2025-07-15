'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Heart, Archive } from 'lucide-react';
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

export default function MemoryPage() {
  const category = CATEGORIES.memory;
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
            className="relative aspect-[16/9] overflow-hidden rounded-lg bg-zinc-900 mb-20"
          >
            <EditableImage
              src={categoryData.coverImage}
              alt={categoryData.title}
              className="object-cover"
              sizes="100vw"
              onUpdate={handleMainImageUpdate}
              category="about/memory/hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-12">
              <h2 className="text-4xl font-bold mb-2">Archive of Moments</h2>
              <p className="text-xl text-gray-300">Preserving the ephemeral beauty of fashion</p>
            </div>
          </motion.div>

          {/* Memory Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="heading-3 mb-6">The Art of Remembering</h2>
            <div className="space-y-6 text-gray-400">
              <p className="body-large">
                REDUX의 Memory 아카이브는 우리가 걸어온 창작의 여정을 기록합니다. 
                각각의 이미지는 특정한 순간의 감정과 영감, 그리고 이야기를 담고 있습니다.
              </p>
              <p className="body-large">
                패션은 일시적이지만, 그것이 만들어내는 기억은 영원합니다. 
                우리는 컬렉션의 제작 과정, 런웨이의 순간들, 그리고 
                작품이 살아 숨 쉬는 모든 순간을 포착하여 보존합니다.
              </p>
              <p className="body-large">
                이 아카이브는 단순한 과거의 기록이 아닌, 
                미래의 창작을 위한 영감의 원천입니다. 
                과거와 현재, 그리고 미래가 만나는 지점에서 
                새로운 이야기가 시작됩니다.
              </p>
            </div>
          </motion.div>

          {/* Memory Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="heading-3 mb-8">Captured Moments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white/5 to-transparent p-8 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Clock className="w-10 h-10 mb-4 text-white/60 group-hover:text-white/80 transition-colors" />
                <h3 className="heading-4 mb-3">Process</h3>
                <p className="text-gray-400 text-sm">
                  스케치에서 완성까지, 창작의 모든 단계를 기록합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white/5 to-transparent p-8 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Heart className="w-10 h-10 mb-4 text-white/60 group-hover:text-white/80 transition-colors" />
                <h3 className="heading-4 mb-3">Emotions</h3>
                <p className="text-gray-400 text-sm">
                  작품에 담긴 감정과 이야기를 시각적으로 전달합니다.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-white/5 to-transparent p-8 border border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Archive className="w-10 h-10 mb-4 text-white/60 group-hover:text-white/80 transition-colors" />
                <h3 className="heading-4 mb-3">Legacy</h3>
                <p className="text-gray-400 text-sm">
                  REDUX의 역사와 진화를 담은 시간의 기록입니다.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Extensive Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="heading-3 mb-4">Memory Archive</h2>
            <p className="text-gray-400 mb-8">
              2019년부터 현재까지, REDUX의 모든 순간들을 담았습니다.
            </p>
            <ImageGallery
              images={categoryData.images}
              columns={4}
              category="about/memory/archive"
              editable
              onImagesUpdate={handleGalleryUpdate}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}