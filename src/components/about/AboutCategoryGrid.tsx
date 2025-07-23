'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  index: number;
}

const categories: Category[] = [
  {
    id: 'collective',
    title: 'COLLECTIVE',
    description: 'Fashion Designer Collective',
    image: '/images/about/collective-placeholder.jpg',
    href: '/about/collective',
    index: 0
  },
  {
    id: 'visual-art',
    title: 'VISUAL ART',
    description: 'Art & Design',
    image: '/images/about/visual-art/Analog Memories.png',
    href: '/about/visual-art',
    index: 1
  },
  {
    id: 'fashion-film',
    title: 'FASHION FILM',
    description: 'Visual Storytelling',
    image: '/images/about/fashion-film-placeholder.jpg',
    href: '/about/fashion-film',
    index: 2
  },
  {
    id: 'installation',
    title: 'INSTALLATION',
    description: 'Process & Space',
    image: '/images/about/process/공간  연출.png',
    href: '/about/installation',
    index: 3
  },
  {
    id: 'memory',
    title: 'MEMORY',
    description: 'Archive & Experience',
    image: '/images/about/memory/IMG_3452.JPG',
    href: '/about/memory',
    index: 4
  }
];

export default function AboutCategoryGrid() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="about-main">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">ABOUT REDUX</h1>
          <p className="about-subtitle">FASHION DESIGNER COLLECTIVE</p>
          <p className="about-description">
            Six visionary designers exploring the boundaries of fashion, art, and digital expression
          </p>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-container">
          <div className="categories-header">
            <h2 className="categories-title">EXPLORE OUR WORLD</h2>
            <p className="categories-subtitle">Five dimensions of creative expression</p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={category.href}
                className="category-item"
                style={{ '--index': category.index } as any}
              >
                <div className="category-image-wrapper">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="category-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="category-overlay">
                    <div className="category-content">
                      <h3 className="category-title">{category.title}</h3>
                      <p className="category-description">{category.description}</p>
                      <div className="category-arrow">→</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-main {
          min-height: 100vh;
          background: var(--primary-white);
        }

        .about-hero {
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-black);
          position: relative;
          overflow: hidden;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 20%, rgba(183, 175, 163, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(212, 204, 197, 0.1) 0%, transparent 50%);
          opacity: 0.7;
        }

        .about-hero-content {
          text-align: center;
          z-index: 2;
          position: relative;
          max-width: 800px;
          padding: 0 20px;
        }

        .about-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(3rem, 8vw, 5rem);
          letter-spacing: -0.02em;
          line-height: 0.9;
          color: var(--primary-white);
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          animation-delay: 0.2s;
        }

        .about-subtitle {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-mocha);
          margin-bottom: 30px;
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          animation-delay: 0.4s;
        }

        .about-description {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.6;
          color: var(--primary-white);
          opacity: 0;
          animation: fadeInUp 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          animation-delay: 0.6s;
        }

        .categories-section {
          padding: 120px 40px;
          background: var(--primary-white);
        }

        .categories-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .categories-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .categories-title {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: var(--primary-black);
          margin-bottom: 20px;
        }

        .categories-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: var(--gray-medium);
          letter-spacing: 1px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .category-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          will-change: transform, filter;
          animation: fadeInSequential 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          animation-delay: calc(0.8s + var(--index, 0) * 0.1s);
          animation-fill-mode: both;
          opacity: 0;
        }

        .category-item:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .category-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--gray-light);
        }

        .category-image {
          object-fit: cover;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .category-item:hover .category-image {
          transform: scale(1.05);
          filter: brightness(1.1) saturate(1.1);
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.6) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 30px;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .category-item:hover .category-overlay {
          opacity: 1;
        }

        .category-content {
          color: white;
          width: 100%;
        }

        .category-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1.5rem;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .category-description {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          opacity: 0.9;
          letter-spacing: 0.05em;
          margin-bottom: 15px;
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          transition-delay: 0.1s;
        }

        .category-arrow {
          font-size: 1.5rem;
          font-weight: 300;
          transform: translateY(20px) translateX(-10px);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          transition-delay: 0.2s;
          opacity: 0;
        }

        .category-item:hover .category-title,
        .category-item:hover .category-description {
          transform: translateY(0);
        }

        .category-item:hover .category-arrow {
          transform: translateY(0) translateX(0);
          opacity: 1;
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

        @keyframes fadeInSequential {
          0% {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .category-overlay {
            opacity: 1;
            background: linear-gradient(
              135deg,
              rgba(0, 0, 0, 0.5) 0%,
              rgba(0, 0, 0, 0.7) 100%
            );
          }

          .category-title,
          .category-description,
          .category-arrow {
            transform: translateY(0);
            opacity: 1;
          }

          .category-item:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
        }

        @media (max-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .about-hero {
            height: 50vh;
          }

          .categories-section {
            padding: 80px 20px;
          }

          .categories-header {
            margin-bottom: 60px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .category-item {
            aspect-ratio: 16/10;
          }

          .category-overlay {
            padding: 20px;
          }

          .category-title {
            font-size: 1.25rem;
          }

          .category-description {
            font-size: 0.8rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-title,
          .about-subtitle,
          .about-description,
          .category-item {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
          }

          .category-item:hover {
            transform: none;
          }

          .category-item:hover .category-image {
            transform: none;
          }
        }

        :root {
          --primary-black: #000000;
          --primary-white: #FFFFFF;
          --accent-mocha: #B7AFA3;
          --accent-warm: #D4CCC5;
          --gray-light: #F8F8F8;
          --gray-medium: #A0A0A0;
        }
      `}</style>
    </main>
  );
}