'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Instagram, Mail } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { buildImageKitUrl } from '@/lib/imagekit';
import { DESIGNERS } from '@/utils/constants';
import ProfileImage from '@/components/ui/ProfileImage';

interface ExtendedDesigner {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  portfolioImage: string;
  stats: {
    projects: number;
    exhibitions: number;
    awards: number;
  };
  featured: boolean;
}

const designersData: ExtendedDesigner[] = [
  {
    ...DESIGNERS.kimbomin,
    id: 'kimbomin',
    nameEn: 'Kim Bomin',
    role: 'Fashion & Editorial Designer',
    specialty: 'Fashion Design & Editorial Direction',
    bio: '미니멀하면서도 강렬한 디자인 철학을 바탕으로 현대적 감각의 패션을 창조합니다.',
    image: DESIGNERS.kimbomin.profileImage,
    portfolioImage: '/images/designers/kimbomin/portfolio/KakaoTalk_Photo_2025-06-28-13-18-36 001.jpeg',
    stats: { projects: 24, exhibitions: 8, awards: 5 },
    featured: true
  },
  {
    ...DESIGNERS.choieunsol,
    id: 'choieunsol',
    nameEn: 'Choi Eunsol',
    role: 'Sustainable Fashion Designer',
    specialty: 'Sustainable Fashion & Innovation',
    bio: '지속가능한 패션을 추구하며, 혁신적인 소재와 디자인으로 미래를 그려갑니다.',
    image: DESIGNERS.choieunsol.profileImage,
    portfolioImage: '/images/designers/choieunsol/cinemode/IMG_8617.jpeg',
    stats: { projects: 18, exhibitions: 6, awards: 3 },
    featured: true
  },
  {
    ...DESIGNERS.leetaehyeon,
    id: 'leetaehyeon',
    nameEn: 'Lee Taehyeon',
    role: 'Creative Director',
    specialty: 'Creative Direction & Visual Art',
    bio: '기하학적 형태와 구조를 탐구하며 창의적 비전을 현실로 만드는 디자이너입니다.',
    image: DESIGNERS.leetaehyeon.profileImage,
    portfolioImage: '/images/designers/leetaehyeon/portfolio/15.png',
    stats: { projects: 16, exhibitions: 4, awards: 2 },
    featured: false
  },
  {
    ...DESIGNERS.kimgyeongsu,
    id: 'kimgyeongsu',
    nameEn: 'Kim Gyeongsu',
    role: 'Structural Designer',
    specialty: 'Structural Design & Space',
    bio: '공간과 구조의 관계를 탐구하며 새로운 디자인 가능성을 제시하는 디자이너입니다.',
    image: DESIGNERS.kimgyeongsu.profileImage,
    portfolioImage: '/images/designers/kimgyeongsu/portfolio/IMG_5484.HEIC',
    stats: { projects: 12, exhibitions: 7, awards: 4 },
    featured: false
  },
  {
    ...DESIGNERS.hwangjinsu,
    id: 'hwangjinsu',
    nameEn: 'Hwang Jinsu',
    role: 'Experimental Fashion Designer',
    specialty: 'Experimental Fashion & Innovation',
    bio: '실험적 접근을 통해 패션의 새로운 가능성을 탐구하는 디자이너입니다.',
    image: DESIGNERS.hwangjinsu.profileImage,
    portfolioImage: '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg',
    stats: { projects: 20, exhibitions: 5, awards: 6 },
    featured: true
  },
  {
    ...DESIGNERS.parkparang,
    id: 'parkparang',
    nameEn: 'Park Parang',
    role: 'Visual Artist & Designer',
    specialty: 'Visual Art & Graphic Design',
    bio: '시각 예술과 디자인의 경계를 넘나드는 창의적 작품을 선보이는 아티스트입니다.',
    image: DESIGNERS.parkparang.profileImage,
    portfolioImage: '/about/visual-art/Digital Dreams.png',
    stats: { projects: 22, exhibitions: 9, awards: 3 },
    featured: false
  }
];

export default function DesignersPage() {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const allDesignersRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isFeaturedInView = useInView(featuredRef, { once: true, margin: '-100px' });
  const isAllDesignersInView = useInView(allDesignersRef, { once: true, margin: '-100px' });

  const featuredDesigners = designersData.filter(d => d.featured);
  const allDesigners = designersData;

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-900 via-black to-gray-800" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                DESIGNERS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
              각자의 고유한 창의적 비전을 가진 6명의 디자이너가
              <br className="hidden md:block" />
              함께 만들어가는 혁신적인 디자인 콜렉티브
            </p>
            <div className="w-24 h-px bg-white mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-white mb-10">
              각자의 길에서 만난 6명의 창조자
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-gray-400">
              <p>
                REDUX의 6명의 디자이너는 각자 다른 배경과 전문성을 가지고 있지만,
                창의적 비전과 혁신적 사고라는 공통점으로 하나가 되었습니다.
              </p>
              <p>
                패션부터 영상, 설치 미술까지 다양한 분야에서 활동하며
                서로의 작업에 영감을 주고받으며 함께 성장해나가고 있습니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Designers */}
      <section className="py-16 md:py-24 bg-gray-950" ref={featuredRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light tracking-wider text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Featured Artists
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredDesigners.map((designer, index) => (
              <motion.div
                key={designer.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isFeaturedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Link href={`/designers/${designer.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6">
                      <Image
                        src={buildImageKitUrl(designer.portfolioImage, {
                          width: 600,
                          height: 800,
                          quality: 85,
                          format: 'webp'
                        })}
                        alt={designer.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-white text-sm opacity-90 leading-relaxed">
                            {designer.bio}
                          </p>
                        </div>
                      </div>
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        FEATURED
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-serif text-2xl font-medium mb-2 group-hover:text-gray-300 transition-colors">
                        {designer.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{designer.role}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-wider">
                        {designer.specialty}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Designers Grid */}
      <section className="py-16 md:py-24 bg-black" ref={allDesignersRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-wider text-center text-white mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isAllDesignersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Meet The Team
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allDesigners.map((designer, index) => (
              <motion.div
                key={designer.id}
                className="group"
                initial={{ opacity: 0, y: 60 }}
                animate={isAllDesignersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/designers/${designer.id}`}>
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-800">
                    {/* Profile Image with shadow effect */}
                    <div className="relative flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
                      <ProfileImage
                        src={designer.image}
                        alt={designer.name}
                        size="md"
                        shadowColor={(designer as any).colors?.accent || '#666666'}
                        className="mx-auto"
                      />
                      
                      {/* Role Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        {designer.role}
                      </div>
                      
                      {/* Featured Badge */}
                      {designer.featured && (
                        <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-500 rounded-full text-xs font-medium text-black">
                          ★
                        </div>
                      )}
                    </div>
                    
                    {/* Designer Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gray-300 transition-colors">
                        {designer.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{designer.nameEn}</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {designer.specialty}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex justify-between text-xs text-gray-500 border-t border-gray-700 pt-4">
                        <span>{designer.stats.projects} Projects</span>
                        <span>{designer.stats.exhibitions} Shows</span>
                        <span>{designer.stats.awards} Awards</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-8">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                COLLABORATE WITH US
              </span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-12 text-gray-400">
              창의적 프로젝트를 함께 만들어보세요
            </p>
            <Link href="/contact">
              <motion.button
                className="px-8 py-4 border-2 border-white rounded-lg text-white font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get In Touch
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}