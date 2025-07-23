'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MemoryImage {
  id: string;
  src: string;
  alt: string;
  index: number;
}

// Available memory images from the public folder
const memoryImages: MemoryImage[] = [
  { id: '1', src: '/images/about/memory/IMG_3452.JPG', alt: 'Memory 1', index: 0 },
  { id: '2', src: '/images/about/memory/IMG_3454.JPG', alt: 'Memory 2', index: 1 },
  { id: '3', src: '/images/about/memory/IMG_3455.JPG', alt: 'Memory 3', index: 2 },
  { id: '4', src: '/images/about/memory/IMG_3481.JPG', alt: 'Memory 4', index: 3 },
  { id: '5', src: '/images/about/memory/IMG_3491.JPG', alt: 'Memory 5', index: 4 },
  { id: '6', src: '/images/about/memory/IMG_3492.JPG', alt: 'Memory 6', index: 5 },
  { id: '7', src: '/images/about/memory/IMG_3493.JPG', alt: 'Memory 7', index: 6 },
  { id: '8', src: '/images/about/memory/IMG_4339.JPG', alt: 'Memory 8', index: 7 },
  { id: '9', src: '/images/about/memory/IMG_4345.JPG', alt: 'Memory 9', index: 8 },
  { id: '10', src: '/images/about/memory/IMG_4348.JPG', alt: 'Memory 10', index: 9 },
  { id: '11', src: '/images/about/memory/IMG_4367.JPG', alt: 'Memory 11', index: 10 },
  { id: '12', src: '/images/about/memory/IMG_5380.JPG', alt: 'Memory 12', index: 11 },
  { id: '13', src: '/images/about/memory/IMG_5381.JPG', alt: 'Memory 13', index: 12 },
  { id: '14', src: '/images/about/memory/IMG_5382.JPG', alt: 'Memory 14', index: 13 },
  { id: '15', src: '/images/about/memory/IMG_5383.JPG', alt: 'Memory 15', index: 14 },
  { id: '16', src: '/images/about/memory/IMG_7103.jpeg', alt: 'Memory 16', index: 15 },
  { id: '17', src: '/images/about/memory/IMG_7146.jpeg', alt: 'Memory 17', index: 16 },
  { id: '18', src: '/images/about/memory/IMG_7272.jpeg', alt: 'Memory 18', index: 17 },
  { id: '19', src: '/images/about/memory/IMG_1728.jpeg', alt: 'Memory 19', index: 18 },
  { id: '20', src: '/images/about/memory/83C1CE7D-97A9-400F-9403-60E89979528A.jpg', alt: 'Memory 20', index: 19 }
];

