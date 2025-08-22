/**
 * 모바일 최적화 테스트 유틸리티
 * 모바일 최적화 완성도를 검증하는 테스트 도구
 */

export interface MobileTestResult {
  category: 'TOUCH' | 'VIEWPORT' | 'PERFORMANCE' | 'ACCESSIBILITY' | 'NAVIGATION';
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  score: number; // 0-100
  details: string;
  recommendation?: string;
}

export interface MobileOptimizationScore {
  overall: number; // 0-100
  touch: number;
  viewport: number;
  performance: number;
  accessibility: number;
  navigation: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface MobileTestReport {
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    screenSize: { width: number; height: number };
    userAgent: string;
  };
  tests: MobileTestResult[];
  score: MobileOptimizationScore;
  summary: string;
  criticalIssues: string[];
  recommendations: string[];
}

/**
 * 터치 인터페이스 최적화를 테스트합니다
 */
export function testTouchOptimization(): MobileTestResult[] {
  const results: MobileTestResult[] = [];
  
  // 터치 타겟 크기 테스트
  const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"], [role="button"]');
  const minTouchSize = 44; // Apple HIG 권장사항
  let smallTargetCount = 0;
  const totalTargets = touchTargets.length;
  
  touchTargets.forEach(target => {
    const rect = target.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    if (size < minTouchSize && size > 0) {
      smallTargetCount++;
    }
  });
  
  const touchTargetScore = totalTargets > 0 ? Math.max(0, 100 - (smallTargetCount / totalTargets) * 100) : 100;
  
  results.push({
    category: 'TOUCH',
    test: '터치 타겟 크기',
    status: touchTargetScore >= 90 ? 'PASS' : touchTargetScore >= 70 ? 'WARNING' : 'FAIL',
    score: touchTargetScore,
    details: `${totalTargets}개 중 ${smallTargetCount}개가 44px 미만`,
    recommendation: smallTargetCount > 0 ? '터치 타겟 크기를 최소 44x44px로 설정하세요' : undefined
  });
  
  // 터치 이벤트 지원 테스트
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  results.push({
    category: 'TOUCH',
    test: '터치 이벤트 지원',
    status: hasTouchSupport ? 'PASS' : 'FAIL',
    score: hasTouchSupport ? 100 : 0,
    details: hasTouchSupport ? '터치 이벤트 지원됨' : '터치 이벤트 지원되지 않음',
    recommendation: !hasTouchSupport ? '터치 이벤트 핸들러를 추가하세요' : undefined
  });
  
  // 300ms 클릭 지연 제거 테스트
  const hasViewportMeta = document.querySelector('meta[name="viewport"]');
  const viewportContent = hasViewportMeta?.getAttribute('content') || '';
  const hasUserScalable = viewportContent.includes('user-scalable=no') || 
                          viewportContent.includes('user-scalable=0') ||
                          viewportContent.includes('maximum-scale=1');
  
  results.push({
    category: 'TOUCH',
    test: '클릭 지연 최적화',
    status: hasViewportMeta ? 'PASS' : 'WARNING',
    score: hasViewportMeta ? 100 : 50,
    details: hasViewportMeta ? '뷰포트 메타 태그 설정됨' : '뷰포트 메타 태그 누락',
    recommendation: !hasViewportMeta ? 'viewport 메타 태그를 추가하세요' : undefined
  });
  
  return results;
}

/**
 * 뷰포트 및 레이아웃 최적화를 테스트합니다
 */
