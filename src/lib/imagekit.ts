// ImageKit 설정
export const imageKitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  authenticationEndpoint: '/api/imagekit/auth',
};

// 이미지 URL 생성 헬퍼
interface ImageTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
}

export function getImageUrl(path: string, transformations?: ImageTransformations): string {
  // ImageKit이 설정되지 않은 경우 원본 경로 반환
  if (!imageKitConfig.urlEndpoint) {
    return path;
  }

  // 이미 전체 URL인 경우 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // ImageKit URL 생성
  const baseUrl = imageKitConfig.urlEndpoint;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (transformations) {
    // 변환 파라미터 처리
    const transforms = [];
    if (transformations.width) transforms.push(`w-${transformations.width}`);
    if (transformations.height) transforms.push(`h-${transformations.height}`);
    if (transformations.quality) transforms.push(`q-${transformations.quality}`);
    if (transformations.format) transforms.push(`f-${transformations.format}`);
    
    if (transforms.length > 0) {
      return `${baseUrl}/tr:${transforms.join(',')}${cleanPath}`;
    }
  }

  return `${baseUrl}${cleanPath}`;
}

// 파일 업로드 함수
export async function uploadImage(file: File, folder: string = '/'): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const response = await fetch(imageKitConfig.authenticationEndpoint);
    const authParams = await response.json();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('folder', folder);
    formData.append('publicKey', imageKitConfig.publicKey);
    formData.append('signature', authParams.signature);
    formData.append('expire', authParams.expire);
    formData.append('token', authParams.token);

    const uploadResponse = await fetch(`${imageKitConfig.urlEndpoint}/api/v1/files/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await uploadResponse.json();

    if (uploadResponse.ok) {
      return { success: true, url: result.url };
    } else {
      return { success: false, error: result.message || 'Upload failed' };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Upload failed' };
  }
}

// 파일 삭제 함수
export async function deleteImage(fileId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/imagekit/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Delete failed' };
    }
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Delete failed' };
  }
}