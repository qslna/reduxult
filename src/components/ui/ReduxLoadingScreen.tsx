'use client';

import React, { useEffect, useState } from 'react';

interface ReduxLoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

// HTML redux6 index.html과 완전 동일한 로딩 스크린
const ReduxLoadingScreen: React.FC<ReduxLoadingScreenProps> = ({
  onComplete,
  duration = 2000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`loading-screen ${!isVisible ? 'hide' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'var(--primary-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        transition: 'opacity 0.8s ease'
      }}
    >
      <div className="loading-content" style={{
        textAlign: 'center'
      }}>
        {/* REDUX 타이틀 - HTML 버전과 완전 동일 */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(3rem, 6vw, 6rem)',
          fontWeight: 700,
          letterSpacing: '0.05em',
          lineHeight: 0.9,
          color: 'var(--primary-black)',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          REDUX
        </h1>

        {/* 로딩 텍스트 - HTML 버전과 동일 */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(12px, 2vw, 14px)',
          letterSpacing: 'clamp(2px, 0.5vw, 4px)',
          textTransform: 'uppercase',
          color: 'var(--gray-500)',
          fontWeight: 300,
          position: 'relative',
          overflow: 'hidden'
        }}>
          LOADING...
          
          {/* 로딩 라인 애니메이션 - HTML 버전과 동일 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '-100%',
            width: '100%',
            height: '1px',
            background: 'var(--primary-black)',
            animation: 'loadingLine 2s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* CSS Animations - HTML 버전과 완전 동일 */}
      <style jsx>{`
        @keyframes loadingLine {
          0% { left: -100%; }
          50% { left: 0; }
          100% { left: 100%; }
        }

        .loading-screen {
          opacity: 1;
        }

        .loading-screen.hide {
          opacity: 0;
          pointer-events: none;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .loading-content h1 {
            font-size: clamp(2.5rem, 10vw, 4rem) !important;
          }
          
          .loading-content div {
            font-size: 10px !important;
            letter-spacing: 2px !important;
          }
        }

        @media (max-width: 480px) {
          .loading-content h1 {
            font-size: clamp(2rem, 12vw, 3rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReduxLoadingScreen;