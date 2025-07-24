// Accessibility System - 웹 접근성 최적화 시스템
// WCAG 2.1 AA 준수 및 한국 웹 접근성 지침 준수

export interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  enableFocusTrapping: boolean;
  announcePageChanges: boolean;
  skipLinkTarget: string;
}

// 기본 접근성 설정
export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  enableKeyboardNavigation: true,
  enableScreenReader: true,
  enableHighContrast: true,
  enableReducedMotion: true,
  enableFocusTrapping: true,
  announcePageChanges: true,
  skipLinkTarget: 'main-content'
};

// ARIA 역할 및 속성 관리
export const ARIA_ROLES = {
  // 랜드마크 역할
  landmarks: {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo',
    search: 'search',
    form: 'form',
    region: 'region'
  },

  // 위젯 역할
  widgets: {
    button: 'button',
    link: 'link',
    menubar: 'menubar',
    menu: 'menu',
    menuitem: 'menuitem',
    tab: 'tab',
    tabpanel: 'tabpanel',
    tablist: 'tablist',
    dialog: 'dialog',
    alertdialog: 'alertdialog',
    tooltip: 'tooltip',
    status: 'status',
    alert: 'alert',
    progressbar: 'progressbar',
    slider: 'slider',
    spinbutton: 'spinbutton',
    textbox: 'textbox',
    combobox: 'combobox',
    listbox: 'listbox',
    option: 'option',
    grid: 'grid',
    gridcell: 'gridcell',
    tree: 'tree',
    treeitem: 'treeitem'
  },

  // 문서 구조 역할
  structure: {
    article: 'article',
    section: 'section',
    heading: 'heading',
    list: 'list',
    listitem: 'listitem',
    table: 'table',
    row: 'row',
    cell: 'cell',
    columnheader: 'columnheader',
    rowheader: 'rowheader',
    group: 'group',
    presentation: 'presentation',
    none: 'none'
  }
} as const;

// ARIA 속성 헬퍼
export const ariaHelpers = {
  // 기본 ARIA 속성 생성
  createAriaProps: (config: {
    role?: string;
    label?: string;
    describedBy?: string;
    labelledBy?: string;
    expanded?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    live?: 'polite' | 'assertive' | 'off';
    atomic?: boolean;
    busy?: boolean;
    controls?: string;
    owns?: string;
    flowTo?: string;
    hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
    level?: number;
    posInSet?: number;
    setSize?: number;
  }) => {
    const ariaProps: Record<string, any> = {};

    if (config.role) ariaProps.role = config.role;
    if (config.label) ariaProps['aria-label'] = config.label;
    if (config.describedBy) ariaProps['aria-describedby'] = config.describedBy;
    if (config.labelledBy) ariaProps['aria-labelledby'] = config.labelledBy;
    if (config.expanded !== undefined) ariaProps['aria-expanded'] = config.expanded;
    if (config.hidden !== undefined) ariaProps['aria-hidden'] = config.hidden;
    if (config.disabled !== undefined) ariaProps['aria-disabled'] = config.disabled;
    if (config.required !== undefined) ariaProps['aria-required'] = config.required;
    if (config.invalid !== undefined) ariaProps['aria-invalid'] = config.invalid;
    if (config.live) ariaProps['aria-live'] = config.live;
    if (config.atomic !== undefined) ariaProps['aria-atomic'] = config.atomic;
    if (config.busy !== undefined) ariaProps['aria-busy'] = config.busy;
    if (config.controls) ariaProps['aria-controls'] = config.controls;
    if (config.owns) ariaProps['aria-owns'] = config.owns;
    if (config.flowTo) ariaProps['aria-flowto'] = config.flowTo;
    if (config.hasPopup !== undefined) ariaProps['aria-haspopup'] = config.hasPopup;
    if (config.current !== undefined) ariaProps['aria-current'] = config.current;
    if (config.level !== undefined) ariaProps['aria-level'] = config.level;
    if (config.posInSet !== undefined) ariaProps['aria-posinset'] = config.posInSet;
    if (config.setSize !== undefined) ariaProps['aria-setsize'] = config.setSize;

    return ariaProps;
  },

  // 네비게이션 ARIA 속성
  createNavigationAria: (isExpanded: boolean, controls?: string) => ({
    role: 'navigation',
    'aria-label': '주 네비게이션',
    'aria-expanded': isExpanded,
    ...(controls && { 'aria-controls': controls })
  }),

  // 버튼 ARIA 속성
  createButtonAria: (label: string, pressed?: boolean, controls?: string) => ({
    role: 'button',
    'aria-label': label,
    ...(pressed !== undefined && { 'aria-pressed': pressed }),
    ...(controls && { 'aria-controls': controls })
  }),

  // 링크 ARIA 속성
  createLinkAria: (label: string, current?: boolean) => ({
    'aria-label': label,
    ...(current && { 'aria-current': 'page' })
  }),

  // 이미지 ARIA 속성
  createImageAria: (alt: string, decorative: boolean = false) => {
    if (decorative) {
      return {
        role: 'presentation',
        'aria-hidden': true,
        alt: ''
      };
    }
    return {
      alt,
      'aria-describedby': alt ? undefined : 'image-description'
    };
  },

  // 폼 ARIA 속성
  createFormAria: (label: string, required: boolean = false, invalid: boolean = false, describedBy?: string) => ({
    'aria-label': label,
    'aria-required': required,
    'aria-invalid': invalid,
    ...(describedBy && { 'aria-describedby': describedBy })
  })
};

