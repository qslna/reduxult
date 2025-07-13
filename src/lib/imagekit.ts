import ImageKit from 'imagekit';

// ImageKit configuration
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  authenticationEndpoint: '/api/imagekit/auth',
};

// Server-side ImageKit instance (for admin operations)
export const imagekit = new ImageKit({
  publicKey: imagekitConfig.publicKey,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: imagekitConfig.urlEndpoint,
});

// Folder mappings for organized storage
export const folderMappings = {
  'main': 'redux/main',
  'about': 'redux/about',
  'visual-art': 'redux/about/visual-art',
  'collective': 'redux/about/collective',
  'fashion-film': 'redux/about/fashion-film',
  'installation': 'redux/about/installation',
  'memory': 'redux/about/memory',
  'designers': 'redux/designers',
  // Hwang Jinsu
  'hwangjinsu': 'redux/designers/hwangjinsu',
  'hwangjinsu-profile': 'redux/designers/hwangjinsu/profile',
  'hwangjinsu-portfolio': 'redux/designers/hwangjinsu/portfolio',
  'hwangjinsu-cinemode': 'redux/designers/hwangjinsu/cinemode',
  'hwangjinsu-experimental': 'redux/designers/hwangjinsu/experimental',
  // Choi Eunsol
  'choieunsol': 'redux/designers/choieunsol',
  'choieunsol-profile': 'redux/designers/choieunsol/profile',
  'choieunsol-portfolio': 'redux/designers/choieunsol/portfolio',
  'choieunsol-cinemode': 'redux/designers/choieunsol/cinemode',
  'choieunsol-experimental': 'redux/designers/choieunsol/experimental',
  // Park Parang
  'parkparang': 'redux/designers/parkparang',
  'parkparang-profile': 'redux/designers/parkparang/profile',
  'parkparang-portfolio': 'redux/designers/parkparang/portfolio',
  'parkparang-cinemode': 'redux/designers/parkparang/cinemode',
  'parkparang-experimental': 'redux/designers/parkparang/experimental',
  // Lee Taehyeon
  'leetaehyeon': 'redux/designers/leetaehyeon',
  'leetaehyeon-profile': 'redux/designers/leetaehyeon/profile',
  'leetaehyeon-portfolio': 'redux/designers/leetaehyeon/portfolio',
  'leetaehyeon-cinemode': 'redux/designers/leetaehyeon/cinemode',
  'leetaehyeon-experimental': 'redux/designers/leetaehyeon/experimental',
  // Kim Bomin
  'kimbomin': 'redux/designers/kimbomin',
  'kimbomin-profile': 'redux/designers/kimbomin/profile',
  'kimbomin-portfolio': 'redux/designers/kimbomin/portfolio',
  'kimbomin-cinemode': 'redux/designers/kimbomin/cinemode',
  'kimbomin-experimental': 'redux/designers/kimbomin/experimental',
  // Kim Gyeongsu
  'kimgyeongsu': 'redux/designers/kimgyeongsu',
  'kimgyeongsu-profile': 'redux/designers/kimgyeongsu/profile',
  'kimgyeongsu-portfolio': 'redux/designers/kimgyeongsu/portfolio',
  'kimgyeongsu-cinemode': 'redux/designers/kimgyeongsu/cinemode',
  'kimgyeongsu-experimental': 'redux/designers/kimgyeongsu/experimental',
  // Others
  'exhibitions': 'redux/exhibitions',
  'hero': 'redux/hero',
  'videos': 'redux/videos',
} as const;

export type FolderType = keyof typeof folderMappings;

// ImageKit URL builder helper
export function buildImageKitUrl(
  src: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
    focus?: 'auto' | 'face' | 'center';
  }
): string {
  // If it's already a full URL, return as is
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src;
  }

  // Build ImageKit URL with transformations
  let url = `${imagekitConfig.urlEndpoint}${src.startsWith('/') ? src : `/${src}`}`;
  
  if (transformations) {
    const params = new URLSearchParams();
    
    if (transformations.width) params.append('tr', `w-${transformations.width}`);
    if (transformations.height) params.append('tr', `h-${transformations.height}`);
    if (transformations.quality) params.append('tr', `q-${transformations.quality}`);
    if (transformations.format) params.append('tr', `f-${transformations.format}`);
    if (transformations.crop) params.append('tr', `c-${transformations.crop}`);
    if (transformations.focus) params.append('tr', `fo-${transformations.focus}`);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  return url;
}

