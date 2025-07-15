'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DESIGNERS } from '@/utils/constants';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import EditableImage from '@/components/admin/EditableImage';

export default function DesignersPreview() {
  const [designers, setDesigners] = useState(DESIGNERS);
  const featuredDesigners = designers.filter(d => d.featured).slice(0, 3);

  const handleImageUpdate = (designerId: string, newImageUrl: string) => {
    setDesigners(prev => prev.map(designer => 
      designer.id === designerId 
        ? { ...designer, profileImage: newImageUrl }
        : designer
    ));
  };

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mb-12">
          <h2 className="heading-2 mb-4">Designers</h2>
          <p className="body-large text-gray-400">
            창의성과 열정으로 가득한 6인의 디자이너를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDesigners.map((designer, index) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link
                href={`/designers/${designer.id}`}
                className="block"
              >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 mb-4 card-3d">
                <EditableImage
                  src={designer.profileImage}
                  alt={designer.name}
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  onUpdate={(newSrc) => handleImageUpdate(designer.id, newSrc)}
                  category={`designers/${designer.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm text-gray-300 mb-2">{designer.bio.split('.')[0]}.</p>
                  <div className="flex items-center text-sm text-white font-medium">
                    <span>View Portfolio</span>
                    <ArrowUpRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-gray-300 transition-colors text-shimmer">
                {designer.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">{designer.nameKo}</p>
              <p className="text-sm text-gray-400 mb-3">{designer.role}</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                <Instagram size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                <span className="underline-effect">@{designer.instagramHandle}</span>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/designers"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-medium rounded-md hover:bg-white hover:text-black transition-all duration-300 hover-border-dance group"
            >
              <span>View All Designers</span>
              <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}