// 키보드 네비게이션 관리
export class KeyboardNavigationManager {
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private trapFocus = false;
  private container: HTMLElement | null = null;

  constructor(container?: HTMLElement) {
    this.container = container || document.body;
    this.updateFocusableElements();
    this.bindEvents();
  }

  // 포커스 가능한 요소 업데이트
  updateFocusableElements() {
    if (!this.container) return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    this.focusableElements = Array.from(
      this.container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }

  // 키보드 이벤트 바인딩
  private bindEvents() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  // 키보드 이벤트 처리
  private handleKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey, altKey, shiftKey } = event;

    // 포커스 트랩이 활성화된 경우 Tab 키 처리
    if (this.trapFocus && key === 'Tab') {
      this.handleTabNavigation(event);
      return;
    }

    // 스킵 링크 (Ctrl + /)
    if (ctrlKey && key === '/') {
      event.preventDefault();
      this.activateSkipLink();
      return;
    }

    // 접근성 단축키
    switch (key) {
      case 'Escape':
        this.handleEscape();
        break;
      case 'Home':
        if (ctrlKey) {
          event.preventDefault();
          this.focusFirst();
        }
        break;
      case 'End':
        if (ctrlKey) {
          event.preventDefault();
          this.focusLast();
        }
        break;
      case 'F6':
        event.preventDefault();
        this.focusNextLandmark();
        break;
    }
  }

  // Tab 네비게이션 처리
  private handleTabNavigation(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab (이전 요소로)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab (다음 요소로)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  // Escape 키 처리
  private handleEscape() {
    // 모달이나 드롭다운 닫기
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');

    if (openModals.length > 0) {
      const lastModal = openModals[openModals.length - 1] as HTMLElement;
      this.closeModal(lastModal);
    } else if (openDropdowns.length > 0) {
      openDropdowns.forEach(dropdown => {
        (dropdown as HTMLElement).setAttribute('aria-expanded', 'false');
      });
    }
  }

  // 첫 번째 요소로 포커스
  focusFirst() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
      this.currentFocusIndex = 0;
    }
  }

  // 마지막 요소로 포커스
  focusLast() {
    if (this.focusableElements.length > 0) {
      const lastIndex = this.focusableElements.length - 1;
      this.focusableElements[lastIndex].focus();
      this.currentFocusIndex = lastIndex;
    }
  }

  // 다음 랜드마크로 포커스
  private focusNextLandmark() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    
    if (landmarks.length === 0) return;

    const currentLandmark = document.activeElement?.closest('[role]');
    let nextIndex = 0;

    if (currentLandmark) {
      const currentIndex = Array.from(landmarks).indexOf(currentLandmark as Element);
      nextIndex = (currentIndex + 1) % landmarks.length;
    }

    (landmarks[nextIndex] as HTMLElement).focus();
  }

  // 스킵 링크 활성화
  private activateSkipLink() {
    const skipLink = document.querySelector('a[href^="#skip"]') as HTMLElement;
    if (skipLink) {
      skipLink.focus();
      skipLink.click();
    }
  }

  // 모달 닫기
  private closeModal(modal: HTMLElement) {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    
    // 이전 포커스 복원
    const previousFocus = modal.getAttribute('data-previous-focus');
    if (previousFocus) {
      const element = document.getElementById(previousFocus);
      if (element) element.focus();
    }
  }

  // 포커스 트랩 활성화/비활성화
  setFocusTrap(enabled: boolean, container?: HTMLElement) {
    this.trapFocus = enabled;
    if (container) {
      this.container = container;
      this.updateFocusableElements();
    }
  }

  // 정리
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}

