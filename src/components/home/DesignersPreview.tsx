'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { designers } from '@/data/designers';
import { exhibitions } from '@/data/exhibitions';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import EditableImage from '@/components/admin/EditableImage';
import useContentStore from '@/store/useContentStore';

export default function DesignersPreview() {
  const { isAdmin } = useContentStore();
  
  // Combine designers and exhibitions for the showcase grid (matching HTML structure)
  const showcaseItems = [
    {
      type: 'designer' as const,
      id: 'kim-bomin',
      name: 'KIM BOMIN',
      role: 'Creative Director',
      image: '/images/designer-placeholder.jpg',
      href: '/designers/kim-bomin'
    },
    {
      type: 'designer' as const,
      id: 'park-parang',
      name: 'PARK PARANG',
      role: 'Visual Artist',
      image: '/images/designer-placeholder.jpg',
      href: '/designers/park-parang'
    },
    {
      type: 'designer' as const,
      id: 'lee-taehyeon',
      name: 'LEE TAEHYEON',
      role: 'Fashion Designer',
      image: '/images/designers/leetaehyeon/leetaehyeon-Profile.jpg',
      href: '/designers/lee-taehyeon'
    },
    {
      type: 'designer' as const,
      id: 'choi-eunsol',
      name: 'CHOI EUNSOL',
      role: 'Art Director',
      image: '/images/designers/choieunsol/choieunsol-Profile.jpeg',
      href: '/designers/choi-eunsol'
    },
    {
      type: 'designer' as const,
      id: 'hwang-jinsu',
      name: 'HWANG JINSU',
      role: 'Film Director',
      image: '/images/designer-placeholder.jpg',
      href: '/designers/hwang-jinsu'
    },
    {
      type: 'designer' as const,
      id: 'kim-gyeongsu',
      name: 'KIM GYEONGSU',
      role: 'Installation Artist',
      image: '/images/designer-placeholder.jpg',
      href: '/designers/kim-gyeongsu'
    },
    {
      type: 'exhibition' as const,
      id: 'cine-mode',
      name: 'CINE MODE',
      role: '2025.03',
      image: '/images/exhibition-placeholder.jpg',
      href: '/exhibitions#cine-mode'
    },
    {
      type: 'exhibition' as const,
      id: 'the-room',
      name: 'THE ROOM OF [ ]',
      role: '2025.12',
      image: '/images/exhibition-placeholder.jpg',
      href: '/exhibitions#the-room'
    }
  ];

  return (
    <section className="py-24 bg-white text-black">
      <div className="max-w-[1600px] mx-auto px-10">
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-light mb-5 tracking-[0.05em] uppercase"
            variants={fadeInUp}
          >
            SIX DESIGNERS, ONE VISION
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-sm tracking-[0.2em] uppercase"
            variants={fadeInUp}
          >
            Fashion Designer Collective
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-gray-200"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
        >
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              custom={index}
              className="relative group"
            >
              <Link href={item.href} className="block relative aspect-square overflow-hidden bg-black">
                {isAdmin ? (
                  <EditableImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onUpdate={(newSrc) => console.log('Update showcase image:', item.id, newSrc)}
                    category="showcase"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-all duration-600 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-xl font-light mb-2 tracking-[0.1em] uppercase">
                    {item.name}
                  </h3>
                  <p className="text-xs opacity-70 uppercase tracking-[0.15em]">
                    {item.role}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}