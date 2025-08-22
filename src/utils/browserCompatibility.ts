/**
 * 브라우저 호환성 테스트 유틸리티
 * 다양한 브라우저와 디바이스에서의 호환성을 검사
 */

export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface FeatureSupport {
  webGL: boolean;
  webP: boolean;
  avif: boolean;
  intersectionObserver: boolean;
  resizeObserver: boolean;
  customProperties: boolean;
  grid: boolean;
  flexbox: boolean;
  serviceWorker: boolean;
  touchEvents: boolean;
  pointerEvents: boolean;
  deviceMotion: boolean;
  geolocation: boolean;
  webSockets: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webWorkers: boolean;
  es6Modules: boolean;
  fetch: boolean;
}

export interface CompatibilityReport {
  browser: BrowserInfo;
  features: FeatureSupport;
  performance: {
    memoryInfo?: any;
    connection?: any;
    hardwareConcurrency: number;
  };
  recommendations: string[];
  warnings: string[];
  errors: string[];
}

/**
 * 브라우저 정보를 감지합니다
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  
  let name = 'unknown';
  let version = 'unknown';
  let engine = 'unknown';
  
  // 브라우저 감지
  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    name = 'Chrome';
    const match = userAgent.match(/chrome\/(\d+)/);
    version = match ? match[1] : 'unknown';
    engine = 'Blink';
  } else if (userAgent.includes('firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/firefox\/(\d+)/);
    version = match ? match[1] : 'unknown';
    engine = 'Gecko';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    name = 'Safari';
    const match = userAgent.match(/version\/(\d+)/);
    version = match ? match[1] : 'unknown';
    engine = 'WebKit';
  } else if (userAgent.includes('edge')) {
    name = 'Edge';
    const match = userAgent.match(/edge\/(\d+)/);
    version = match ? match[1] : 'unknown';
    engine = 'Blink';
  } else if (userAgent.includes('msie') || userAgent.includes('trident')) {
    name = 'Internet Explorer';
    const match = userAgent.match(/(?:msie|rv:)(\d+)/);
    version = match ? match[1] : 'unknown';
    engine = 'Trident';
  }
  
  // 디바이스 타입 감지
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    name,
    version,
    engine,
    platform,
    isMobile,
    isTablet,
    isDesktop
  };
}

/**
 * 브라우저 기능 지원 여부를 확인합니다
 */
export function checkFeatureSupport(): FeatureSupport {
  const features: FeatureSupport = {
    webGL: false,
    webP: false,
    avif: false,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    customProperties: CSS.supports && CSS.supports('color', 'var(--test)'),
    grid: CSS.supports && CSS.supports('display', 'grid'),
    flexbox: CSS.supports && CSS.supports('display', 'flex'),
    serviceWorker: 'serviceWorker' in navigator,
    touchEvents: 'ontouchstart' in window,
    pointerEvents: 'PointerEvent' in window,
    deviceMotion: 'DeviceMotionEvent' in window,
    geolocation: 'geolocation' in navigator,
    webSockets: 'WebSocket' in window,
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: (() => {
      try {
        const test = 'test';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    })(),
    indexedDB: 'indexedDB' in window,
    webWorkers: 'Worker' in window,
    es6Modules: 'noModule' in HTMLScriptElement.prototype,
    fetch: 'fetch' in window
  };

  // WebGL 지원 확인
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    features.webGL = !!gl;
  } catch {
    features.webGL = false;
  }

  // WebP 지원 확인
  const webpCanvas = document.createElement('canvas');
  webpCanvas.width = 1;
  webpCanvas.height = 1;
  features.webP = webpCanvas.toDataURL('image/webp').startsWith('data:image/webp');

  // AVIF 지원 확인 (비동기적으로 확인되지만 동기적으로 반환)
  const avifImg = new Image();
  avifImg.onload = () => { features.avif = true; };
  avifImg.onerror = () => { features.avif = false; };
  avifImg.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUI=';

  return features;
}

/**
 * 성능 정보를 수집합니다
 */
export function collectPerformanceInfo() {
  const performance: any = {
    hardwareConcurrency: navigator.hardwareConcurrency || 1
  };

  // 메모리 정보 (Chrome만 지원)
  if ('memory' in performance) {
    performance.memoryInfo = {
      usedJSSize: (performance.memory as any).usedJSSize,
      totalJSSize: (performance.memory as any).totalJSSize,
      jsHeapSizeLimit: (performance.memory as any).jsHeapSizeLimit
    };
  }

  // 네트워크 연결 정보
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    performance.connection = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }

  return performance;
}

/**
 * 종합적인 호환성 리포트를 생성합니다
 */