// 스크린 리더 공지사항 관리
export class ScreenReaderAnnouncer {
  private liveRegion: HTMLElement | null = null;
  private politeRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegions();
  }

  // Live region 생성
  private createLiveRegions() {
    // Assertive live region (즉시 공지)
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'assertive');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'sr-only');
    this.liveRegion.id = 'live-announcer';
    
    // Polite live region (대기 후 공지)
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.setAttribute('class', 'sr-only');
    this.politeRegion.id = 'polite-announcer';

    // DOM에 추가
    document.body.appendChild(this.liveRegion);
    document.body.appendChild(this.politeRegion);
  }

  // 즉시 공지 (assertive)
  announce(message: string) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      
      // 메시지 초기화 (재사용을 위해)
      setTimeout(() => {
        if (this.liveRegion) this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  // 대기 후 공지 (polite)
  announcePolite(message: string) {
    if (this.politeRegion) {
      this.politeRegion.textContent = message;
      
      setTimeout(() => {
        if (this.politeRegion) this.politeRegion.textContent = '';
      }, 1000);
    }
  }

  // 페이지 변경 공지
  announcePageChange(pageName: string) {
    this.announce(`${pageName} 페이지로 이동했습니다.`);
  }

  // 로딩 상태 공지
  announceLoading(isLoading: boolean) {
    if (isLoading) {
      this.announce('내용을 불러오는 중입니다.');
    } else {
      this.announcePolite('내용 로딩이 완료되었습니다.');
    }
  }

  // 에러 공지
  announceError(error: string) {
    this.announce(`오류가 발생했습니다: ${error}`);
  }

  // 성공 공지
  announceSuccess(message: string) {
    this.announcePolite(`완료: ${message}`);
  }
}

// 고대비 모드 관리
export class HighContrastManager {
  private isHighContrast = false;
  
  constructor() {
    this.detectSystemPreference();
    this.bindEvents();
  }

  // 시스템 고대비 모드 감지
  private detectSystemPreference() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      this.isHighContrast = mediaQuery.matches;
      this.applyHighContrast(this.isHighContrast);
    }
  }

  // 이벤트 바인딩
  private bindEvents() {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      mediaQuery.addEventListener('change', (e) => {
        this.isHighContrast = e.matches;
        this.applyHighContrast(this.isHighContrast);
      });
    }
  }

  // 고대비 모드 적용
  private applyHighContrast(enabled: boolean) {
    if (typeof document !== 'undefined') {
      if (enabled) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  }

  // 수동 토글
  toggle() {
    this.isHighContrast = !this.isHighContrast;
    this.applyHighContrast(this.isHighContrast);
    
    // 로컬 스토리지에 저장
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('high-contrast', this.isHighContrast.toString());
    }
  }

  // 현재 상태 반환
  getState() {
    return this.isHighContrast;
  }
}

