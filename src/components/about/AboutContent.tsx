'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/utils/constants';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';

interface CategoryState {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  coverImage: string;
  images?: readonly string[];
  processImages?: readonly string[];
  videoUrl?: string;
}

export default function AboutContent() {
  const [categories, setCategories] = useState<CategoryState[]>(() => 
    Object.values(CATEGORIES).map(cat => ({
      ...cat,
      coverImage: cat.coverImage || ''
    }))
  );

  const handleImageUpdate = (categoryId: string, newImageUrl: string) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, coverImage: newImageUrl }
        : category
    ));
  };

  return (
    <section className="section-padding">
      <div className="container">
        {/* Philosophy Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="heading-3 mb-8 text-center">Our Philosophy</h2>
          <div className="space-y-6 text-gray-400">
            <p className="body-large">
              REDUX는 2024년 설립된 패션과 예술의 창작 집단입니다. 
              6인의 디자이너가 모여 각자의 독창성을 바탕으로 협업하며, 
              패션의 새로운 가능성을 탐구합니다.
            </p>
            <p className="body-large">
              우리는 단순히 옷을 만드는 것을 넘어서, 착용자의 정체성을 표현하고 
              일상에 예술적 가치를 더하는 작품을 창조합니다. 
              전통과 혁신, 개인과 집단, 예술과 상업의 경계를 자유롭게 넘나들며 
              새로운 패션 문화를 만들어갑니다.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-20">
          <h2 className="heading-3 mb-12 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const href = `/about/${category.id}`;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={href}
                    className="group block relative overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
                  >
                    {/* Category Image */}
                    {category.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <EditableImage
                          src={category.coverImage}
                          alt={category.title}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onUpdate={(newSrc) => handleImageUpdate(category.id, newSrc)}
                          category={`about/${category.id}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                      </div>
                    )}
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-gray-300 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-500 mb-2">{category.titleKo}</p>
                      <p className="text-gray-400 mb-6">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                        <span>Explore</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-3 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Creativity</h3>
              <p className="text-gray-400">
                창의성은 우리의 핵심 가치입니다. 
                기존의 틀을 깨고 새로운 시각으로 패션을 바라봅니다.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-gray-400">
                다양한 배경의 디자이너들이 협업하여 
                시너지를 창출하고 더 큰 가치를 만들어냅니다.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-400">
                전통적인 방식에 안주하지 않고 
                끊임없이 새로운 기술과 방법을 탐구합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}