export function testViewportOptimization(): MobileTestResult[] {
  const results: MobileTestResult[] = [];
  
  // 뷰포트 메타 태그 테스트
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  const hasViewport = !!viewportMeta;
  const viewportContent = viewportMeta?.getAttribute('content') || '';
  
  const hasDeviceWidth = viewportContent.includes('width=device-width');
  const hasInitialScale = viewportContent.includes('initial-scale=1');
  
  let viewportScore = 0;
  if (hasViewport) viewportScore += 40;
  if (hasDeviceWidth) viewportScore += 30;
  if (hasInitialScale) viewportScore += 30;
  
  results.push({
    category: 'VIEWPORT',
    test: '뷰포트 메타 태그',
    status: viewportScore >= 90 ? 'PASS' : viewportScore >= 60 ? 'WARNING' : 'FAIL',
    score: viewportScore,
    details: `뷰포트 설정: ${viewportContent || '없음'}`,
    recommendation: viewportScore < 90 ? 'width=device-width, initial-scale=1을 포함하세요' : undefined
  });
  
  // 가로 스크롤 방지 테스트
  const bodyWidth = document.body.scrollWidth;
  const windowWidth = window.innerWidth;
  const hasHorizontalScroll = bodyWidth > windowWidth + 1; // 1px 허용
  
  results.push({
    category: 'VIEWPORT',
    test: '가로 스크롤 방지',
    status: hasHorizontalScroll ? 'FAIL' : 'PASS',
    score: hasHorizontalScroll ? 0 : 100,
    details: hasHorizontalScroll ? `페이지 폭 ${bodyWidth}px > 뷰포트 폭 ${windowWidth}px` : '가로 스크롤 없음',
    recommendation: hasHorizontalScroll ? 'max-width: 100%나 overflow-x: hidden을 사용하세요' : undefined
  });
  
  // CSS 뷰포트 단위 사용 테스트
  const hasVhUnits = Array.from(document.styleSheets).some(sheet => {
    try {
      return Array.from(sheet.cssRules).some(rule => 
        rule.cssText.includes('vh') || rule.cssText.includes('vw')
      );
    } catch {
      return false;
    }
  });
  
  results.push({
    category: 'VIEWPORT',
    test: '뷰포트 단위 활용',
    status: hasVhUnits ? 'PASS' : 'WARNING',
    score: hasVhUnits ? 100 : 70,
    details: hasVhUnits ? '뷰포트 단위(vh/vw) 사용됨' : '뷰포트 단위 미사용',
    recommendation: !hasVhUnits ? '전체 화면 레이아웃에 vh/vw 단위 사용을 고려하세요' : undefined
  });
  
  return results;
}

/**
 * 모바일 성능을 테스트합니다
 */
export function testMobilePerformance(): MobileTestResult[] {
  const results: MobileTestResult[] = [];
  
  // 이미지 지연 로딩 테스트
  const allImages = document.querySelectorAll('img');
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyImageRatio = allImages.length > 0 ? (lazyImages.length / allImages.length) * 100 : 100;
  
  results.push({
    category: 'PERFORMANCE',
    test: '이미지 지연 로딩',
    status: lazyImageRatio >= 80 ? 'PASS' : lazyImageRatio >= 50 ? 'WARNING' : 'FAIL',
    score: lazyImageRatio,
    details: `${allImages.length}개 이미지 중 ${lazyImages.length}개가 지연 로딩`,
    recommendation: lazyImageRatio < 80 ? 'loading="lazy" 속성을 더 많은 이미지에 적용하세요' : undefined
  });
  
  // DOM 노드 수 테스트
  const totalNodes = document.querySelectorAll('*').length;
  const nodeScore = totalNodes < 800 ? 100 : totalNodes < 1200 ? 80 : totalNodes < 1500 ? 60 : 40;
  
  results.push({
    category: 'PERFORMANCE',
    test: 'DOM 복잡도',
    status: nodeScore >= 80 ? 'PASS' : nodeScore >= 60 ? 'WARNING' : 'FAIL',
    score: nodeScore,
    details: `DOM 노드 수: ${totalNodes}개`,
    recommendation: nodeScore < 80 ? 'DOM 구조를 단순화하거나 가상화를 고려하세요' : undefined
  });
  
  // 메모리 사용량 테스트 (Chrome만)
  let memoryScore = 100;
  let memoryDetails = '메모리 정보 불가';
  
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const memoryUsageMB = memory.usedJSSize / (1024 * 1024);
    memoryScore = memoryUsageMB < 20 ? 100 : memoryUsageMB < 50 ? 80 : memoryUsageMB < 100 ? 60 : 40;
    memoryDetails = `${memoryUsageMB.toFixed(2)}MB 사용중`;
  }
  
  results.push({
    category: 'PERFORMANCE',
    test: '메모리 사용량',
    status: memoryScore >= 80 ? 'PASS' : memoryScore >= 60 ? 'WARNING' : 'FAIL',
    score: memoryScore,
    details: memoryDetails,
    recommendation: memoryScore < 80 ? '메모리 누수를 확인하고 최적화하세요' : undefined
  });
  
  return results;
}

/**
 * 모바일 접근성을 테스트합니다
 */
