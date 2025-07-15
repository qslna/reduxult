'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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

export default function CollectivePage() {
  const category = CATEGORIES.collective;
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
              category="about/collective/hero"
            />
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <h2 className="heading-3 mb-6">Our Collective Vision</h2>
            <div className="space-y-6 text-gray-400">
              <p className="body-large">
                REDUX는 6인의 패션 디자이너가 모여 만든 창작 집단입니다. 
                우리는 각자의 고유한 시각과 스타일을 유지하면서도, 
                하나의 통합된 비전 아래 협업합니다.
              </p>
              <p className="body-large">
                패션을 넘어 예술, 문화, 사회와의 소통을 추구하며, 
                새로운 미학적 경험을 창조하고자 합니다. 
                우리의 작업은 단순한 의류 디자인을 넘어서, 
                착용자의 정체성과 이야기를 담아내는 매개체가 됩니다.
              </p>
              <p className="body-large">
                REDUX의 각 컬렉션은 서로 다른 배경과 관점을 가진 
                디자이너들의 대화와 실험을 통해 탄생합니다. 
                이러한 과정은 예측할 수 없는 창의적 시너지를 만들어내며, 
                한국 패션의 새로운 가능성을 제시합니다.
              </p>
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="heading-3 mb-6">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 p-8 rounded-lg">
                <h3 className="heading-4 mb-4">Research</h3>
                <p className="text-gray-400">
                  트렌드와 문화적 맥락을 연구하고, 각자의 영감을 공유하며 
                  컬렉션의 방향성을 설정합니다.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg">
                <h3 className="heading-4 mb-4">Collaboration</h3>
                <p className="text-gray-400">
                  개별 작업과 공동 작업을 병행하며, 지속적인 피드백과 
                  실험을 통해 작품을 발전시킵니다.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg">
                <h3 className="heading-4 mb-4">Creation</h3>
                <p className="text-gray-400">
                  최종 컬렉션은 개인의 창의성과 집단의 통합된 비전이 
                  조화롭게 어우러진 결과물입니다.
                </p>
              </div>
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
              columns={2}
              category="about/collective/gallery"
              editable
              onImagesUpdate={handleGalleryUpdate}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}