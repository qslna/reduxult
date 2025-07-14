'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const aboutSections = [
  {
    title: 'Visual Art',
    description: '시각적 장르의 예술적 표현의 경계를 탐험합니다',
    link: '/about/visual-art',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    title: 'Collective',
    description: '협업과 공동 창작을 통한 새로운 가능성을 발견합니다',
    link: '/about/collective',
    gradient: 'from-blue-600 to-teal-600',
  },
  {
    title: 'Fashion Film',
    description: '패션과 영상의 만남으로 스토리텔링을 완성합니다',
    link: '/about/fashion-film',
    gradient: 'from-teal-600 to-green-600',
  },
  {
    title: 'Installation',
    description: '공간과 관람객이 상호작용하는 통합 예술을 경험을 제공합니다',
    link: '/about/installation',
    gradient: 'from-green-600 to-orange-600',
  },
  {
    title: 'Memory',
    description: '기억과 시간의 흔적을 디자인으로 표현하는 이야기를 전합니다',
    link: '/about/memory',
    gradient: 'from-orange-600 to-red-600',
  },
];

export default function AboutShowcase() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">SCROLL</p>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">ABOUT</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            다섯 가지 커테고리로 구성된 창의적 영역에서
            혁신적인 디자인의 출투선을 탐구합니다
          </p>
        </div>

        {/* About Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutSections.map((section, index) => (
            <Link
              key={index}
              href={section.link}
              className="group relative overflow-hidden rounded-lg bg-gray-900 p-8 hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
                <p className="text-gray-400 mb-6">{section.description}</p>
                
                {/* Arrow Icon */}
                <div className="flex items-center text-gray-500 group-hover:text-white transition-colors">
                  <span className="mr-2">자세히 보기</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}