'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FeaturedWorks() {
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
            FEATURED WORKS
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            세계 최고 수준의 디자인 작품들을 만나보세요.
            각 디자이너의 독창적인 비전과 혁신적인 접근법이 담긴 프로젝트들입니다.
          </p>
        </motion.div>

        {/* Placeholder for works - 추후 구현 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-lg"
        >
          <p className="text-gray-400">작품 갤러리가 곧 공개됩니다</p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            함께 만들어가는 디자인의 미래
          </h3>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            REDUX와 함께 창의적 파트너십을 시작하세요.
            혁신적인 아이디어와 최고의 디자인 퀄리티로 프로젝트를 성공으로 이끌어드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              프로젝트 문의하기
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition-all"
            >
              더 알아보기
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}