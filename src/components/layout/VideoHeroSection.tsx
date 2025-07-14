'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function VideoHeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        console.log('Video autoplay failed');
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black pt-16">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/VIDEO/main.mp4.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 1s' }}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          {/* Main Title */}
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight mb-6 text-white">
            REDUX
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4 font-light tracking-wide">
            KOREAN FASHION DESIGNER COLLECTIVE
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            실험적 패션과 비주얼 아트의 경계를 탐구하는 6인의 디자이너
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/designers">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                디자이너 만나기
              </button>
            </Link>

            <Link href="/exhibitions">
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors">
                전시 둘러보기
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/60 text-sm">Loading video...</p>
          </div>
        </div>
      )}
    </section>
  );
}