// Upload image to ImageKit
export async function uploadImage(
  file: File,
  folder: FolderType,
  fileName?: string
): Promise<{ url: string; fileId: string }> {
  try {
    const sanitizedFileName = fileName || file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folderPath = folderMappings[folder];
    
    // Convert File to Buffer for ImageKit
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `${sanitizedFileName}_${Date.now()}`,
      folder: folderPath,
      useUniqueFileName: true,
      checks: '"request.folder" : "/redux"', // Security check
    });

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete image from ImageKit
export async function deleteImage(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get authentication parameters for client-side uploads
export function getAuthenticationParameters() {
  return imagekit.getAuthenticationParameters();
}

// List files in a folder
export async function listFiles(folder: FolderType, limit: number = 50) {
  try {
    const folderPath = folderMappings[folder];
    const response = await imagekit.listFiles({
      path: folderPath,
      limit,
      sort: 'DESC_CREATED',
    });
    return response;
  } catch (error) {
    console.error('ImageKit list files error:', error);
    throw new Error(`List files failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate optimized image URL with responsive breakpoints
export function generateResponsiveUrls(src: string) {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536];
  return breakpoints.map(width => ({
    width,
    url: buildImageKitUrl(src, { 
      width, 
      quality: 85, 
      format: 'webp',
      crop: 'maintain_ratio'
    })
  }));
}

// Create blur placeholder
export function createBlurPlaceholder(src: string): string {
  return buildImageKitUrl(src, {
    width: 10,
    quality: 20,
    format: 'webp'
  });
}

// Progressive image loading URLs
export function getProgressiveUrls(src: string) {
  return {
    placeholder: createBlurPlaceholder(src),
    lowQuality: buildImageKitUrl(src, { width: 50, quality: 30, format: 'webp' }),
    mediumQuality: buildImageKitUrl(src, { width: 400, quality: 60, format: 'webp' }),
    highQuality: buildImageKitUrl(src, { quality: 85, format: 'webp' }),
    original: buildImageKitUrl(src, { quality: 95 })
  };
}

// Batch delete multiple images
export async function batchDeleteImages(fileIds: string[]): Promise<void> {
  try {
    await Promise.all(fileIds.map(fileId => deleteImage(fileId)));
  } catch (error) {
    console.error('Batch delete error:', error);
    throw new Error(`Batch delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get file details
export async function getFileDetails(fileId: string) {
  try {
    return await imagekit.getFileDetails(fileId);
  } catch (error) {
    console.error('Get file details error:', error);
    throw new Error(`Get file details failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// File validation
const FILE_VALIDATION = {
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  maxImageSize: 50 * 1024 * 1024, // 50MB
  maxVideoSize: 200 * 1024 * 1024, // 200MB
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov']
};

export function validateFile(file: File): { valid: boolean; error?: string } {
  const fileType = file.type;
  const fileSize = file.size;
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (!extension || !FILE_VALIDATION.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File type .${extension} is not allowed.`
    };
  }
  
  if (FILE_VALIDATION.allowedImageTypes.includes(fileType)) {
    if (fileSize > FILE_VALIDATION.maxImageSize) {
      return {
        valid: false,
        error: `Image size exceeds 50MB limit.`
      };
    }
  } else if (FILE_VALIDATION.allowedVideoTypes.includes(fileType)) {
    if (fileSize > FILE_VALIDATION.maxVideoSize) {
      return {
        valid: false,
        error: `Video size exceeds 200MB limit.`
      };
    }
  } else {
    return {
      valid: false,
      error: `File type ${fileType} is not supported.`
    };
  }
  
  return { valid: true };
}