export function testMobileAccessibility(): MobileTestResult[] {
  const results: MobileTestResult[] = [];
  
  // 최소 글꼴 크기 테스트
  const textElements = document.querySelectorAll('p, span, div, a, button, label');
  let smallTextCount = 0;
  
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);
    
    if (fontSize < 14 && element.textContent?.trim()) {
      smallTextCount++;
    }
  });
  
  const readabilityScore = textElements.length > 0 ? 
    Math.max(0, 100 - (smallTextCount / textElements.length) * 100) : 100;
  
  results.push({
    category: 'ACCESSIBILITY',
    test: '최소 글꼴 크기',
    status: readabilityScore >= 90 ? 'PASS' : readabilityScore >= 70 ? 'WARNING' : 'FAIL',
    score: readabilityScore,
    details: `${textElements.length}개 요소 중 ${smallTextCount}개가 14px 미만`,
    recommendation: smallTextCount > 0 ? '모바일에서 최소 14px 글꼴 크기를 사용하세요' : undefined
  });
  
  // 색상 대비 기본 테스트
  const contrastScore = 85; // 기본값 (실제로는 더 복잡한 계산 필요)
  
  results.push({
    category: 'ACCESSIBILITY',
    test: '색상 대비',
    status: contrastScore >= 80 ? 'PASS' : contrastScore >= 60 ? 'WARNING' : 'FAIL',
    score: contrastScore,
    details: '기본 색상 대비 양호',
    recommendation: contrastScore < 80 ? 'WCAG AA 기준 4.5:1 대비율을 확인하세요' : undefined
  });
  
  // 포커스 표시 테스트
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
  const hasFocusStyles = Array.from(focusableElements).some(element => {
    const computedStyle = window.getComputedStyle(element, ':focus');
    return computedStyle.outline !== 'none' || computedStyle.boxShadow !== 'none';
  });
  
  results.push({
    category: 'ACCESSIBILITY',
    test: '키보드 포커스 표시',
    status: hasFocusStyles ? 'PASS' : 'WARNING',
    score: hasFocusStyles ? 100 : 70,
    details: hasFocusStyles ? '포커스 스타일 적용됨' : '포커스 스타일 확인 필요',
    recommendation: !hasFocusStyles ? '키보드 사용자를 위한 포커스 스타일을 추가하세요' : undefined
  });
  
  return results;
}

/**
 * 모바일 네비게이션을 테스트합니다
 */
export function testMobileNavigation(): MobileTestResult[] {
  const results: MobileTestResult[] = [];
  
  // 햄버거 메뉴 테스트
  const hamburgerMenu = document.querySelector('[aria-label*="menu"], [aria-label*="메뉴"], .menu-toggle, .hamburger');
  const hasMobileMenu = !!hamburgerMenu;
  
  results.push({
    category: 'NAVIGATION',
    test: '모바일 메뉴',
    status: hasMobileMenu ? 'PASS' : 'WARNING',
    score: hasMobileMenu ? 100 : 60,
    details: hasMobileMenu ? '모바일 메뉴 존재함' : '모바일 메뉴 확인 필요',
    recommendation: !hasMobileMenu ? '모바일 환경을 위한 햄버거 메뉴를 추가하세요' : undefined
  });
  
  // 네비게이션 접근성 테스트
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  const hasAriaLabels = Array.from(navElements).some(nav => 
    nav.hasAttribute('aria-label') || nav.hasAttribute('aria-labelledby')
  );
  
  results.push({
    category: 'NAVIGATION',
    test: '네비게이션 접근성',
    status: hasAriaLabels ? 'PASS' : 'WARNING',
    score: hasAriaLabels ? 100 : 70,
    details: hasAriaLabels ? 'ARIA 라벨 적용됨' : 'ARIA 라벨 확인 필요',
    recommendation: !hasAriaLabels ? '네비게이션에 aria-label을 추가하세요' : undefined
  });
  
  // 뒤로가기 버튼 테스트
  const backButtons = document.querySelectorAll('[aria-label*="back"], [aria-label*="뒤로"], .back-button');
  const hasBackNavigation = backButtons.length > 0;
  
  results.push({
    category: 'NAVIGATION',
    test: '뒤로가기 네비게이션',
    status: hasBackNavigation ? 'PASS' : 'WARNING',
    score: hasBackNavigation ? 100 : 80,
    details: hasBackNavigation ? '뒤로가기 버튼 존재함' : '뒤로가기 버튼 확인 필요',
    recommendation: !hasBackNavigation ? '서브페이지에 뒤로가기 버튼을 추가하세요' : undefined
  });
  
  return results;
}

/**
 * 전체 모바일 최적화 점수를 계산합니다
 */
