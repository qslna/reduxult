'use client';

import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Use ImageKit CDN for video
  const videoUrl = 'https://ik.imagekit.io/t914/redux/videos/main-hero.mp4';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 z-10" />
      
      {/* Hero Content */}
      <div className="container relative z-20 text-center">
        <h1 
          className={`text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider mb-6 transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } text-glow`}
          style={{
            textShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.3)'
          }}
        >
          REDUX
        </h1>
        <p 
          className={`text-xl md:text-2xl text-gray-200 tracking-widest uppercase transition-all duration-1000 delay-300 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Fashion & Art Collective
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1 hover:border-white/50 transition-colors">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
      
      {/* Loading Overlay */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-black z-30 transition-opacity duration-1000" />
      )}
    </section>
  );
}