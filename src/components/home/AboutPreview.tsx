'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ABOUT_SECTIONS } from '@/utils/constants';

export default function AboutPreview() {
  return (
    <section className="section-padding bg-black">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            ABOUT
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            다섯 가지 카테고리로 구성된 창의적 영역에서
            혁신적인 디자인의 출발선을 탐구합니다
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ABOUT_SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/about/${section.id}`}
                className="group block bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                    <span>자세히 보기</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}