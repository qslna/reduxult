/**
 * Content Storage Management
 * 페이지 콘텐츠 저장 및 관리 시스템
 */

interface ContentItem {
  id: string;
  page: string;
  section: string;
  type: 'text' | 'image' | 'video' | 'link';
  content: string;
  metadata?: Record<string, any>;
  updatedAt: string;
}

class ContentStorage {
  private storageKey = 'redux-content-storage';

  // 콘텐츠 저장
  saveContent(page: string, section: string, content: string, type: 'text' | 'image' | 'video' | 'link' = 'text'): void {
    const items = this.getAll();
    const id = `${page}-${section}`;
    
    const contentItem: ContentItem = {
      id,
      page,
      section,
      type,
      content,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = items.findIndex(item => item.id === id);
    if (existingIndex !== -1) {
      items[existingIndex] = contentItem;
    } else {
      items.push(contentItem);
    }

    this.saveAll(items);
  }

  // 콘텐츠 조회
  getContent(page: string, section: string, defaultContent: string = ''): string {
    const items = this.getAll();
    const item = items.find(item => item.page === page && item.section === section);
    return item?.content || defaultContent;
  }

  // 페이지별 모든 콘텐츠 조회
  getPageContent(page: string): ContentItem[] {
    const items = this.getAll();
    return items.filter(item => item.page === page);
  }

  // 모든 콘텐츠 조회
  getAll(): ContentItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse stored content:', error);
      return [];
    }
  }

  // 모든 콘텐츠 저장
  private saveAll(items: ContentItem[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  }

  // 콘텐츠 삭제
  deleteContent(page: string, section: string): void {
    const items = this.getAll();
    const filteredItems = items.filter(item => !(item.page === page && item.section === section));
    this.saveAll(filteredItems);
  }

  // 페이지의 모든 콘텐츠 삭제
  deletePageContent(page: string): void {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.page !== page);
    this.saveAll(filteredItems);
  }

  // 모든 콘텐츠 삭제 (초기화)
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }

  // 콘텐츠 내보내기 (백업용)
  exportContent(): string {
    const items = this.getAll();
    return JSON.stringify(items, null, 2);
  }

  // 콘텐츠 가져오기 (복원용)
  importContent(jsonData: string): boolean {
    try {
      const items = JSON.parse(jsonData);
      if (Array.isArray(items)) {
        this.saveAll(items);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import content:', error);
      return false;
    }
  }

  // 통계 정보
  getStats() {
    const items = this.getAll();
    const stats = {
      totalItems: items.length,
      byPage: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      lastUpdated: items.length > 0 ? Math.max(...items.map(item => new Date(item.updatedAt).getTime())) : 0
    };

    items.forEach(item => {
      stats.byPage[item.page] = (stats.byPage[item.page] || 0) + 1;
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    });

    return stats;
  }
}

// 싱글톤 인스턴스
export const contentStorage = new ContentStorage();

// 기본 콘텐츠 데이터
export const defaultContent = {
  home: {
    'hero-title': 'REDUX',
    'hero-subtitle': 'THE ROOM OF [ ]',
    'hero-cta-primary': 'DISCOVER REDUX',
    'hero-cta-secondary': 'VIEW EXHIBITIONS'
  },
  about: {
    'page-title': 'About REDUX',
    'page-subtitle': 'A collective of five fashion designers pushing boundaries'
  },
  designers: {
    'page-title': 'Our Designers',
    'page-subtitle': 'Meet the creative minds behind REDUX'
  },
  exhibitions: {
    'page-title': 'Exhibitions',
    'page-subtitle': 'Our latest showcases and collaborative works'
  },
  contact: {
    'page-title': 'Contact',
    'page-subtitle': 'Get in touch with REDUX'
  }
};

// 유틸리티 함수들
export const contentUtils = {
  // 텍스트 길이 검증
  validateTextLength: (text: string, maxLength: number = 200): boolean => {
    return text.length <= maxLength;
  },

  // HTML 태그 제거
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
  },

  // 콘텐츠 타입 감지
  detectContentType: (content: string): 'text' | 'image' | 'video' | 'link' => {
    if (content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
    if (content.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    if (content.match(/^https?:\/\//)) return 'link';
    return 'text';
  },

  // 콘텐츠 미리보기 생성
  generatePreview: (content: string, maxLength: number = 50): string => {
    const stripped = contentUtils.stripHtml(content);
    return stripped.length > maxLength 
      ? stripped.substring(0, maxLength) + '...'
      : stripped;
  }
};

export default contentStorage;