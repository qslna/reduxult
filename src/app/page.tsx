'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SafeHomePage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="text-center max-w-5xl px-6">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight mb-6 text-white">
            REDUX
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4">
            KOREAN FASHION DESIGNER COLLECTIVE
          </p>
          
          <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/designers" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
              디자이너 만나기
            </Link>
            
            <Link href="/exhibitions" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-colors">
              전시 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">ABOUT REDUX</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            세계 최고 수준의 디자인과 창의적 비전을 탐구하는 패션 컬렉티브입니다.
          </p>
        </div>
      </section>

      {/* Designers Section */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">DESIGNERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Hwang Jinsu', 'Choi Eunsol', 'Park Parang', 'Lee Taehyeon', 'Kim Bomin', 'Kim Gyeongsu'].map((name) => (
              <div key={name} className="bg-black p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-2">{name}</h3>
                <p className="text-gray-400">Fashion Designer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            함께 만들어가는 디자인의 미래
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            REDUX66에서 창의적 파트너십을 시작하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              프로젝트 문의하기
            </Link>
            
            <Link href="/about" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors">
              더 알아보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}