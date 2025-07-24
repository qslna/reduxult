'use client';

import { useState, useEffect, useRef } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { CategoryGallery, GalleryImage } from '@/data/aboutGallery';

interface CategoryPreviewProps {
  category: CategoryGallery;
  gridStyle: React.CSSProperties;
  className?: string;
}

export default function CategoryPreview({ 
  category, 
  gridStyle, 
  className = '' 
}: CategoryPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [previewImages, setPreviewImages] = useState<GalleryImage[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 미리보기 이미지 설정
    if (category.previewImages.length > 0) {
      setPreviewImages(category.previewImages);
    } else {
      // fallback: 전체 이미지에서 처음 3개 사용
      setPreviewImages(category.images.slice(0, 3));
    }
  }, [category]);

  useEffect(() => {
    if (isHovered && previewImages.length > 1) {
      // 호버 시 이미지 순환
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % previewImages.length);
      }, 800);
    } else {
      // 호버 해제 시 인터벌 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 기본 인덱스로 돌아가기
      setTimeout(() => {
        if (!isHovered) {
          setCurrentImageIndex(0);
        }
      }, 300);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, previewImages.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (previewImages.length === 0) {
    return null;
  }

  return (
    <a 
      href={`/about/${category.id}`}
      className={`grid-item ${className}`}
      style={{
        ...gridStyle,
        position: 'relative',
        overflow: 'visible',
        background: '#f5f5f5',
        transition: 'all 0.5s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        perspective: '1000px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="grid-stack"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        {/* 첫 번째 레이어 - 메인 이미지 */}
        <div 
          className="stack-layer"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            border: '2px solid #fff',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
            overflow: 'hidden',
            transform: isHovered ? 'translateZ(10px) rotate(-2deg) scale(1.05)' : 'translateZ(0px) rotate(-1deg)',
            zIndex: 3
          }}
        >
          <OptimizedImage 
            src={previewImages[currentImageIndex]?.src || previewImages[0].src}
            alt={previewImages[currentImageIndex]?.alt || previewImages[0].alt}
            fill={true}
            priority={currentImageIndex === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{
              objectFit: 'cover',
              filter: isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(50%) brightness(0.9)',
              transition: 'all 0.8s ease'
            }}
          />
          
          {/* 이미지 오버레이 인디케이터 */}
          {isHovered && previewImages.length > 1 && (
            <div 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '4px',
                zIndex: 10
              }}
            >
              {previewImages.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 두 번째 레이어 - 백그라운드 이미지 1 */}
        {previewImages.length > 1 && (
          <div 
            className="stack-layer"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              border: '2px solid #fff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
              overflow: 'hidden',
              transform: isHovered ? 'translateZ(-20px) rotate(3deg)' : 'translateZ(-12px) rotate(2deg)',
              zIndex: 2,
              opacity: isHovered ? 0.9 : 0.85
            }}
          >
            <OptimizedImage 
              src={previewImages[1].src}
              alt={previewImages[1].alt}
              fill={true}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                filter: 'grayscale(50%) brightness(0.9)',
                transition: 'all 0.8s ease'
              }}
            />
          </div>
        )}

        {/* 세 번째 레이어 - 백그라운드 이미지 2 */}
        {previewImages.length > 2 && (
          <div 
            className="stack-layer"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              border: '2px solid #fff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
              overflow: 'hidden',
              transform: isHovered ? 'translateZ(-35px) rotate(-1deg)' : 'translateZ(-24px) rotate(-0.5deg)',
              zIndex: 1,
              opacity: isHovered ? 0.8 : 0.7
            }}
          >
            <OptimizedImage 
              src={previewImages[2].src}
              alt={previewImages[2].alt}
              fill={true}
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{
                objectFit: 'cover',
                filter: 'grayscale(50%) brightness(0.9)',
                transition: 'all 0.8s ease'
              }}
            />
          </div>
        )}

        {/* 호버 시 추가 효과 */}
        {isHovered && (
          <div 
            style={{
              position: 'absolute',
              inset: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              zIndex: 4,
              pointerEvents: 'none',
              opacity: 0.6,
              transition: 'all 0.3s ease'
            }}
          />
        )}
      </div>

      {/* 카테고리 정보 오버레이 */}
      <div 
        className="grid-item-overlay"
        style={{
          position: 'absolute',
          bottom: isHovered ? '-90px' : '-80px',
          left: 0,
          right: 0,
          padding: '25px 30px',
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.98), rgba(0,0,0,0.92))' 
            : 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
          color: '#fff',
          transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          zIndex: 10,
          borderRadius: '0 0 12px 12px',
          backdropFilter: 'blur(10px)',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
        }}
      >
        <h3 
          style={{
            fontSize: '20px',
            fontWeight: 400,
            letterSpacing: '1.5px',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {category.name}
        </h3>
        <p 
          style={{
            fontSize: '13px',
            opacity: isHovered ? 1 : 0.9,
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {category.description}
        </p>
        
        {/* 이미지 카운트 표시 */}
        {isHovered && (
          <div 
            style={{
              marginTop: '8px',
              fontSize: '11px',
              opacity: 0.7,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{category.images.length} images</span>
            <div style={{ 
              width: '1px', 
              height: '12px', 
              backgroundColor: 'rgba(255,255,255,0.3)' 
            }} />
            <span>View Gallery →</span>
          </div>
        )}
      </div>

      {/* 호버 시 라이트 효과 */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'all 0.8s ease',
            transform: 'rotate(45deg)'
          }}
        />
      )}
    </a>
  );
}