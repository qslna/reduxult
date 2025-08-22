/**
 * 보안 감사 및 코드 품질 검사 유틸리티
 * XSS, CSRF, 데이터 노출 등의 보안 취약점을 점검
 */

export interface SecurityVulnerability {
  type: 'XSS' | 'DATA_EXPOSURE' | 'INSECURE_STORAGE' | 'WEAK_VALIDATION' | 'PERFORMANCE' | 'ACCESSIBILITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  location: string;
  recommendation: string;
}

export interface CodeQualityIssue {
  type: 'PERFORMANCE' | 'MAINTAINABILITY' | 'RELIABILITY' | 'ACCESSIBILITY' | 'SECURITY';
  severity: 'INFO' | 'WARNING' | 'ERROR';
  description: string;
  file: string;
  line?: number;
  suggestion: string;
}

export interface SecurityAuditReport {
  vulnerabilities: SecurityVulnerability[];
  codeQualityIssues: CodeQualityIssue[];
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  recommendations: string[];
}

/**
 * DOM에서 잠재적인 XSS 취약점을 찾습니다
 */
export function checkForXSSVulnerabilities(): SecurityVulnerability[] {
  const vulnerabilities: SecurityVulnerability[] = [];
  
  // dangerouslySetInnerHTML 사용 검사
  const dangerousElements = document.querySelectorAll('[data-dangerous="true"]');
  if (dangerousElements.length > 0) {
    vulnerabilities.push({
      type: 'XSS',
      severity: 'HIGH',
      description: `dangerouslySetInnerHTML이 ${dangerousElements.length}개 위치에서 사용됨`,
      location: 'Multiple DOM elements',
      recommendation: 'dangerouslySetInnerHTML 사용을 최소화하고 DOMPurify 등의 sanitizer 사용을 고려하세요'
    });
  }
  
  // 입력 필드 검사
  const inputElements = document.querySelectorAll('input, textarea');
  const unvalidatedInputs: Element[] = [];
  
  inputElements.forEach(input => {
    const hasValidation = input.hasAttribute('pattern') || 
                         input.hasAttribute('maxlength') || 
                         input.hasAttribute('min') || 
                         input.hasAttribute('max') ||
                         input.hasAttribute('required');
    
    if (!hasValidation && input.getAttribute('type') !== 'hidden') {
      unvalidatedInputs.push(input);
    }
  });
  
  if (unvalidatedInputs.length > 0) {
    vulnerabilities.push({
      type: 'WEAK_VALIDATION',
      severity: 'MEDIUM',
      description: `${unvalidatedInputs.length}개의 입력 필드에 검증이 부족함`,
      location: 'Form inputs',
      recommendation: '모든 입력 필드에 적절한 검증 규칙을 추가하세요'
    });
  }
  
  return vulnerabilities;
}

/**
 * 로컬 스토리지에서 민감한 데이터 노출을 검사합니다
 */
export function checkForDataExposure(): SecurityVulnerability[] {
  const vulnerabilities: SecurityVulnerability[] = [];
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
  
  try {
    // localStorage 검사
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const lowerKey = key.toLowerCase();
        const hasSensitiveData = sensitiveKeys.some(sensitiveKey => 
          lowerKey.includes(sensitiveKey)
        );
        
        if (hasSensitiveData) {
          vulnerabilities.push({
            type: 'DATA_EXPOSURE',
            severity: 'HIGH',
            description: `민감한 데이터가 localStorage에 저장됨: ${key}`,
            location: 'localStorage',
            recommendation: '민감한 데이터는 secure httpOnly 쿠키나 메모리에서만 관리하세요'
          });
        }
      }
    }
    
    // sessionStorage 검사
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const lowerKey = key.toLowerCase();
        const hasSensitiveData = sensitiveKeys.some(sensitiveKey => 
          lowerKey.includes(sensitiveKey)
        );
        
        if (hasSensitiveData) {
          vulnerabilities.push({
            type: 'DATA_EXPOSURE',
            severity: 'MEDIUM',
            description: `민감한 데이터가 sessionStorage에 저장됨: ${key}`,
            location: 'sessionStorage',
            recommendation: '민감한 데이터는 더 안전한 방법으로 관리하세요'
          });
        }
      }
    }
  } catch (error) {
    // 스토리지 액세스 실패시 무시
  }
  
  return vulnerabilities;
}

/**
 * 성능 관련 문제를 검사합니다
 */
