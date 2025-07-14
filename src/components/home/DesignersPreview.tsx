'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { DESIGNERS } from '@/utils/constants';

export default function DesignersPreview() {
  return (
    <section className="section-padding bg-gray-950">
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
            DESIGNERS
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            REDUX를 이끄는 6인의 창의적인 디자이너들을 만나보세요
          </p>
        </motion.div>

        {/* Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESIGNERS.map((designer, index) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/designers/${designer.id}`}
                className="group block"
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-900">
                  <Image
                    src={designer.profileImage}
                    alt={designer.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-gray-300 transition-colors">
                  {designer.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{designer.nameKo}</p>
                <p className="text-sm text-gray-400 mb-3">{designer.role}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {designer.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                  <Instagram size={16} className="mr-2" />
                  @{designer.instagramHandle}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            모든 디자이너 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}