'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ShowcaseItem {
  id: string;
  name: string;
  role: string;
  image: string;
  href: string;
  type: 'designer' | 'exhibition';
  index: number;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'kimbomin',
    name: 'KIM BOMIN',
    role: 'Creative Director',
    image: '/images/designer-placeholder.jpg',
    href: '/designers/kimbomin',
    type: 'designer',
    index: 0
  },
  {
    id: 'parkparang',
    name: 'PARK PARANG',
    role: 'Visual Artist',
    image: '/images/designer-placeholder.jpg',
    href: '/designers/parkparang',
    type: 'designer',
    index: 1
  },
  {
    id: 'leetaehyeon',
    name: 'LEE TAEHYEON',
    role: 'Fashion Designer',
    image: '/images/designers/leetaehyeon/leetaehyeon-Profile.jpg',
    href: '/designers/leetaehyeon',
    type: 'designer',
    index: 2
  },
  {
    id: 'choieunsol',
    name: 'CHOI EUNSOL',
    role: 'Art Director',
    image: '/images/designers/choieunsol/choieunsol-Profile.jpeg',
    href: '/designers/choieunsol',
    type: 'designer',
    index: 3
  },
  {
    id: 'hwangjinsu',
    name: 'HWANG JINSU',
    role: 'Film Director',
    image: '/images/designer-placeholder.jpg',
    href: '/designers/hwangjinsu',
    type: 'designer',
    index: 4
  },
  {
    id: 'kimgyeongsu',
    name: 'KIM GYEONGSU',
    role: 'Installation Artist',
    image: '/images/designer-placeholder.jpg',
    href: '/designers/kimgyeongsu',
    type: 'designer',
    index: 5
  },
  {
    id: 'cine-mode',
    name: 'CINE MODE',
    role: '2025.03',
    image: '/images/exhibition-placeholder.jpg',
    href: '/exhibitions#cine-mode',
    type: 'exhibition',
    index: 6
  },
  {
    id: 'the-room',
    name: 'THE ROOM OF [ ]',
    role: '2025.12',
    image: '/images/exhibition-placeholder.jpg',
    href: '/exhibitions#the-room',
    type: 'exhibition',
    index: 7
  }
];

export default function ShowcasePreview() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('redux_admin');
    setIsAdmin(adminSession === 'true');
  }, []);

  return (
    <section className="showcase-preview">
      <div className="showcase-container">
        <div className="showcase-header">
          <h2 className="showcase-title">SIX DESIGNERS, ONE VISION</h2>
          <p className="showcase-subtitle">Fashion Designer Collective</p>
        </div>
        <div className="showcase-grid" data-redux-gallery="main-showcase" data-manageable="true" data-fixed-slots="8">
          {showcaseItems.map((item) => (
            <Link 
              key={item.id} 
              href={item.href} 
              className={`showcase-item ${item.type === 'exhibition' ? 'exhibition-item' : ''}`}
              style={{ '--index': item.index } as any}
              data-manageable="showcase"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                data-optimize="high"
              />
              <div className="showcase-overlay">
                <div className={`showcase-name ${item.type === 'exhibition' && item.id === 'cine-mode' ? 'cine-mode' : ''}`}>
                  {item.name}
                </div>
                <div className={`showcase-role ${item.type === 'exhibition' ? 'exhibition-date' : ''}`}>
                  {item.role}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .showcase-preview {
          padding: 120px 40px;
          background: var(--primary-white);
        }

        .showcase-container {
          max-width: 1600px;
          margin: 0 auto;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .showcase-title {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: clamp(2.5rem, 5vw, 3rem);
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .showcase-subtitle {
          font-size: 16px;
          color: var(--gray-medium);
          letter-spacing: 2px;
        }

        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
          background: var(--gray-light);
          padding: 2px;
        }

        .showcase-item {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: var(--primary-black);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          will-change: transform, opacity, filter;
          animation: fadeInSequential 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
          animation-delay: calc(0.5s + var(--index, 0) * 0.1s);
          animation-fill-mode: both;
        }

        .showcase-item:hover {
          transform: translateY(-3px) scale(1.005);
          filter: brightness(1.02) saturate(1.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .showcase-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: var(--primary-white);
          opacity: 0;
          transition: opacity 0.4s ease;
          padding: 20px;
          text-align: center;
        }

        .showcase-item:hover .showcase-overlay {
          opacity: 1;
        }

        .showcase-name {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          letter-spacing: 0.02em;
          margin-bottom: 5px;
        }

        .showcase-role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .exhibition-item {
          animation: fadeInSequential 1s cubic-bezier(0.25, 0.8, 0.25, 1);
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }

        .exhibition-date,
        .cine-mode {
          background: linear-gradient(135deg, var(--accent-mocha), var(--accent-warm));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 500;
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

        @media (prefers-reduced-motion: reduce) {
          .showcase-item,
          .exhibition-item {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .showcase-item:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
          
          .showcase-item:active .showcase-overlay {
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .showcase-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .showcase-preview {
            padding: 60px 20px;
          }

          .showcase-header {
            margin-bottom: 40px;
          }

          .showcase-title {
            font-size: 28px;
            letter-spacing: 2px;
          }

          .showcase-subtitle {
            font-size: 14px;
          }

          .showcase-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1rem;
          }

          .showcase-name {
            font-size: clamp(1rem, 4vw, 1.25rem);
          }

          .showcase-role {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .showcase-title {
            font-size: 24px;
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
    </section>
  );
}