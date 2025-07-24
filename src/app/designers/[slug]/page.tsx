'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { designers } from '@/data/designers';
import { Designer } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function DesignerPage({ params }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        const designerSlug = resolvedParams.slug;
        setSlug(designerSlug);
        
        const designerData = designers.find(d => d.id === designerSlug);
        if (!designerData) {
          notFound();
        }
        setDesigner(designerData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error resolving params:', error);
        notFound();
      }
    };
    
    getParams();
  }, [params]);

  useEffect(() => {
    if (!designer || isLoading) return;

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Profile animations
      gsap.fromTo('.profile-content', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );

      // Grid animations
      gsap.fromTo('.instagram-post', 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          ease: 'back.out(1.7)',
          stagger: {
            amount: 1.2,
            grid: "auto",
            from: "start"
          },
          scrollTrigger: {
            trigger: '.instagram-grid',
            start: 'top 80%',
            end: 'bottom 20%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, [designer, isLoading]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) {
        switch(event.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowRight':
            nextImage();
            break;
          case 'ArrowLeft':
            prevImage();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, designer]);

  // Navigation functions
  const goBack = () => router.push('/designers');
  const goHome = () => router.push('/');

  // Lightbox functions
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    if (designer) {
      setCurrentImageIndex(prev => (prev + 1) % designer.portfolioImages.length);
    }
  };

  const prevImage = () => {
    if (designer) {
      setCurrentImageIndex(prev => (prev - 1 + designer.portfolioImages.length) % designer.portfolioImages.length);
    }
  };

  const handleLightboxClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  const toggleLike = (index: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(index)) {
      newLikedPosts.delete(index);
    } else {
      newLikedPosts.add(index);
    }
    setLikedPosts(newLikedPosts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-['Inter'] text-sm tracking-wider text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!designer) {
    return null;
  }

  return (
    <>
      {/* Enhanced Instagram-style Navigation */}
      <nav className="fixed top-0 left-0 w-full py-3 px-4 bg-black/95 backdrop-blur-xl z-[1000] border-b border-white/10">
        <div className="flex justify-between items-center max-w-full mx-auto md:max-w-4xl lg:max-w-6xl px-2">
          <div className="flex items-center gap-4">
            <button 
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/20 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95"
              onClick={goBack}
              aria-label="Go back to designers"
            >
              <span className="text-lg">←</span>
            </button>
            <span className="font-['Inter'] text-lg font-semibold text-white truncate max-w-[200px]">
              {designer.name.toLowerCase().replace(' ', '')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-white rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
              aria-label="More options"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-black pt-16">
        {/* Enhanced Instagram-style Profile Header */}
        <section className="profile-content px-4 py-6">
          <div className="max-w-full mx-auto md:max-w-4xl lg:max-w-6xl px-2">
            <div className="flex items-start gap-4 md:gap-6 mb-6">
              {/* Enhanced Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black p-0.5">
                    <OptimizedImage 
                      src={designer.profileImage}
                      alt={`${designer.name} Profile`}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Enhanced Profile Info */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <h1 className="font-['Inter'] text-xl md:text-2xl font-semibold text-white truncate">
                    {designer.name.toLowerCase().replace(' ', '')}
                  </h1>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-4 md:px-6 py-2.5 min-h-[44px] bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all duration-300">
                      Follow
                    </button>
                    <button className="px-4 md:px-6 py-2.5 min-h-[44px] bg-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/30 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300">
                      Message
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Stats - Instagram style */}
                <div className="flex gap-4 md:gap-6 mb-4 text-sm md:text-base">
                  <div className="text-white">
                    <span className="font-semibold">{designer.portfolioImages.length}</span>
                    <span className="text-white/70 ml-1">posts</span>
                  </div>
                  <div className="text-white">
                    <span className="font-semibold">{Math.floor(Math.random() * 5000) + 1000}</span>
                    <span className="text-white/70 ml-1">followers</span>
                  </div>
                  <div className="text-white">
                    <span className="font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
                    <span className="text-white/70 ml-1">following</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Bio */}
            <div className="mb-6">
              <h2 className="font-['Inter'] text-sm font-semibold text-white mb-1">
                {designer.nameKo} • {designer.role}
              </h2>
              <p className="font-['Inter'] text-sm text-white/90 leading-relaxed mb-2">
                {designer.bio.slice(0, 120)}...
              </p>
              {designer.instagramHandle && (
                <a 
                  href={`https://instagram.com/${designer.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors min-h-[44px] inline-flex items-center"
                >
                  {designer.instagramHandle}
                </a>
              )}
            </div>
            
            {/* Enhanced Stories-style highlights with better touch targets */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide mb-6">
              <div className="flex-shrink-0 text-center">
                <button className="w-16 h-16 min-w-[44px] min-h-[44px] rounded-full border-2 border-white/30 flex items-center justify-center mb-1 bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 active:scale-95 transition-all duration-300">
                  <span className="text-white text-xs font-bold">NEW</span>
                </button>
                <span className="text-xs text-white/70">Latest</span>
              </div>
              {designer.videoUrl && (
                <div className="flex-shrink-0 text-center">
                  <button className="w-16 h-16 min-w-[44px] min-h-[44px] rounded-full border-2 border-white/30 flex items-center justify-center mb-1 bg-gradient-to-br from-orange-500 to-red-500 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95 transition-all duration-300">
                    <span className="text-white text-xs font-bold">FILM</span>
                  </button>
                  <span className="text-xs text-white/70">Films</span>
                </div>
              )}
              <div className="flex-shrink-0 text-center">
                <button className="w-16 h-16 min-w-[44px] min-h-[44px] rounded-full border-2 border-white/30 flex items-center justify-center mb-1 bg-gradient-to-br from-green-500 to-blue-500 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 active:scale-95 transition-all duration-300">
                  <span className="text-white text-xs font-bold">BTS</span>
                </button>
                <span className="text-xs text-white/70">Behind</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Instagram-style Tab Navigation */}
        <section className="border-t border-white/10 sticky top-16 z-40 bg-black">
          <div className="max-w-full mx-auto md:max-w-4xl lg:max-w-6xl px-4">
            <div className="flex justify-center">
              <button 
                className={`flex items-center gap-2 px-4 py-3 min-h-[44px] text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'posts' ? 'border-white text-white' : 'border-transparent text-white/60'
                } hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95`}
                onClick={() => setActiveTab('posts')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6zM3 19h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6z"/>
                </svg>
                POSTS
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Instagram-style Feed Grid */}
        <section className="instagram-grid pb-8">
          <div className="max-w-full mx-auto md:max-w-4xl lg:max-w-6xl px-2">
            <div className="grid grid-cols-3 gap-1 md:gap-2 lg:gap-3">
              {designer.portfolioImages.map((image: string, index: number) => (
                <div 
                  key={index}
                  className="instagram-post group relative overflow-hidden cursor-pointer bg-gray-900 aspect-square rounded-sm md:rounded-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  onClick={() => openLightbox(index)}
                >
                  <OptimizedImage 
                    src={image}
                    alt={`${designer.name} Post ${index + 1}`}
                    fill={true}
                    priority={index < 9}
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  
                  {/* Enhanced Instagram-style hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <svg className={`w-6 h-6 transition-colors ${
                          likedPosts.has(index) ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                        }`} viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-semibold">{Math.floor(Math.random() * 500) + 50}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-semibold">{Math.floor(Math.random() * 100) + 5}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Multiple photos indicator */}
                  {index % 5 === 0 && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Instagram-style Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black z-[10000] flex items-center justify-center transition-opacity duration-300"
          onClick={handleLightboxClick}
        >
          {/* Enhanced Mobile Instagram-style header */}
          <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <OptimizedImage 
                  src={designer.profileImage}
                  alt={designer.name}
                  fill={true}
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="text-white font-semibold text-sm">
                {designer.name.toLowerCase().replace(' ', '')}
              </span>
            </div>
            <button 
              className="text-white text-2xl w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
          </div>
          
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <OptimizedImage 
              src={designer.portfolioImages[currentImageIndex]}
              alt={`${designer.name} Post ${currentImageIndex + 1}`}
              width={800}
              height={800}
              priority={true}
              sizes="90vw"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          
          {/* Enhanced Instagram-style bottom actions */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button 
                  className="text-white transition-colors w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95"
                  onClick={() => toggleLike(currentImageIndex)}
                  aria-label="Like post"
                >
                  <svg className={`w-7 h-7 transition-colors ${
                    likedPosts.has(currentImageIndex) ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                  }`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  className="text-white w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
                  aria-label="Comment on post"
                >
                  <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button 
                  className="text-white w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
                  aria-label="Share post"
                >
                  <svg className="w-7 h-7 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <button 
                className="text-white w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
                aria-label="Save post"
              >
                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            
            <div className="text-white text-sm">
              <span className="font-semibold">{Math.floor(Math.random() * 1000) + 100} likes</span>
            </div>
            
            <div className="text-white/70 text-xs mt-2 text-center">
              {currentImageIndex + 1} / {designer.portfolioImages.length}
            </div>
          </div>
          
          {/* Enhanced Navigation arrows with better touch targets */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 focus:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl w-12 h-12 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 focus:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-95 transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Enhanced Instagram-style Custom Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Enhanced Instagram-style animations */
        .instagram-post {
          transition: transform 0.1s ease;
        }
        .instagram-post:active {
          transform: scale(0.95);
        }
        
        /* Enhanced Mobile optimizations */
        @media (max-width: 768px) {
          .instagram-grid {
            padding-bottom: 2rem;
          }
          
          /* Better grid spacing on small screens */
          .instagram-grid .grid {
            gap: 2px;
          }
          
          /* Enhanced profile section spacing */
          .profile-content {
            padding: 1rem;
          }
          
          /* Better button spacing on mobile */
          .profile-content .flex.gap-2 {
            gap: 0.5rem;
          }
          
          /* Improved text truncation */
          .truncate {
            max-width: 150px;
          }
        }
        
        @media (max-width: 480px) {
          /* Extra small screens optimization */
          .profile-content .px-4 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          /* Better button sizes on very small screens */
          .profile-content button {
            font-size: 0.75rem;
            padding: 0.625rem 0.75rem;
          }
          
          /* Tighter navigation spacing */
          nav .px-4 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
        
        /* Enhanced hover states for non-touch devices */
        @media (hover: hover) {
          .instagram-post:hover {
            transform: scale(1.02);
          }
        }
        
        /* Better accessibility focus states */
        *:focus {
          outline: none;
        }
        
        /* Enhanced dark mode compatibility */
        @media (prefers-color-scheme: dark) {
          .bg-black {
            background-color: #000;
          }
        }
      `}</style>
    </>
  );
}

// GSAP types
declare global {
  interface Window {
    gsap: any;
  }
}