export default function MemoryGalleryPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const adminSession = localStorage.getItem('redux_admin');
    setIsAdmin(adminSession === 'true');
  }, []);

  return (
    <main className="memory-page">
      {/* Navigation */}
      <nav className="memory-nav">
        <div className="nav-container">
          <div className="nav-left">
            <Link href="/about" className="back-button">
              ←
            </Link>
            <div className="page-title">MEMORY</div>
          </div>
          <Link href="/" className="logo">
            REDUX
          </Link>
        </div>
      </nav>

      {/* Gallery Container */}
      <div className="gallery-container">
        <div className="gallery-header">
          <h1 className="gallery-title">MEMORY</h1>
          <p className="gallery-subtitle">
            Archive & Experience
          </p>
          <div className="gallery-description">
            <p>
              우리의 기억은 개별적인 순간들이 모여 하나의 이야기를 만들어냅니다. 
              각각의 추억이 켜켜이 쌓여 REDUX의 정체성을 형성하고, 
              우리가 지향하는 창작의 방향성을 제시합니다.
            </p>
          </div>
        </div>

        {/* Professional Stack Gallery */}
        <div className="stack-gallery" data-redux-gallery="memory-main" data-manageable="true">
          {memoryImages.map((image) => (
            <div 
              key={image.id}
              className="stack-item"
              style={{ '--index': image.index } as any}
              data-manageable="memory-item"
              onClick={() => setSelectedImage(selectedImage === image.id ? null : image.id)}
            >
              <div className="stack-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="stack-image"
                  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="stack-overlay">
                  <div className="stack-content">
                    <div className="stack-number">{String(image.index + 1).padStart(2, '0')}</div>
                    <div className="stack-label">MEMORY</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="lightbox-image-wrapper">
              <Image
                src={memoryImages.find(img => img.id === selectedImage)?.src || ''}
                alt={memoryImages.find(img => img.id === selectedImage)?.alt || ''}
                fill
                className="lightbox-image"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .memory-page {
          min-height: 100vh;
          background: var(--primary-black);
          color: var(--primary-white);
        }

        .memory-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 40px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          border-bottom: 1px solid rgba(183, 175, 163, 0.1);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1600px;
          margin: 0 auto;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .back-button {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: var(--primary-white);
          text-decoration: none;
        }

        .back-button:hover {
          transform: translateX(-5px);
          color: var(--accent-mocha);
        }

        .page-title {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: var(--accent-mocha);
          text-transform: uppercase;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          color: var(--primary-white);
          text-decoration: none;
        }

        .logo:hover {
          opacity: 0.7;
          transform: scale(1.02);
        }

        .gallery-container {
          min-height: 100vh;
          padding: 120px 20px 60px;
          position: relative;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        .gallery-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.9;
          color: var(--primary-white);
          margin-bottom: 20px;
          text-shadow: 0 0 20px rgba(255,255,255,0.1);
        }

        .gallery-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-mocha);
          margin-bottom: 40px;
        }

        .gallery-description {
          max-width: 600px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 0.02em;
        }

        .stack-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .stack-item {
          position: relative;
          aspect-ratio: 4/3;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          will-change: transform, filter;
          animation: stackReveal 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          animation-delay: calc(0.5s + var(--index, 0) * 0.05s);
          animation-fill-mode: both;
          opacity: 0;
          transform: translateY(60px) rotateX(15deg);
          perspective: 1000px;
        }

        .stack-item:hover {
          transform: translateY(-10px) rotateX(0deg) scale(1.02);
          filter: brightness(1.1) saturate(1.1);
          box-shadow: 0 20px 60px rgba(183, 175, 163, 0.3);
        }

        .stack-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: var(--gray-dark);
          border: 1px solid rgba(183, 175, 163, 0.2);
        }

        .stack-image {
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .stack-item:hover .stack-image {
          transform: scale(1.05);
          filter: contrast(1.1) brightness(1.05);
        }

        .stack-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 20px;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .stack-item:hover .stack-overlay {
          opacity: 1;
        }

        .stack-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stack-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 24px;
          font-weight: 600;
          color: var(--accent-mocha);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .stack-label {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--primary-white);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards;
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          aspect-ratio: 4/3;
          background: var(--primary-black);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(183, 175, 163, 0.3);
        }

        .lightbox-close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.8);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .lightbox-close:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.1);
        }

        .lightbox-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .lightbox-image {
          object-fit: contain;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes stackReveal {
          0% {
            opacity: 0;
            transform: translateY(60px) rotateX(15deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .stack-overlay {
            opacity: 1;
            background: linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.6) 100%
            );
          }

          .stack-item:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
        }

        @media (max-width: 768px) {
          .memory-nav {
            padding: 15px 20px;
          }

          .nav-left {
            gap: 20px;
          }

          .page-title {
            font-size: 14px;
          }

          .logo {
            font-size: 20px;
          }

          .gallery-container {
            padding: 100px 15px 40px;
          }

          .gallery-header {
            margin-bottom: 60px;
          }

          .stack-gallery {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 10px;
          }

          .stack-item {
            aspect-ratio: 16/10;
          }

          .stack-overlay {
            padding: 15px;
          }

          .stack-number {
            font-size: 20px;
          }

          .stack-label {
            font-size: 10px;
          }

          .lightbox-content {
            max-width: 95vw;
            max-height: 80vh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-header,
          .stack-item {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .stack-item:hover {
            transform: none;
          }

          .stack-item:hover .stack-image {
            transform: none;
          }
        }

        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --gray-dark: #303030;
        }
      `}</style>
    </main>
  );
}