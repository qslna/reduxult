// Performance Optimization System - 성능 최적화 유틸리티
// 코드 스플리팅, 레이지 로딩, 리소스 최적화를 위한 고급 시스템

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// 성능 모니터링 인터페이스
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  imageLoadTime: number;
  totalBundleSize: number;
  criticalResources: number;
  deferredResources: number;
}

// 레이지 로딩 설정
export interface LazyLoadingConfig {
  rootMargin?: string;
  threshold?: number | number[];
  delay?: number;
  fallbackComponent?: ComponentType;
  retryAttempts?: number;
}

// 코드 스플리팅 유틸리티
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    retryDelay?: number;
    maxRetries?: number;
    fallback?: ComponentType;
  } = {}
): LazyExoticComponent<T> => {
  const { retryDelay = 1000, maxRetries = 3 } = options;
  
  const lazyComponentWithRetry = lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (attemptNumber: number) => {
        importFn()
          .then(resolve)
          .catch(error => {
            if (attemptNumber < maxRetries) {
              console.warn(`컴포넌트 로드 실패, 재시도 중... (${attemptNumber + 1}/${maxRetries})`);
              setTimeout(() => attemptImport(attemptNumber + 1), retryDelay);
            } else {
              console.error('컴포넌트 로드 최종 실패:', error);
              reject(error);
            }
          });
      };
      
      attemptImport(0);
    });
  });

  return lazyComponentWithRetry;
};

// 중요한 리소스 프리로딩
export const preloadCriticalResources = (resources: string[]) => {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    
    if (resource.endsWith('.js')) {
      link.rel = 'modulepreload';
    } else if (resource.endsWith('.css')) {
      link.rel = 'preload';
      link.as = 'style';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.rel = 'preload';
      link.as = 'image';
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.rel = 'preload';
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
};

// 이미지 레이지 로딩 옵저버
export class LazyImageObserver {
  private observer: IntersectionObserver | null = null;
  private config: LazyLoadingConfig;

  constructor(config: LazyLoadingConfig = {}) {
    this.config = {
      rootMargin: '50px',
      threshold: 0.1,
      delay: 100,
      retryAttempts: 3,
      ...config
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        
        if (this.config.delay && this.config.delay > 0) {
          setTimeout(() => this.loadImage(img), this.config.delay);
        } else {
          this.loadImage(img);
        }
        
        this.observer?.unobserve(img);
      }
    });
  }

  private loadImage(img: HTMLImageElement, attempt: number = 1) {
    const dataSrc = img.getAttribute('data-src');
    const dataSrcSet = img.getAttribute('data-srcset');
    
    if (!dataSrc) return;

    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = dataSrc;
      if (dataSrcSet) {
        img.srcset = dataSrcSet;
      }
      
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // 커스텀 이벤트 발송
      img.dispatchEvent(new CustomEvent('lazyImageLoaded'));
    };

    imageLoader.onerror = () => {
      if (attempt < (this.config.retryAttempts || 3)) {
        console.warn(`이미지 로드 실패, 재시도 중... (${attempt}/${this.config.retryAttempts})`);
        setTimeout(() => this.loadImage(img, attempt + 1), 1000);
      } else {
        console.error('이미지 로드 최종 실패:', dataSrc);
        img.classList.add('lazy-error');
        img.dispatchEvent(new CustomEvent('lazyImageError'));
      }
    };

    imageLoader.src = dataSrc;
  }

  observe(element: HTMLElement) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  unobserve(element: HTMLElement) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 번들 분석 및 최적화
export const bundleAnalyzer = {
  // 번들 크기 측정
  measureBundleSize: async (): Promise<number> => {
    if (typeof window === 'undefined') return 0;

    try {
      const performance = window.performance;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return navigation.transferSize || 0;
    } catch (error) {
      console.warn('번들 크기 측정 실패:', error);
      return 0;
    }
  },

  // 중요하지 않은 리소스 지연 로딩
  deferNonCriticalResources: () => {
    if (typeof window === 'undefined') return;

    // 폰트 지연 로딩
    const deferFonts = () => {
      const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
      fontLinks.forEach(link => {
        (link as HTMLLinkElement).rel = 'stylesheet';
      });
    };

    // 이미지 지연 로딩
    const deferImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      const observer = new LazyImageObserver();
      
      images.forEach(img => observer.observe(img as HTMLElement));
    };

    // DOM 로드 완료 후 실행
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        requestIdleCallback(() => {
          deferFonts();
          deferImages();
        });
      });
    } else {
      requestIdleCallback(() => {
        deferFonts();
        deferImages();
      });
    }
  }
};

