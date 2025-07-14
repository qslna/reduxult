'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ABOUT_SECTIONS } from '@/utils/constants';

export default function AboutList() {
  return (
    <section className="section-padding bg-black min-h-screen">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            ABOUT REDUX
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl">
            REDUX는 패션 디자인을 중심으로 다양한 예술 분야를 아우르는 창작 집단입니다. 
            우리는 경계를 넘나드는 실험적인 작업을 통해 새로운 미학을 탐구합니다.
          </p>
        </motion.div>

        {/* About Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ABOUT_SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/about/${section.id}`}
                className="group block"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-900 mb-4">
                  <Image
                    src={section.coverImage}
                    alt={section.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-1">{section.titleKo}</p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                  </div>
                </div>
                
                <p className="text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                  {section.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 pt-20 border-t border-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Our Philosophy</h3>
              <p className="text-gray-400">
                창의성과 혁신을 통해 패션과 예술의 경계를 허물고, 
                새로운 문화적 가치를 창출합니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Collaboration</h3>
              <p className="text-gray-400">
                다양한 분야의 아티스트들과 협업하여 
                통합적이고 실험적인 프로젝트를 진행합니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Vision</h3>
              <p className="text-gray-400">
                지속 가능한 창작 활동을 통해 
                미래 지향적인 패션 문화를 선도합니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}