// 접근성 도구 모음
export class AccessibilityToolkit {
  private keyboardManager: KeyboardNavigationManager;
  private announcer: ScreenReaderAnnouncer;
  private contrastManager: HighContrastManager;
  private config: AccessibilityConfig;

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = { ...DEFAULT_ACCESSIBILITY_CONFIG, ...config };
    
    // 접근성 도구 초기화
    this.keyboardManager = new KeyboardNavigationManager();
    this.announcer = new ScreenReaderAnnouncer();
    this.contrastManager = new HighContrastManager();
    
    this.init();
  }

  // 초기화
  private init() {
    this.addSkipLinks();
    this.enhanceFormAccessibility();
    this.addLandmarkRoles();
    this.improveImageAccessibility();
  }

  // 스킵 링크 추가
  private addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = `#${this.config.skipLinkTarget}`;
    skipLink.textContent = '본문으로 바로가기';
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-black focus:text-white';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // 폼 접근성 향상
  private enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // 필수 필드에 aria-required 추가
      const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
      requiredFields.forEach(field => {
        field.setAttribute('aria-required', 'true');
      });

      // 에러 메시지와 필드 연결
      const errorMessages = form.querySelectorAll('.error-message, [data-error]');
      errorMessages.forEach((error, index) => {
        const errorId = `error-${index}`;
        error.id = errorId;
        
        const relatedField = error.getAttribute('data-field') || error.previousElementSibling;
        if (relatedField && typeof relatedField === 'object') {
          (relatedField as Element).setAttribute('aria-describedby', errorId);
          (relatedField as Element).setAttribute('aria-invalid', 'true');
        }
      });
    });
  }

  // 랜드마크 역할 추가
  private addLandmarkRoles() {
    // 메인 컨텐츠
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
      main.id = this.config.skipLinkTarget;
    }

    // 네비게이션
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', '주 네비게이션');
    }

    // 푸터
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // 헤더
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  }

  // 이미지 접근성 개선
  private improveImageAccessibility() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // alt가 없는 이미지 처리
      if (!img.getAttribute('alt')) {
        // 장식적 이미지로 간주
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }

      // 로딩 상태 공지
      img.addEventListener('load', () => {
        if (img.getAttribute('data-announce-load') === 'true') {
          this.announcer.announcePolite('이미지 로딩 완료');
        }
      });

      img.addEventListener('error', () => {
        this.announcer.announceError('이미지 로딩 실패');
      });
    });
  }

  // 페이지 변경 공지
  announcePageChange(pageName: string) {
    if (this.config.announcePageChanges) {
      this.announcer.announcePageChange(pageName);
    }
  }

  // 접근성 도구 정리
  destroy() {
    this.keyboardManager.destroy();
  }
}

// 접근성 유틸리티 함수
export const accessibilityUtils = {
  // 색상 대비 검사
  checkColorContrast: (foreground: string, background: string): number => {
    // 간단한 색상 대비 계산 (실제로는 더 복잡한 알고리즘 필요)
    const getLuminance = (color: string): number => {
      // RGB 값 추출 및 휘도 계산
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(n => {
        const val = parseInt(n) / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  // WCAG AA 준수 확인
  isWCAGAACompliant: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
  },

  // WCAG AAA 준수 확인
  isWCAGAAACompliant: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7;
  },

  // 포커스 관리
  manageFocus: {
    // 요소에 포커스 (스크롤 방지 옵션)
    focusElement: (element: HTMLElement, preventScroll: boolean = false) => {
      element.focus({ preventScroll });
    },

    // 첫 번째 포커스 가능한 요소에 포커스
    focusFirst: (container: HTMLElement) => {
      const focusable = container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (focusable) focusable.focus();
    },

    // 포커스 저장 및 복원
    saveFocus: (): HTMLElement | null => {
      return document.activeElement as HTMLElement;
    },

    restoreFocus: (element: HTMLElement | null) => {
      if (element && element.focus) {
        element.focus();
      }
    }
  }
};

// 전역 접근성 초기화
export const initializeAccessibility = (config?: Partial<AccessibilityConfig>) => {
  if (typeof window === 'undefined') return null;
  
  return new AccessibilityToolkit(config);
};