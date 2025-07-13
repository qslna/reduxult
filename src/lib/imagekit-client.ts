'use client';

// 클라이언트 사이드 이미지 업로드 (Vercel API 사용)
export const uploadImageClient = async (file: File, folder: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/imagekit/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    // 로컬 스토리지에도 저장
    if (typeof window !== 'undefined') {
      saveImageToStorage(data, folder);
    }
    
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    // 폴백: 로컬 저장만 수행
    const uploadData = {
      url: URL.createObjectURL(file),
      fileId: `uploaded-${Date.now()}-${Math.random()}`,
      name: file.name,
      filePath: `/${folder}/${file.name}`,
    };
    
    if (typeof window !== 'undefined') {
      saveImageToStorage(uploadData, folder);
    }
    
    return uploadData;
  }
};

// 이미지 목록 가져오기 (브라우저에서 직접)
export const listImagesClient = async (folder: string): Promise<any[]> => {
  try {
    // 먼저 API에서 가져오기 시도
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/imagekit/list?folder=${encodeURIComponent(folder)}`);
        if (response.ok) {
          const data = await response.json();
          return data.map((item: any) => ({
            url: item.url,
            fileId: item.fileId,
            name: item.name,
            path: item.filePath,
            type: item.fileType?.includes('video') ? 'video' : 'image',
          }));
        }
      } catch (apiError) {
        console.log('API fetch failed, falling back to local storage');
      }
    }
    
    // 로컬 스토리지 폴백
    if (typeof window === 'undefined') {
      return getDefaultImages(folder);
    }
    
    const storedImages = localStorage.getItem(`imagekit_${folder}`);
    const localImages = storedImages ? JSON.parse(storedImages) : [];
    const defaultImages = getDefaultImages(folder);
    
    // 중복 제거하며 병합
    const allImages = [...defaultImages];
    localImages.forEach((localImg: any) => {
      if (!allImages.find(img => img.fileId === localImg.fileId)) {
        allImages.push(localImg);
      }
    });
    
    return allImages;
  } catch (error) {
    console.error('List images error:', error);
    return getDefaultImages(folder);
  }
};

// 이미지 삭제 (클라이언트)
export const deleteImageClient = async (fileId: string, folder: string): Promise<boolean> => {
  try {
    // API로 삭제 시도
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/imagekit/upload', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileId }),
        });
        
        if (!response.ok) {
          throw new Error('Delete failed');
        }
      } catch (apiError) {
        console.log('API delete failed, removing from local storage only');
      }
    }
    
    // 브라우저에서만 localStorage 사용
    if (typeof window === 'undefined') {
      return true;
    }
    
    // 로컬 스토리지에서 제거
    const storedImages = localStorage.getItem(`imagekit_${folder}`);
    if (storedImages) {
      const images = JSON.parse(storedImages);
      const updatedImages = images.filter((img: any) => img.fileId !== fileId);
      localStorage.setItem(`imagekit_${folder}`, JSON.stringify(updatedImages));
    }
    
    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
};

// 업로드 후 로컬 스토리지에 저장
export const saveImageToStorage = (imageData: any, folder: string) => {
  try {
    // 브라우저에서만 localStorage 사용
    if (typeof window === 'undefined') {
      return;
    }
    
    const storedImages = localStorage.getItem(`imagekit_${folder}`);
    const images = storedImages ? JSON.parse(storedImages) : [];
    images.push({
      fileId: imageData.fileId,
      url: imageData.url,
      name: imageData.name,
      path: imageData.filePath,
      uploadedAt: new Date().toISOString()
    });
    localStorage.setItem(`imagekit_${folder}`, JSON.stringify(images));
  } catch (error) {
    console.error('Save to storage error:', error);
  }
};

// 기본 이미지 데이터 (서버 API 없이 작동하도록)
export const getDefaultImages = (folder: string) => {
  const defaultImageSets: { [key: string]: any[] } = {
    'visual-art': [
      {
        fileId: 'visual-art-1',
        url: '/images/visual-art/Analog Memories.png',
        name: 'Analog Memories.png',
        path: '/visual-art/Analog Memories.png'
      },
      {
        fileId: 'visual-art-2',
        url: '/images/visual-art/Digital Dreams.png',
        name: 'Digital Dreams.png',
        path: '/visual-art/Digital Dreams.png'
      },
      {
        fileId: 'visual-art-3',
        url: '/images/visual-art/Color Theory.png',
        name: 'Color Theory.png',
        path: '/visual-art/Color Theory.png'
      },
      {
        fileId: 'visual-art-4',
        url: '/images/visual-art/Form & Void.png',
        name: 'Form & Void.png',
        path: '/visual-art/Form & Void.png'
      },
      {
        fileId: 'visual-art-5',
        url: '/images/visual-art/Metamorphosis.png',
        name: 'Metamorphosis.png',
        path: '/visual-art/Metamorphosis.png'
      }
    ],
    'collective': [
      {
        fileId: 'collective-1',
        url: '/images/profile/Hwang Jinsu.jpg',
        name: 'Hwang Jinsu.jpg',
        path: '/collective/Hwang Jinsu.jpg'
      },
      {
        fileId: 'collective-2',
        url: '/images/profile/Choi Eunsol.jpeg',
        name: 'Choi Eunsol.jpeg',
        path: '/collective/Choi Eunsol.jpeg'
      },
      {
        fileId: 'collective-3',
        url: '/images/profile/Park Parang.jpg',
        name: 'Park Parang.jpg',
        path: '/collective/Park Parang.jpg'
      },
      {
        fileId: 'collective-4',
        url: '/images/profile/Lee Taehyeon.jpg',
        name: 'Lee Taehyeon.jpg',
        path: '/collective/Lee Taehyeon.jpg'
      },
      {
        fileId: 'collective-5',
        url: '/images/profile/Kim Bomin.webp',
        name: 'Kim Bomin.webp',
        path: '/collective/Kim Bomin.webp'
      },
      {
        fileId: 'collective-6',
        url: '/images/profile/Kim Gyeongsu.webp',
        name: 'Kim Gyeongsu.webp',
        path: '/collective/Kim Gyeongsu.webp'
      }
    ],
    'memory': [
      {
        fileId: 'memory-1',
        url: '/images/memory/IMG_1728.jpeg',
        name: 'IMG_1728.jpeg',
        path: '/memory/IMG_1728.jpeg'
      },
      {
        fileId: 'memory-2',
        url: '/images/memory/IMG_3452.JPG',
        name: 'IMG_3452.JPG',
        path: '/memory/IMG_3452.JPG'
      },
      {
        fileId: 'memory-3',
        url: '/images/memory/IMG_5380.JPG',
        name: 'IMG_5380.JPG',
        path: '/memory/IMG_5380.JPG'
      },
      {
        fileId: 'memory-4',
        url: '/images/memory/IMG_7103.jpeg',
        name: 'IMG_7103.jpeg',
        path: '/memory/IMG_7103.jpeg'
      },
      {
        fileId: 'memory-5',
        url: '/images/memory/IMG_7146.jpeg',
        name: 'IMG_7146.jpeg',
        path: '/memory/IMG_7146.jpeg'
      }
    ],
    'installation': [
      {
        fileId: 'installation-1',
        url: '/images/installation/공간  연출.png',
        name: '공간 연출.png',
        path: '/installation/공간 연출.png'
      },
      {
        fileId: 'installation-2',
        url: '/images/installation/디렉팅.png',
        name: '디렉팅.png',
        path: '/installation/디렉팅.png'
      },
      {
        fileId: 'installation-3',
        url: '/images/installation/아트 그래픽.png',
        name: '아트 그래픽.png',
        path: '/installation/아트 그래픽.png'
      },
      {
        fileId: 'installation-4',
        url: '/images/installation/영상 & 편집.png',
        name: '영상 & 편집.png',
        path: '/installation/영상 & 편집.png'
      },
      {
        fileId: 'installation-5',
        url: '/images/installation/홍보  브랜딩.png',
        name: '홍보 브랜딩.png',
        path: '/installation/홍보 브랜딩.png'
      }
    ],
    'fashion-film': [
      {
        fileId: 'fashion-film-1',
        url: '/video/Fashion Film/designer-hwangjinsu.mp4',
        name: 'designer-hwangjinsu.mp4',
        path: '/fashion-film/designer-hwangjinsu.mp4',
        type: 'video'
      },
      {
        fileId: 'fashion-film-2',
        url: '/video/Fashion Film/designer-choieunsol.mov',
        name: 'designer-choieunsol.mov',
        path: '/fashion-film/designer-choieunsol.mov',
        type: 'video'
      },
      {
        fileId: 'fashion-film-3',
        url: '/video/Fashion Film/designer-parkparang.mp4',
        name: 'designer-parkparang.mp4',
        path: '/fashion-film/designer-parkparang.mp4',
        type: 'video'
      },
      {
        fileId: 'fashion-film-4',
        url: '/video/Fashion Film/designer-leetaehyeon.mp4',
        name: 'designer-leetaehyeon.mp4',
        path: '/fashion-film/designer-leetaehyeon.mp4',
        type: 'video'
      },
      {
        fileId: 'fashion-film-5',
        url: '/video/Fashion Film/designer-kimbomin.MP4',
        name: 'designer-kimbomin.MP4',
        path: '/fashion-film/designer-kimbomin.MP4',
        type: 'video'
      },
      {
        fileId: 'fashion-film-6',
        url: '/video/Fashion Film/designer-kimgyeongsu.MP4',
        name: 'designer-kimgyeongsu.MP4',
        path: '/fashion-film/designer-kimgyeongsu.MP4',
        type: 'video'
      }
    ]
  };

  return defaultImageSets[folder] || [];
};

// React Hook for ImageKit operations
export const useImageKit = () => {
  const uploadFile = async (
    file: File, 
    folder: string, 
    options?: { tags?: string[]; customMetadata?: Record<string, any> }
  ) => {
    try {
      const result = await uploadImageClient(file, folder);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
  };

  const listFiles = async (folder: string) => {
    try {
      return await listImagesClient(folder);
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  };

  const deleteFile = async (fileIdOrUrl: string, folder?: string) => {
    try {
      const fileId = fileIdOrUrl.includes('http') ? extractFileIdFromUrl(fileIdOrUrl) : fileIdOrUrl;
      const success = await deleteImageClient(fileId, folder || '');
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Delete failed' };
    }
  };

  return {
    uploadFile,
    listFiles,
    deleteFile
  };
};

// Extract file ID from ImageKit URL
const extractFileIdFromUrl = (url: string): string => {
  const matches = url.match(/\/([^\/]+)$/);
  return matches ? matches[1] : url;
};

// Static site export - no default export needed