/**
 * Performance Monitoring Utility
 * 번들 크기 및 로딩 성능을 모니터링하고 최적화 효과를 측정
 */

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

interface ChunkLoadingMetrics {
  chunkName: string;
  loadTime: number;
  size: number;
  cached: boolean;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private chunkMetrics: ChunkLoadingMetrics[] = [];
  private startTime = Date.now();

  // Core Web Vitals 측정
  measureWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (_e) {
      // Safari 및 구형 브라우저 지원
      console.warn('LCP measurement not supported');
    }

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime;
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (_e) {
      console.warn('Paint timing not supported');
    }

    // Time to Interactive 근사치
    setTimeout(() => {
      this.metrics.timeToInteractive = Date.now() - this.startTime;
    }, 100);
  }

  // 동적 import 성능 측정
  async measureChunkLoading<T>(
    chunkName: string,
    importFunction: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const loadedModule = await importFunction();
      const loadTime = performance.now() - startTime;
      
      this.chunkMetrics.push({
        chunkName,
        loadTime,
        size: 0, // 실제 환경에서는 네트워크 탭에서 측정
        cached: loadTime < 50 // 50ms 이하면 캐시된 것으로 간주
      });

      console.log(`📦 Chunk '${chunkName}' loaded in ${loadTime.toFixed(2)}ms`);
      return loadedModule;
    } catch (error) {
      console.error(`❌ Failed to load chunk '${chunkName}':`, error);
      throw error;
    }
  }

  // 번들 크기 추적 (개발 환경용)
  trackBundleSize(): void {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalSize = 0;

    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src.includes('/_next/static/')) {
        // 실제 환경에서는 네트워크 API나 번들 분석기를 사용
        console.log(`📄 Script: ${src}`);
      }
    });

    this.metrics.bundleSize = totalSize;
  }

  // 성능 리포트 생성
  generateReport(): void {
    if (typeof window === 'undefined') return;

    console.group('🚀 REDUX Performance Report');
    
    // Web Vitals
    if (this.metrics.firstContentfulPaint) {
      console.log(`🎨 First Contentful Paint: ${this.metrics.firstContentfulPaint.toFixed(2)}ms`);
    }
    
    if (this.metrics.largestContentfulPaint) {
      console.log(`🖼️ Largest Contentful Paint: ${this.metrics.largestContentfulPaint.toFixed(2)}ms`);
    }
    
    if (this.metrics.timeToInteractive) {
      console.log(`⚡ Time to Interactive: ${this.metrics.timeToInteractive}ms`);
    }

    // 청크 로딩 통계
    if (this.chunkMetrics.length > 0) {
      console.group('📦 Chunk Loading Stats');
      this.chunkMetrics.forEach(chunk => {
        const status = chunk.cached ? '💾 (cached)' : '🌐 (network)';
        console.log(`${chunk.chunkName}: ${chunk.loadTime.toFixed(2)}ms ${status}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  // 성능 문제 감지
  detectPerformanceIssues(): string[] {
    const issues: string[] = [];

    if (this.metrics.firstContentfulPaint && this.metrics.firstContentfulPaint > 2500) {
      issues.push('FCP 너무 느림 (>2.5s)');
    }

    if (this.metrics.largestContentfulPaint && this.metrics.largestContentfulPaint > 4000) {
      issues.push('LCP 너무 느림 (>4s)');
    }

    const slowChunks = this.chunkMetrics.filter(chunk => chunk.loadTime > 1000);
    if (slowChunks.length > 0) {
      issues.push(`느린 청크 로딩: ${slowChunks.map(c => c.chunkName).join(', ')}`);
    }

    return issues;
  }

  // 최적화 제안
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const issues = this.detectPerformanceIssues();

    if (issues.length === 0) {
      suggestions.push('✅  성능이 양호합니다!');
      return suggestions;
    }

    if (issues.some(issue => issue.includes('FCP'))) {
      suggestions.push('🎯 Critical CSS 인라인화 고려');
      suggestions.push('🎯 폰트 preload 최적화');
    }

    if (issues.some(issue => issue.includes('LCP'))) {
      suggestions.push('🎯 메인 이미지 우선순위 최적화');
      suggestions.push('🎯 Hero 섹션 리소스 preload');
    }

    if (issues.some(issue => issue.includes('청크'))) {
      suggestions.push('🎯 자주 사용되는 컴포넌트 prefetch');
      suggestions.push('🎯 더 작은 청크로 분할');
    }

    return suggestions;
  }
}

// 싱글톤 인스턴스
const performanceMonitor = new PerformanceMonitor();

// 자동 초기화
if (typeof window !== 'undefined') {
  performanceMonitor.measureWebVitals();
  performanceMonitor.trackBundleSize();

  // 페이지 로드 완료 후 리포트 생성
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.generateReport();
      
      const issues = performanceMonitor.detectPerformanceIssues();
      if (issues.length > 0) {
        console.warn('⚠️ Performance Issues Detected:', issues);
        console.log('💡 Suggestions:', performanceMonitor.getOptimizationSuggestions());
      }
    }, 2000);
  });
}

// 유틸리티 함수들
export const measureChunkLoading = performanceMonitor.measureChunkLoading.bind(performanceMonitor);

export const reportPerformance = () => performanceMonitor.generateReport();

export const getPerformanceIssues = () => performanceMonitor.detectPerformanceIssues();

export const getOptimizationSuggestions = () => performanceMonitor.getOptimizationSuggestions();

export default performanceMonitor;