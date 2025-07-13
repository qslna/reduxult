/**
 * Google Drive 비디오 관련 유틸리티 함수들
 */

/**
 * Google Drive 파일 ID로부터 썸네일 URL을 생성
 * @param fileId - Google Drive 파일 ID
 * @param size - 썸네일 크기 (기본값: 1200)
 * @returns 썸네일 URL
 */
export function getDriveThumbnail(fileId: string, size: number = 1200): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Google Drive 파일 ID로부터 미리보기 URL을 생성
 * @param fileId - Google Drive 파일 ID
 * @returns 미리보기 URL
 */
export function getDrivePreview(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Google Drive 파일 ID로부터 직접 다운로드 URL을 생성
 * @param fileId - Google Drive 파일 ID
 * @returns 다운로드 URL
 */
export function getDriveDownload(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Google Drive 파일 ID로부터 공유 URL을 생성
 * @param fileId - Google Drive 파일 ID
 * @returns 공유 URL
 */
export function getDriveShare(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Google Drive URL에서 파일 ID를 추출
 * @param url - Google Drive URL
 * @returns 파일 ID 또는 null
 */
export function extractFileIdFromUrl(url: string): string | null {
  const regex = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 패션 필름별 Google Drive 파일 ID 매핑
export const FASHION_FILM_IDS = {
  'designer-parkparang': '15d901XRElkF5p7xiJYelIyblYFb-PtsD',
  'designer-leetaehyeon': '1fG2fchKvEG7i7Lo79K7250mgiVTse6ks', 
  'designer-kimgyeongsu': '1Hl594dd_MY714hZwmklTAPTc-pofe9bY',
  'designer-kimbomin': '1dU4ypIXASSlVMGzyPvPtlP7v-rZuAg0X',
  'designer-hwangjinsu': '1n2COeZYlxSB6C5HZPdd8DTGxnuXCAA_d',
  'designer-choieunsol': '1uFdMyzPQgpfCYYOLRtH8ixX5917fzxh3'
} as const;

/**
 * 비디오 파일의 메타데이터를 추출하기 위한 타입
 */
export interface VideoMetadata {
  fileId: string;
  title: string;
  duration: string;
  thumbnail: string;
  preview: string;
  download: string;
  share: string;
}

/**
 * Google Drive 파일 ID로부터 비디오 메타데이터 객체를 생성
 * @param fileId - Google Drive 파일 ID
 * @param title - 비디오 제목
 * @param duration - 비디오 길이
 * @returns VideoMetadata 객체
 */
export function createVideoMetadata(
  fileId: string,
  title: string,
  duration: string
): VideoMetadata {
  return {
    fileId,
    title,
    duration,
    thumbnail: getDriveThumbnail(fileId),
    preview: getDrivePreview(fileId),
    download: getDriveDownload(fileId),
    share: getDriveShare(fileId),
  };
}

/**
 * 비디오 embed를 위한 iframe 설정
 */
export const VIDEO_IFRAME_CONFIG = {
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  allowFullScreen: true,
  frameBorder: 0,
  style: { border: 'none' },
} as const;