export function generateCompatibilityReport(): CompatibilityReport {
  const browser = detectBrowser();
  const features = checkFeatureSupport();
  const performance = collectPerformanceInfo();
  
  const recommendations: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  // Internet Explorer 경고
  if (browser.name === 'Internet Explorer') {
    errors.push('Internet Explorer는 더 이상 지원되지 않습니다. 최신 브라우저로 업그레이드하세요.');
  }

  // 오래된 브라우저 버전 경고
  const minVersions: Record<string, number> = {
    'Chrome': 90,
    'Firefox': 88,
    'Safari': 14,
    'Edge': 90
  };

  if (browser.name in minVersions && parseInt(browser.version) < minVersions[browser.name]) {
    warnings.push(`${browser.name} 버전이 너무 낮습니다. 최신 버전으로 업그레이드하는 것을 권장합니다.`);
  }

  // 필수 기능 지원 확인
  if (!features.intersectionObserver) {
    warnings.push('Intersection Observer가 지원되지 않아 이미지 지연 로딩이 제한될 수 있습니다.');
  }

  if (!features.customProperties) {
    warnings.push('CSS 커스텀 속성이 지원되지 않아 스타일링이 제한될 수 있습니다.');
  }

  if (!features.fetch) {
    warnings.push('Fetch API가 지원되지 않아 네트워크 요청이 제한될 수 있습니다.');
  }

  if (!features.localStorage) {
    warnings.push('Local Storage가 지원되지 않아 설정 저장이 제한될 수 있습니다.');
  }

  // 성능 관련 권장사항
  if (performance.hardwareConcurrency <= 2) {
    recommendations.push('CPU 코어가 적습니다. 성능 최적화를 위해 애니메이션을 줄이는 것을 고려하세요.');
  }

  if (performance.connection && performance.connection.effectiveType === 'slow-2g') {
    recommendations.push('인터넷 연결이 느립니다. 이미지 품질을 낮추는 것을 고려하세요.');
  }

  // 모바일 최적화 권장사항
  if (browser.isMobile) {
    recommendations.push('모바일 디바이스에서 접속하고 있습니다. 터치 인터페이스가 최적화되어 있는지 확인하세요.');
    
    if (!features.touchEvents) {
      warnings.push('터치 이벤트가 지원되지 않아 모바일 인터페이스가 제한될 수 있습니다.');
    }
  }

  return {
    browser,
    features,
    performance,
    recommendations,
    warnings,
    errors
  };
}

/**
 * 호환성 리포트를 콘솔에 출력합니다
 */
export function logCompatibilityReport(report: CompatibilityReport) {
  console.group('🔍 브라우저 호환성 리포트');
  
  console.group('📱 브라우저 정보');
  console.log(`브라우저: ${report.browser.name} ${report.browser.version}`);
  console.log(`엔진: ${report.browser.engine}`);
  console.log(`플랫폼: ${report.browser.platform}`);
  console.log(`디바이스: ${
    report.browser.isMobile ? '모바일' : 
    report.browser.isTablet ? '태블릿' : '데스크톱'
  }`);
  console.groupEnd();

  console.group('⚡ 기능 지원');
  Object.entries(report.features).forEach(([feature, supported]) => {
    console.log(`${feature}: ${supported ? '✅' : '❌'}`);
  });
  console.groupEnd();

  console.group('📊 성능 정보');
  console.log(`CPU 코어: ${report.performance.hardwareConcurrency}`);
  if (report.performance.memoryInfo) {
    console.log(`메모리 사용량: ${Math.round(report.performance.memoryInfo.usedJSSize / 1024 / 1024)}MB`);
  }
  if (report.performance.connection) {
    console.log(`연결 속도: ${report.performance.connection.effectiveType}`);
  }
  console.groupEnd();

  if (report.errors.length > 0) {
    console.group('❌ 오류');
    report.errors.forEach(error => console.error(error));
    console.groupEnd();
  }

  if (report.warnings.length > 0) {
    console.group('⚠️ 경고');
    report.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  if (report.recommendations.length > 0) {
    console.group('💡 권장사항');
    report.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
  }

  console.groupEnd();
}

/**
 * 호환성 테스트를 실행하고 결과를 반환합니다
 */
export function runCompatibilityTest(): Promise<CompatibilityReport> {
  return new Promise((resolve) => {
    const report = generateCompatibilityReport();
    
    // 비동기적으로 확인되는 기능들을 위한 추가 시간
    setTimeout(() => {
      logCompatibilityReport(report);
      resolve(report);
    }, 100);
  });
}

export default {
  detectBrowser,
  checkFeatureSupport,
  collectPerformanceInfo,
  generateCompatibilityReport,
  logCompatibilityReport,
  runCompatibilityTest
};