// 성능 모니터링
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // LCP (Largest Contentful Paint) 측정
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.renderTime = lastEntry.startTime;
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP 관찰자 초기화 실패:', error);
      }

      // FID (First Input Delay) 측정
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID 관찰자 초기화 실패:', error);
      }
    }
  }

  // 성능 메트릭 수집
  async collectMetrics(): Promise<PerformanceMetrics> {
    if (typeof window === 'undefined') {
      return {
        loadTime: 0,
        renderTime: 0,
        imageLoadTime: 0,
        totalBundleSize: 0,
        criticalResources: 0,
        deferredResources: 0
      };
    }

    const performance = window.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    this.metrics.loadTime = navigation.loadEventEnd - (navigation as any).navigationStart;
    this.metrics.totalBundleSize = await bundleAnalyzer.measureBundleSize();

    // 리소스 분석
    const resources = performance.getEntriesByType('resource');
    this.metrics.criticalResources = resources.filter(r => r.name.includes('.css') || r.name.includes('.js')).length;
    this.metrics.deferredResources = resources.filter(r => r.name.includes('lazy') || r.name.includes('defer')).length;

    return this.metrics as PerformanceMetrics;
  }

  // 성능 리포트 생성
  generateReport(): string {
    const report = `
성능 리포트:
- 로드 시간: ${this.metrics.loadTime?.toFixed(2)}ms
- 렌더 시간: ${this.metrics.renderTime?.toFixed(2)}ms
- 번들 크기: ${(this.metrics.totalBundleSize || 0 / 1024).toFixed(2)}KB
- 중요 리소스: ${this.metrics.criticalResources}개
- 지연 리소스: ${this.metrics.deferredResources}개
    `.trim();

    return report;
  }

  // 정리
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// 코드 스플리팅 설정
export const splitPoints = {
  // 페이지별 분할
  pages: {
    home: () => import('@/app/page'),
    about: () => import('@/app/about/page'),
    designers: () => import('@/app/designers/page'),
    exhibitions: () => import('@/app/exhibitions/page'),
    contact: () => import('@/app/contact/page'),
    admin: () => import('@/app/admin/page')
  },

  // 컴포넌트별 분할
  components: {
    imageGallery: () => import('@/components/ui/ImageGallery'),
    lightbox: () => import('@/components/ui/Lightbox'),
    cmsLayout: () => import('@/components/cms/CMSLayout'),
    contentEditor: () => import('@/components/cms/ContentEditor')
  },

  // 라이브러리별 분할
  libraries: {
    gsap: () => import('gsap'),
    framerMotion: () => import('framer-motion')
  }
};

// 웹 워커 유틸리티
export const createWebWorker = (workerFunction: Function): Worker => {
  const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// 이미지 최적화 웹 워커
export const imageOptimizationWorker = () => {
  self.onmessage = function(e) {
    const { imageData, options } = e.data;
    
    // 이미지 압축 로직 (예시)
    const canvas = new OffscreenCanvas(options.width, options.height);
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // 이미지 처리 로직
      self.postMessage({ optimizedImageData: imageData });
    }
  };
};

// 메모리 관리
export const memoryManager = {
  // 메모리 사용량 모니터링
  getMemoryUsage: (): any | null => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },

  // 가비지 컬렉션 제안
  suggestGarbageCollection: () => {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  },

  // 메모리 누수 감지
  detectMemoryLeaks: () => {
    const usage = memoryManager.getMemoryUsage();
    if (usage && usage.usedJSHeapSize > usage.totalJSHeapSize * 0.9) {
      console.warn('메모리 사용량이 높습니다. 메모리 누수 가능성을 확인하세요.');
      return true;
    }
    return false;
  }
};

// 전역 성능 설정
export const performanceConfig = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableImageOptimization: true,
  enableServiceWorker: true,
  criticalResourceThreshold: 100, // KB
  lazyLoadingThreshold: 0.1,
  retryAttempts: 3,
  cacheDuration: 86400000 // 24시간
};

// 성능 최적화 초기화
export const initializePerformanceOptimization = () => {
  if (typeof window === 'undefined') return;

  // 중요 리소스 프리로딩
  preloadCriticalResources([
    '/fonts/inter-var.woff2',
    '/fonts/playfair-display-var.woff2',
    '/css/critical.css'
  ]);

  // 비중요 리소스 지연 로딩
  bundleAnalyzer.deferNonCriticalResources();

  // 성능 모니터링 시작
  const monitor = new PerformanceMonitor();
  
  // 5초 후 성능 리포트 생성
  setTimeout(() => {
    monitor.collectMetrics().then(() => {
      console.log(monitor.generateReport());
    });
  }, 5000);

  // 메모리 사용량 주기적 체크
  setInterval(() => {
    memoryManager.detectMemoryLeaks();
  }, 30000);
};