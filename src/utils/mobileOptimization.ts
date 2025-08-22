/**
 * 모바일 최적화 유틸리티
 * 모바일 디바이스에서의 성능과 사용성을 향상시킴
 */

export interface MobileOptimizationConfig {
  enableTouchOptimization: boolean;
  enablePerformanceMode: boolean;
  enableReducedMotion: boolean;
  enableDataSaver: boolean;
  touchTargetMinSize: number;
  maxImageQuality: number;
}

export interface MobileDeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isLowEndDevice: boolean;
  screenSize: { width: number; height: number };
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  hasTouch: boolean;
  connectionType: string;
  memoryEstimate: number;
}

/**
 * 모바일 디바이스 정보를 수집합니다
 */
export function getMobileDeviceInfo(): MobileDeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  
  // 저사양 기기 감지 (대략적인 추정)
  const isLowEndDevice = (() => {
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    
    if (memory && memory < 4) return true; // 4GB 미만
    if (cores && cores < 4) return true; // 4코어 미만
    
    // 구형 iOS/Android 기기 감지
    if (/iphone.*os [0-9]_|android [0-4]/i.test(userAgent)) return true;
    
    return false;
  })();
  
  const screenSize = {
    width: window.screen.width,
    height: window.screen.height
  };
  
  const pixelRatio = window.devicePixelRatio || 1;
  
  const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  const connectionType = (() => {
    const connection = (navigator as any).connection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  })();
  
  const memoryEstimate = (() => {
    const memory = (navigator as any).deviceMemory;
    return memory || 4; // 기본값 4GB
  })();
  
  return {
    isMobile,
    isTablet,
    isLowEndDevice,
    screenSize,
    pixelRatio,
    orientation,
    hasTouch,
    connectionType,
    memoryEstimate
  };
}

/**
 * 기본 모바일 최적화 설정을 가져옵니다
 */
export function getDefaultMobileConfig(deviceInfo: MobileDeviceInfo): MobileOptimizationConfig {
  return {
    enableTouchOptimization: deviceInfo.hasTouch,
    enablePerformanceMode: deviceInfo.isLowEndDevice,
    enableReducedMotion: deviceInfo.isLowEndDevice || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    enableDataSaver: deviceInfo.connectionType === 'slow-2g' || deviceInfo.connectionType === '2g',
    touchTargetMinSize: 44, // Apple HIG 권장사항
    maxImageQuality: deviceInfo.isLowEndDevice ? 70 : 85
  };
}

/**
 * 터치 최적화를 적용합니다
 */
export function applyTouchOptimization(config: MobileOptimizationConfig) {
  if (!config.enableTouchOptimization) return;
  
  // 터치 타겟 크기 검증 및 경고
  const checkTouchTargets = () => {
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [tabindex]');
    const warnings: string[] = [];
    
    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);
      
      if (size > 0 && size < config.touchTargetMinSize) {
        warnings.push(`터치 타겟이 너무 작습니다: ${element.tagName} (${size}px < ${config.touchTargetMinSize}px)`);
      }
    });
    
    if (warnings.length > 0) {
      console.group('⚠️ 터치 타겟 크기 경고');
      warnings.forEach(warning => console.warn(warning));
      console.groupEnd();
    }
  };
  
  // 터치 이벤트 최적화
  const optimizeTouchEvents = () => {
    // 300ms 클릭 지연 제거
    document.addEventListener('touchstart', () => {}, { passive: true });
    
    // 스크롤 성능 향상
    const scrollElements = document.querySelectorAll('[style*="overflow"], .overflow-auto, .overflow-scroll');
    scrollElements.forEach(element => {
      (element as any).style.webkitOverflowScrolling = 'touch';
    });
    
    // 터치 피드백 추가
    const addTouchFeedback = (element: Element) => {
      element.addEventListener('touchstart', (e) => {
        (e.target as HTMLElement).classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', (e) => {
        setTimeout(() => {
          (e.target as HTMLElement).classList.remove('touch-active');
        }, 100);
      }, { passive: true });
    };
    
    document.querySelectorAll('button, a, [role="button"]').forEach(addTouchFeedback);
  };
  
  setTimeout(checkTouchTargets, 1000); // DOM 로드 후 체크
  optimizeTouchEvents();
}

/**
 * 성능 모드를 적용합니다
 */