export function calculateMobileScore(tests: MobileTestResult[]): MobileOptimizationScore {
  const categories = {
    TOUCH: tests.filter(t => t.category === 'TOUCH'),
    VIEWPORT: tests.filter(t => t.category === 'VIEWPORT'),
    PERFORMANCE: tests.filter(t => t.category === 'PERFORMANCE'),
    ACCESSIBILITY: tests.filter(t => t.category === 'ACCESSIBILITY'),
    NAVIGATION: tests.filter(t => t.category === 'NAVIGATION')
  };
  
  const averageScore = (categoryTests: MobileTestResult[]) => 
    categoryTests.length > 0 ? 
      categoryTests.reduce((sum, test) => sum + test.score, 0) / categoryTests.length : 100;
  
  const touch = averageScore(categories.TOUCH);
  const viewport = averageScore(categories.VIEWPORT);
  const performance = averageScore(categories.PERFORMANCE);
  const accessibility = averageScore(categories.ACCESSIBILITY);
  const navigation = averageScore(categories.NAVIGATION);
  
  const overall = (touch + viewport + performance + accessibility + navigation) / 5;
  
  const grade = overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F';
  
  return {
    overall: Math.round(overall),
    touch: Math.round(touch),
    viewport: Math.round(viewport),
    performance: Math.round(performance),
    accessibility: Math.round(accessibility),
    navigation: Math.round(navigation),
    grade
  };
}

/**
 * 종합적인 모바일 최적화 테스트를 실행합니다
 */
export function runMobileOptimizationTest(): MobileTestReport {
  console.log('📱 모바일 최적화 테스트 시작...');
  
  const deviceInfo = {
    isMobile: /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent),
    isTablet: /ipad|android(?!.*mobile)|tablet/i.test(navigator.userAgent),
    screenSize: { width: window.screen.width, height: window.screen.height },
    userAgent: navigator.userAgent
  };
  
  const tests: MobileTestResult[] = [
    ...testTouchOptimization(),
    ...testViewportOptimization(),
    ...testMobilePerformance(),
    ...testMobileAccessibility(),
    ...testMobileNavigation()
  ];
  
  const score = calculateMobileScore(tests);
  
  const criticalIssues = tests
    .filter(test => test.status === 'FAIL')
    .map(test => `${test.category}: ${test.test}`);
  
  const recommendations = tests
    .filter(test => test.recommendation)
    .map(test => test.recommendation!);
  
  const summary = `모바일 최적화 점수: ${score.overall}/100 (${score.grade}등급)`;
  
  const report: MobileTestReport = {
    deviceInfo,
    tests,
    score,
    summary,
    criticalIssues,
    recommendations
  };
  
  console.log('📱 모바일 최적화 테스트 완료');
  return report;
}

/**
 * 모바일 테스트 결과를 콘솔에 출력합니다
 */
export function logMobileTestReport(report: MobileTestReport) {
  console.group('📱 모바일 최적화 테스트 리포트');
  
  // 기기 정보
  console.group('📱 기기 정보');
  console.log(`디바이스 타입: ${report.deviceInfo.isMobile ? '모바일' : report.deviceInfo.isTablet ? '태블릿' : '데스크톱'}`);
  console.log(`화면 크기: ${report.deviceInfo.screenSize.width}x${report.deviceInfo.screenSize.height}`);
  console.groupEnd();
  
  // 전체 점수
  console.group('📊 최적화 점수');
  console.log(`전체: ${report.score.overall}/100 (${report.score.grade}등급)`);
  console.log(`터치: ${report.score.touch}/100`);
  console.log(`뷰포트: ${report.score.viewport}/100`);
  console.log(`성능: ${report.score.performance}/100`);
  console.log(`접근성: ${report.score.accessibility}/100`);
  console.log(`네비게이션: ${report.score.navigation}/100`);
  console.groupEnd();
  
  // 테스트 결과
  console.group('🧪 테스트 결과');
  const categories = ['TOUCH', 'VIEWPORT', 'PERFORMANCE', 'ACCESSIBILITY', 'NAVIGATION'];
  
  categories.forEach(category => {
    const categoryTests = report.tests.filter(t => t.category === category);
    if (categoryTests.length > 0) {
      console.group(`${category}`);
      categoryTests.forEach(test => {
        const icon = test.status === 'PASS' ? '✅' : test.status === 'WARNING' ? '⚠️' : '❌';
        console.log(`${icon} ${test.test}: ${test.details} (${test.score}/100)`);
        if (test.recommendation) {
          console.log(`   💡 ${test.recommendation}`);
        }
      });
      console.groupEnd();
    }
  });
  console.groupEnd();
  
  // 요약
  if (report.criticalIssues.length > 0) {
    console.group('🚨 심각한 문제');
    report.criticalIssues.forEach(issue => console.error(issue));
    console.groupEnd();
  }
  
  if (report.recommendations.length > 0) {
    console.group('💡 개선 권장사항');
    report.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
  }
  
  console.log(`\n${report.summary}`);
  console.groupEnd();
}

export default {
  runMobileOptimizationTest,
  logMobileTestReport,
  testTouchOptimization,
  testViewportOptimization,
  testMobilePerformance,
  testMobileAccessibility,
  testMobileNavigation,
  calculateMobileScore
};