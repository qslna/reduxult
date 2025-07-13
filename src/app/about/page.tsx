'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SimpleImageManager from '@/components/SimpleImageManager';

const aboutSections = [
  {
    title: 'Visual Art',
    href: '/about/visual-art',
    description: '순수 시각 예술의 탐구',
    image: '/images/about/visual-art/Digital Dreams.png'
  },
  {
    title: 'Memory',
    href: '/about/memory',
    description: '기억에 남을 순간들',
    image: '/images/about/memory/IMG_1728.jpeg'
  },
  {
    title: 'Collective',
    href: '/about/collective',
    description: '6인의 디자이너 크루',
    image: '/images/designers/kimbomin/cinemode/김보민 사진.jpg'
  },
  {
    title: 'Fashion Film',
    href: '/about/fashion-film',
    description: '패션필름을 통한 스토리텔링',
    image: '/images/designers/hwangjinsu/cinemode/⭐️NOR_7690.jpg'
  },
  {
    title: 'Installation',
    href: '/about/installation',
    description: '공간을 재정의하는 예술',
    image: '/images/about/process/공간  연출.png'
  }
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isSectionsInView = useInView(sectionsRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0">
          <SimpleImageManager
            src="/images/designers/kimbomin/cinemode/NOR_7419-11.jpg"
            alt="About Hero"
            fill
            className="object-cover"
            folder="about"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1.5 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-wider text-white mb-6">
              About
            </h1>
            <motion.p
              className="text-base md:text-lg text-white/90 uppercase tracking-[0.3em] font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            >
              창작의 다양한 면모
            </motion.p>
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
            <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-wide text-black mb-10">
              REDUX가 탐구하는 창작의 영역들
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-gray-700">
              <p>
                REDUX는 단순한 패션 디자인을 넘어 다양한 창작 분야를 아우르는 크리에이티브 콜렉티브입니다.
                시각 예술부터 설치 미술, 패션 필름까지 경계 없는 창작을 추구합니다.
              </p>
              <p>
                각각의 영역에서 우리만의 독특한 관점과 접근법으로 새로운 예술적 가능성을 탐구하며,
                관객에게 깊이 있는 경험을 제공하고자 합니다.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Sections */}
      <section className="py-16 md:py-24 bg-gray-50" ref={sectionsRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-light tracking-wider text-center text-black mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isSectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Explore Our Work
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 60 }}
                animate={isSectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={section.href}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-6">
                      <SimpleImageManager
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        folder="about"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                    </div>
                    
                    <h3 className="font-serif text-2xl font-medium text-black mb-3 group-hover:text-gray-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wider text-white mb-16">
              Our Philosophy
            </h2>
            <div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed">
              <p>
                "창작은 <span className="text-gray-400 italic">경계</span>를 허무는 것이다"
              </p>
              <p>
                "예술은 <span className="text-gray-400 italic">소통</span>의 언어다"
              </p>
              <p>
                "함께할 때 우리는 <span className="text-gray-400 italic">더 큰 가능성</span>을 발견한다"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}