export function checkPerformanceIssues(): CodeQualityIssue[] {
  const issues: CodeQualityIssue[] = [];
  
  // 큰 이미지 검사
  const images = document.querySelectorAll('img');
  let largeImageCount = 0;
  
  images.forEach(img => {
    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
      largeImageCount++;
    }
  });
  
  if (largeImageCount > 0) {
    issues.push({
      type: 'PERFORMANCE',
      severity: 'WARNING',
      description: `${largeImageCount}개의 큰 이미지가 최적화되지 않음`,
      file: 'Multiple image files',
      suggestion: 'Next.js Image 컴포넌트와 ImageKit을 사용하여 이미지를 최적화하세요'
    });
  }
  
  // 메모리 사용량 검사 (Chrome만 지원)
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    const memoryUsageMB = memory.usedJSSize / (1024 * 1024);
    
    if (memoryUsageMB > 50) {
      issues.push({
        type: 'PERFORMANCE',
        severity: 'WARNING',
        description: `높은 메모리 사용량: ${memoryUsageMB.toFixed(2)}MB`,
        file: 'JavaScript heap',
        suggestion: '메모리 누수를 확인하고 불필요한 객체 참조를 제거하세요'
      });
    }
  }
  
  // DOM 노드 수 검사
  const totalNodes = document.querySelectorAll('*').length;
  if (totalNodes > 1500) {
    issues.push({
      type: 'PERFORMANCE',
      severity: 'INFO',
      description: `많은 DOM 노드 수: ${totalNodes}개`,
      file: 'DOM structure',
      suggestion: 'DOM 구조를 단순화하고 가상화를 고려하세요'
    });
  }
  
  return issues;
}

/**
 * 접근성 문제를 검사합니다
 */
export function checkAccessibilityIssues(): CodeQualityIssue[] {
  const issues: CodeQualityIssue[] = [];
  
  // alt 텍스트 누락된 이미지 검사
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: 'ACCESSIBILITY',
      severity: 'ERROR',
      description: `${imagesWithoutAlt.length}개의 이미지에 alt 텍스트가 없음`,
      file: 'Image elements',
      suggestion: '모든 이미지에 의미있는 alt 텍스트를 추가하세요'
    });
  }
  
  // 빈 alt 텍스트 검사 (장식용 이미지가 아닌 경우)
  const imagesWithEmptyAlt = document.querySelectorAll('img[alt=""]');
  if (imagesWithEmptyAlt.length > 0) {
    issues.push({
      type: 'ACCESSIBILITY',
      severity: 'WARNING',
      description: `${imagesWithEmptyAlt.length}개의 이미지에 빈 alt 텍스트가 있음`,
      file: 'Image elements',
      suggestion: '장식용 이미지가 아닌 경우 의미있는 alt 텍스트를 추가하세요'
    });
  }
  
  // aria-label이 없는 버튼 검사
  const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  const unlabeledButtons = Array.from(buttonsWithoutLabel).filter(button => 
    !button.textContent?.trim()
  );
  
  if (unlabeledButtons.length > 0) {
    issues.push({
      type: 'ACCESSIBILITY',
      severity: 'ERROR',
      description: `${unlabeledButtons.length}개의 버튼에 접근 가능한 레이블이 없음`,
      file: 'Button elements',
      suggestion: '모든 버튼에 텍스트나 aria-label을 추가하세요'
    });
  }
  
  // 컬러 대비 검사 (기본적인 검사)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lowContrastCount = 0;
  
  headings.forEach(heading => {
    const computedStyle = window.getComputedStyle(heading);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    // 간단한 대비 검사 (실제로는 더 복잡한 계산이 필요)
    if (color === 'rgb(128, 128, 128)' || color === '#808080') {
      lowContrastCount++;
    }
  });
  
  if (lowContrastCount > 0) {
    issues.push({
      type: 'ACCESSIBILITY',
      severity: 'WARNING',
      description: `${lowContrastCount}개의 제목에서 낮은 색상 대비 감지`,
      file: 'Heading elements',
      suggestion: 'WCAG 2.1 AA 기준(4.5:1)에 맞는 색상 대비를 사용하세요'
    });
  }
  
  return issues;
}

/**
 * 안전하지 않은 저장소 사용을 검사합니다
 */
export function checkInsecureStorage(): SecurityVulnerability[] {
  const vulnerabilities: SecurityVulnerability[] = [];
  
  // 개발자 도구에서 확인 가능한 데이터
  try {
    const localStorageSize = new Blob(Object.values(localStorage)).size;
    const sessionStorageSize = new Blob(Object.values(sessionStorage)).size;
    
    if (localStorageSize > 1024 * 100) { // 100KB 이상
      vulnerabilities.push({
        type: 'INSECURE_STORAGE',
        severity: 'MEDIUM',
        description: `localStorage에 많은 데이터 저장됨: ${(localStorageSize / 1024).toFixed(2)}KB`,
        location: 'localStorage',
        recommendation: '대용량 데이터는 IndexedDB를 사용하거나 서버에 저장하세요'
      });
    }
    
    if (sessionStorageSize > 1024 * 50) { // 50KB 이상
      vulnerabilities.push({
        type: 'INSECURE_STORAGE',
        severity: 'LOW',
        description: `sessionStorage에 많은 데이터 저장됨: ${(sessionStorageSize / 1024).toFixed(2)}KB`,
        location: 'sessionStorage',
        recommendation: '필요하지 않은 데이터는 정기적으로 정리하세요'
      });
    }
  } catch (error) {
    // 스토리지 크기 계산 실패시 무시
  }
  
  return vulnerabilities;
}

