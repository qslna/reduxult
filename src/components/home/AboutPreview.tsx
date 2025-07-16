'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import useContentStore from '@/store/useContentStore';
import EditableImage from '@/components/admin/EditableImage';

export default function AboutPreview() {
  const { categories, updateCategoryImage } = useContentStore();
  
  // 첫 3개 카테고리만 표시
  const previewCategories = categories.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-black to-zinc-900">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-400" />
            <span className="text-sm tracking-[0.3em] text-gray-400 uppercase">Our Story</span>
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">About REDUX</h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다. 
            우리는 전통과 혁신, 개인과 집단, 예술과 상업의 경계를 넘나들며 
            새로운 창작의 가능성을 탐구합니다.
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {previewCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="group"
            >
              <Link
                href={`/about/${category.id}`}
                className="block relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 hover:border-white/30 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <EditableImage
                    src={category.coverImage || 'https://ik.imagekit.io/t914/redux/placeholder.jpg'}
                    alt={category.title}
                    className="transition-all duration-700 group-hover:scale-110 group-hover:brightness-75 w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    onUpdate={(newUrl) => updateCategoryImage(category.id, newUrl)}
                    category={`about-${category.id}`}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Category Number */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-lg font-bold">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 tracking-wider">{category.titleKo}</p>
                  <p className="text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                      Explore Category
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all">
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-500 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-all duration-300 group"
          >
            <span className="text-lg">Discover Our Journey</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}