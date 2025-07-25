/**
 * Google Drive 동영상 유틸리티
 * REDUX 포트폴리오 웹사이트용 Google Drive 동영상 임베드 시스템
 */

interface DesignerVideo {
  name: string;
  driveId: string;
  embedUrl: string;
  previewUrl: string;
}

// 디자이너별 Google Drive 동영상 매핑 (업데이트된 구조)
export const DESIGNER_VIDEOS: Record<string, DesignerVideo> = {
  parkparang: {
    name: 'Park Parang',
    driveId: '15d901XRElkF5p7xiJYelIyblYFb-PtsD',
    embedUrl: 'https://drive.google.com/file/d/15d901XRElkF5p7xiJYelIyblYFb-PtsD/preview',
    previewUrl: 'https://drive.google.com/file/d/15d901XRElkF5p7xiJYelIyblYFb-PtsD/view?usp=drive_link'
  },
  leetaehyeon: {
    name: 'Lee Taehyeon',
    driveId: '1fG2fchKvEG7i7Lo79K7250mgiVTse6ks',
    embedUrl: 'https://drive.google.com/file/d/1fG2fchKvEG7i7Lo79K7250mgiVTse6ks/preview',
    previewUrl: 'https://drive.google.com/file/d/1fG2fchKvEG7i7Lo79K7250mgiVTse6ks/view?usp=drive_link'
  },
  kimgyeongsu: {
    name: 'Kim Gyeongsu',
    driveId: '1Hl594dd_MY714hZwmklTAPTc-pofe9bY',
    embedUrl: 'https://drive.google.com/file/d/1Hl594dd_MY714hZwmklTAPTc-pofe9bY/preview',
    previewUrl: 'https://drive.google.com/file/d/1Hl594dd_MY714hZwmklTAPTc-pofe9bY/view?usp=drive_link'
  },
  kimbomin: {
    name: 'Kim Bomin',
    driveId: '1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X',
    embedUrl: 'https://drive.google.com/file/d/1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X/preview',
    previewUrl: 'https://drive.google.com/file/d/1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X/view?usp=drive_link'
  },
  hwangjinsu: {
    name: 'Hwang Jinsu',
    driveId: '1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d',
    embedUrl: 'https://drive.google.com/file/d/1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d/preview',
    previewUrl: 'https://drive.google.com/file/d/1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d/view?usp=drive_link'
  },
  choieunsol: {
    name: 'Choi Eunsol',
    driveId: '1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3',
    embedUrl: 'https://drive.google.com/file/d/1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3/preview',
    previewUrl: 'https://drive.google.com/file/d/1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3/view?usp=drive_link'
  }
};

// 기존 호환성을 위한 FASHION_FILM_IDS 매핑
export const FASHION_FILM_IDS = Object.fromEntries(
  Object.entries(DESIGNER_VIDEOS).map(([slug, video]) => [`designer-${slug}`, video.driveId])
);

/**
 * Google Drive 동영상 URL에서 파일 ID 추출
 */
export function extractDriveFileId(url: string): string | null {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Google Drive 파일 ID로 임베드 URL 생성
 */
export function getGoogleDriveEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Google Drive 파일 ID로 다운로드 URL 생성
 */
export function getGoogleDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Google Drive 파일 ID로 썸네일 URL 생성 (향상된 버전)
 */
export function getGoogleDriveThumbnailUrl(fileId: string, size: 'small' | 'medium' | 'large' = 'large'): string {
  const sizeMap = {
    small: 's220',
    medium: 's640', 
    large: 'w1920'
  };
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${sizeMap[size]}`;
}

/**
 * 디자이너별 동영상 정보 가져오기
 */
export function getDesignerVideo(designerSlug: string): DesignerVideo | null {
  return DESIGNER_VIDEOS[designerSlug] || null;
}

/**
 * 모든 디자이너 동영상 목록 가져오기
 */
export function getAllDesignerVideos(): DesignerVideo[] {
  return Object.values(DESIGNER_VIDEOS);
}

/**
 * Google Drive 동영상이 로드 가능한지 확인
 */
export async function checkDriveVideoAvailability(fileId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://drive.google.com/file/d/${fileId}/view`, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return true;
  } catch (error) {
    console.warn(`Drive video availability check failed for ${fileId}:`, error);
    return false;
  }
}

/**
 * 동영상 URL 유효성 검사
 */
export function validateVideoUrl(url: string): { isValid: boolean; type: 'drive' | 'youtube' | 'vimeo' | 'unknown' } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, type: 'unknown' };
  }

  if (url.includes('drive.google.com')) {
    const fileId = extractDriveFileId(url);
    return { isValid: !!fileId, type: 'drive' };
  }

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return { isValid: true, type: 'youtube' };
  }

  if (url.includes('vimeo.com')) {
    return { isValid: true, type: 'vimeo' };
  }

  return { isValid: false, type: 'unknown' };
}

/**
 * 동영상 임베드 컴포넌트용 props 생성
 */
export function generateVideoEmbedProps(url: string) {
  const validation = validateVideoUrl(url);
  
  if (!validation.isValid) {
    return null;
  }

  switch (validation.type) {
    case 'drive': {
      const fileId = extractDriveFileId(url);
      if (!fileId) return null;
      
      return {
        src: getGoogleDriveEmbedUrl(fileId),
        thumbnail: getGoogleDriveThumbnailUrl(fileId),
        type: 'drive' as const,
        allowFullscreen: true,
        frameBorder: 0,
        allow: 'autoplay; encrypted-media'
      };
    }
    
    default:
      return {
        src: url,
        type: validation.type,
        allowFullscreen: true,
        frameBorder: 0,
        allow: 'autoplay; encrypted-media'
      };
  }
}

/**
 * Fashion Film 페이지용 동영상 데이터 구조
 */
export interface FashionFilmVideo {
  id: string;
  title: string;
  designer: string;
  description?: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration?: string;
  createdAt: string;
}

/**
 * Fashion Film 동영상 목록 생성
 */
export function getFashionFilmVideos(): FashionFilmVideo[] {
  return Object.entries(DESIGNER_VIDEOS).map(([slug, video]) => ({
    id: video.driveId,
    title: `${video.name} Fashion Film`,
    designer: video.name,
    description: `${video.name}의 패션 필름 작품`,
    embedUrl: video.embedUrl,
    thumbnailUrl: getGoogleDriveThumbnailUrl(video.driveId, 'large'),
    createdAt: '2024-12-01'
  }));
}

/**
 * 동영상 로딩 에러 핸들링
 */
export function handleVideoLoadError(error: Error, fileId: string): void {
  console.error(`Failed to load video ${fileId}:`, error);
}

// Global gtag declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * 동영상 재생 시작 추적
 */
export function trackVideoPlay(designerName: string, videoId: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_play', {
      custom_parameter_1: designerName,
      custom_parameter_2: videoId
    });
  }
}