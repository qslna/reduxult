'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Instagram, Mail } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { buildImageKitUrl } from '@/lib/imagekit';
import { DESIGNERS } from '@/utils/constants';
import ProfileImage from '@/components/ui/ProfileImage';

const designersData = [
  {
    ...DESIGNERS.hwangjinsu,
    specialty: 'Experimental Fashion',
    experience: '6+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Hwang Jinsu.jpg',
      '/about/visual-art/Form & Void.png',
    ],
  },
  {
    ...DESIGNERS.choieunsol,
    specialty: 'Sustainable Fashion',
    experience: '5+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Choi Eunsol.jpeg',
      '/about/visual-art/Analog Memories.png',
    ],
  },
  {
    ...DESIGNERS.parkparang,
    specialty: 'Visual Art & Design',
    experience: '4+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Park Parang.jpg',
      '/about/visual-art/Digital Dreams.png',
    ],
  },
  {
    ...DESIGNERS.leetaehyeon,
    specialty: 'Creative Direction',
    experience: '7+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Lee Taehyeon.jpg',
      '/about/visual-art/Color Theory.png',
    ],
  },
  {
    ...DESIGNERS.kimbomin,
    specialty: 'Fashion & Editorial',
    experience: '4+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Kim Bomin.webp',
      '/about/visual-art/Metamorphosis.png',
    ],
  },
  {
    ...DESIGNERS.kimgyeongsu,
    specialty: 'Structural Design',
    experience: '5+ Years',
    location: 'Seoul, Korea',
    portfolioPreview: [
      '/images/profile/Kim Gyeongsu.webp',
      '/about/visual-art/Shadow Play.png',
    ],
  },
];

export default function DesignersPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <section ref={containerRef} className="relative py-20 bg-black overflow-hidden">
      {/* Background Elements */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        
        {/* Animated grid pattern */}
        <motion.div
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeIn}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              DESIGNERS
            </span>
          </motion.h2>
          
          <motion.p
            variants={fadeIn}
            className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
          >
            각자의 고유한 창의적 비전을 가진 6명의 디자이너가 
            <br className="hidden md:block" />
            함께 만들어가는 혁신적인 디자인 콜렉티브
          </motion.p>
        </motion.div>

        {/* Designers Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-20"
        >
          {designersData.map((designer, index) => (
            <motion.div
              key={designer.id}
              variants={fadeIn}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Designer Info */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="space-y-4">
                  <motion.div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium theme-${designer.theme}`}
                    style={{
                      backgroundColor: `${designer.colors.accent}20`,
                      color: designer.colors.accent,
                      border: `1px solid ${designer.colors.accent}40`,
                    }}
                  >
                    {designer.specialty}
                  </motion.div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    {designer.name}
                  </h3>
                  
                  <p className="text-lg text-gray-400 font-mono">
                    {designer.handle}
                  </p>
                  
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {designer.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      Experience
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {designer.experience}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                      Location
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {designer.location}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4 pt-4">
                  <Link href={`/designers/${designer.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                    >
                      포트폴리오 보기
                      <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    <motion.a
                      href={designer.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Instagram size={18} className="text-white" />
                    </motion.a>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <Mail size={18} className="text-white" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Designer Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Main profile with enhanced shadow */}
                  <div className="relative group flex items-center justify-center h-80 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8">
                    <ProfileImage
                      src={designer.profileImage}
                      alt={designer.name}
                      size="lg"
                      shadowColor={designer.colors.accent}
                      className="mx-auto"
                    />
                  </div>

                  {/* Portfolio thumbnails */}
                  <div className="absolute -bottom-6 -right-6 flex gap-3">
                    {designer.portfolioPreview.map((image, imgIndex) => (
                      <motion.div
                        key={imgIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: imgIndex * 0.1 }}
                        className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 bg-gray-900"
                      >
                        <Image
                          src={buildImageKitUrl(image, {
                            width: 80,
                            height: 80,
                            quality: 85,
                            format: 'webp'
                          })}
                          alt={`${designer.name} work ${imgIndex + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <Link href="/designers">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              모든 디자이너 만나보기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}