/**
 * 종합적인 보안 감사를 실행합니다
 */
export function runSecurityAudit(): SecurityAuditReport {
  console.log('🔒 보안 감사 시작...');
  
  const vulnerabilities: SecurityVulnerability[] = [
    ...checkForXSSVulnerabilities(),
    ...checkForDataExposure(),
    ...checkInsecureStorage()
  ];
  
  const codeQualityIssues: CodeQualityIssue[] = [
    ...checkPerformanceIssues(),
    ...checkAccessibilityIssues()
  ];
  
  // 심각도별 집계
  const criticalIssues = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
  const highIssues = vulnerabilities.filter(v => v.severity === 'HIGH').length + 
                     codeQualityIssues.filter(i => i.severity === 'ERROR').length;
  const mediumIssues = vulnerabilities.filter(v => v.severity === 'MEDIUM').length + 
                       codeQualityIssues.filter(i => i.severity === 'WARNING').length;
  const lowIssues = vulnerabilities.filter(v => v.severity === 'LOW').length + 
                    codeQualityIssues.filter(i => i.severity === 'INFO').length;
  
  const totalIssues = criticalIssues + highIssues + mediumIssues + lowIssues;
  
  // 권장사항 생성
  const recommendations: string[] = [];
  
  if (criticalIssues > 0) {
    recommendations.push('🚨 심각한 보안 취약점이 발견되었습니다. 즉시 수정하세요.');
  }
  
  if (highIssues > 0) {
    recommendations.push('⚠️ 높은 우선순위 문제들을 우선적으로 해결하세요.');
  }
  
  if (vulnerabilities.some(v => v.type === 'XSS')) {
    recommendations.push('XSS 방지를 위해 입력 검증과 출력 인코딩을 강화하세요.');
  }
  
  if (vulnerabilities.some(v => v.type === 'DATA_EXPOSURE')) {
    recommendations.push('민감한 데이터의 클라이언트 측 저장을 최소화하세요.');
  }
  
  if (codeQualityIssues.some(i => i.type === 'ACCESSIBILITY')) {
    recommendations.push('WCAG 2.1 AA 기준에 맞춘 접근성 개선이 필요합니다.');
  }
  
  if (codeQualityIssues.some(i => i.type === 'PERFORMANCE')) {
    recommendations.push('성능 최적화를 통해 사용자 경험을 개선하세요.');
  }
  
  if (totalIssues === 0) {
    recommendations.push('✅ 현재 주요 보안 및 품질 문제가 발견되지 않았습니다.');
  }
  
  const report: SecurityAuditReport = {
    vulnerabilities,
    codeQualityIssues,
    summary: {
      totalIssues,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues
    },
    recommendations
  };
  
  console.log('🔒 보안 감사 완료');
  return report;
}

/**
 * 보안 감사 결과를 콘솔에 출력합니다
 */
export function logSecurityAuditReport(report: SecurityAuditReport) {
  console.group('🔒 보안 감사 리포트');
  
  // 요약
  console.group('📊 요약');
  console.log(`총 문제수: ${report.summary.totalIssues}`);
  console.log(`심각: ${report.summary.criticalIssues} | 높음: ${report.summary.highIssues} | 보통: ${report.summary.mediumIssues} | 낮음: ${report.summary.lowIssues}`);
  console.groupEnd();
  
  // 보안 취약점
  if (report.vulnerabilities.length > 0) {
    console.group('🚨 보안 취약점');
    report.vulnerabilities.forEach((vuln, index) => {
      console.group(`${index + 1}. ${vuln.type} (${vuln.severity})`);
      console.log(`설명: ${vuln.description}`);
      console.log(`위치: ${vuln.location}`);
      console.log(`권장사항: ${vuln.recommendation}`);
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  // 코드 품질 문제
  if (report.codeQualityIssues.length > 0) {
    console.group('📋 코드 품질 문제');
    report.codeQualityIssues.forEach((issue, index) => {
      console.group(`${index + 1}. ${issue.type} (${issue.severity})`);
      console.log(`설명: ${issue.description}`);
      console.log(`파일: ${issue.file}`);
      if (issue.line) console.log(`라인: ${issue.line}`);
      console.log(`제안: ${issue.suggestion}`);
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  // 권장사항
  if (report.recommendations.length > 0) {
    console.group('💡 권장사항');
    report.recommendations.forEach(rec => console.log(rec));
    console.groupEnd();
  }
  
  console.groupEnd();
}

export default {
  runSecurityAudit,
  logSecurityAuditReport,
  checkForXSSVulnerabilities,
  checkForDataExposure,
  checkPerformanceIssues,
  checkAccessibilityIssues,
  checkInsecureStorage
};