export function applyPerformanceMode(config: MobileOptimizationConfig) {
  if (!config.enablePerformanceMode) return;
  
  console.log('🚀 모바일 성능 모드 활성화');
  
  // 애니메이션 품질 감소
  const style = document.createElement('style');
  style.textContent = `
    .performance-mode * {
      animation-duration: 0.1s !important;
      transition-duration: 0.1s !important;
    }
    
    .performance-mode .blur,
    .performance-mode [style*="blur"] {
      filter: none !important;
    }
    
    .performance-mode .shadow,
    .performance-mode [class*="shadow"] {
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('performance-mode');
  
  // 이미지 품질 최적화
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.src;
    if (src.includes('ik.imagekit.io') && !src.includes('q-')) {
      // ImageKit 품질 파라미터 추가
      const separator = src.includes('?') ? '&' : '?';
      img.src = `${src}${separator}q-${config.maxImageQuality}`;
    }
  });
}

/**
 * 동작 감소 모드를 적용합니다
 */
export function applyReducedMotion(config: MobileOptimizationConfig) {
  if (!config.enableReducedMotion) return;
  
  console.log('🎯 동작 감소 모드 활성화');
  
  const style = document.createElement('style');
  style.textContent = `
    .reduced-motion *,
    .reduced-motion *::before,
    .reduced-motion *::after {
      animation-duration: 0.01s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01s !important;
      transform: none !important;
    }
    
    .reduced-motion [data-parallax],
    .reduced-motion .parallax {
      transform: none !important;
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('reduced-motion');
}

/**
 * 데이터 절약 모드를 적용합니다
 */
export function applyDataSaverMode(config: MobileOptimizationConfig) {
  if (!config.enableDataSaver) return;
  
  console.log('💾 데이터 절약 모드 활성화');
  
  // 이미지 지연 로딩 강화
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          const src = image.dataset.src || image.src;
          
          if (src.includes('ik.imagekit.io')) {
            // 더 낮은 품질과 작은 크기로 로드
            const separator = src.includes('?') ? '&' : '?';
            image.src = `${src}${separator}q-50&w-800`;
          }
          
          observer.unobserve(image);
        }
      });
    }, { rootMargin: '50px' });
    
    observer.observe(img);
  });
  
  // 백그라운드 이미지 비활성화
  const style = document.createElement('style');
  style.textContent = `
    .data-saver [style*="background-image"] {
      background-image: none !important;
    }
    
    .data-saver .background-image,
    .data-saver [class*="bg-"] {
      background-image: none !important;
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add('data-saver');
}

/**
 * 화면 방향 변경 처리
 */
export function handleOrientationChange() {
  const handleResize = () => {
    // 뷰포트 높이 재계산 (iOS Safari 문제 해결)
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 가로/세로 모드별 최적화
    const isLandscape = window.innerWidth > window.innerHeight;
    document.body.classList.toggle('landscape', isLandscape);
    document.body.classList.toggle('portrait', !isLandscape);
  };
  
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100); // 방향 변경 후 지연
  }, { passive: true });
  
  // 초기 실행
  handleResize();
}

/**
 * 모바일 최적화 리포트를 생성합니다
 */
export function generateMobileOptimizationReport() {
  const deviceInfo = getMobileDeviceInfo();
  const config = getDefaultMobileConfig(deviceInfo);
  
  console.group('📱 모바일 최적화 리포트');
  
  console.group('기기 정보');
  console.log(`디바이스 타입: ${deviceInfo.isMobile ? '모바일' : deviceInfo.isTablet ? '태블릿' : '데스크톱'}`);
  console.log(`저사양 기기: ${deviceInfo.isLowEndDevice ? 'Yes' : 'No'}`);
  console.log(`화면 크기: ${deviceInfo.screenSize.width}x${deviceInfo.screenSize.height}`);
  console.log(`픽셀 비율: ${deviceInfo.pixelRatio}`);
  console.log(`방향: ${deviceInfo.orientation}`);
  console.log(`터치 지원: ${deviceInfo.hasTouch ? 'Yes' : 'No'}`);
  console.log(`연결 타입: ${deviceInfo.connectionType}`);
  console.log(`메모리 추정: ${deviceInfo.memoryEstimate}GB`);
  console.groupEnd();
  
  console.group('최적화 설정');
  console.log(`터치 최적화: ${config.enableTouchOptimization ? '활성화' : '비활성화'}`);
  console.log(`성능 모드: ${config.enablePerformanceMode ? '활성화' : '비활성화'}`);
  console.log(`동작 감소: ${config.enableReducedMotion ? '활성화' : '비활성화'}`);
  console.log(`데이터 절약: ${config.enableDataSaver ? '활성화' : '비활성화'}`);
  console.log(`터치 타겟 최소 크기: ${config.touchTargetMinSize}px`);
  console.log(`최대 이미지 품질: ${config.maxImageQuality}%`);
  console.groupEnd();
  
  console.groupEnd();
  
  return { deviceInfo, config };
}

/**
 * 전체 모바일 최적화를 실행합니다
 */
export function initializeMobileOptimization() {
  const deviceInfo = getMobileDeviceInfo();
  
  // 모바일이 아닌 경우 최적화 건너뛰기
  if (!deviceInfo.isMobile && !deviceInfo.isTablet) {
    console.log('🖥️ 데스크톱 디바이스 감지 - 모바일 최적화 건너뜀');
    return;
  }
  
  const config = getDefaultMobileConfig(deviceInfo);
  
  // 각종 최적화 적용
  applyTouchOptimization(config);
  applyPerformanceMode(config);
  applyReducedMotion(config);
  applyDataSaverMode(config);
  handleOrientationChange();
  
  // 리포트 생성
  generateMobileOptimizationReport();
  
  console.log('✅ 모바일 최적화 완료');
}

export default {
  getMobileDeviceInfo,
  getDefaultMobileConfig,
  applyTouchOptimization,
  applyPerformanceMode,
  applyReducedMotion,
  applyDataSaverMode,
  handleOrientationChange,
  generateMobileOptimizationReport,
  initializeMobileOptimization
};