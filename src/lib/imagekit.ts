// ImageKit 기능을 일시적으로 비활성화
// 모든 이미지는 public 폴더에서 직접 제공됩니다

export function buildImageKitUrl(src: string): string {
  // 직접 원본 경로 반환
  return src;
}

// 나머지 ImageKit 관련 함수들은 사용하지 않음
export const imagekitConfig = {
  publicKey: '',
  urlEndpoint: '',
  authenticationEndpoint: '/api/imagekit/auth',
};