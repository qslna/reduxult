// ImageKit configuration
export const imageKitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  authenticationEndpoint: '/api/imagekit/auth',
};

// Generate ImageKit URL
export function getImageKitUrl(
  path: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }
): string {
  if (!imageKitConfig.urlEndpoint) {
    return path;
  }

  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Build transformation string
  const transforms = [];
  if (transformations?.width) transforms.push(`w-${transformations.width}`);
  if (transformations?.height) transforms.push(`h-${transformations.height}`);
  if (transformations?.quality) transforms.push(`q-${transformations.quality}`);
  if (transformations?.format) transforms.push(`f-${transformations.format}`);

  const transformString = transforms.length > 0 ? `tr:${transforms.join(',')}` : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash from urlEndpoint if present
  const baseUrl = imageKitConfig.urlEndpoint.endsWith('/') 
    ? imageKitConfig.urlEndpoint.slice(0, -1) 
    : imageKitConfig.urlEndpoint;

  return transformString ? `${baseUrl}/${transformString}${cleanPath}` : `${baseUrl}${cleanPath}`;
}

// Upload file to ImageKit
export interface UploadOptions {
  folder?: string;
  fileName?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
  customMetadata?: Record<string, string | number | boolean>;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  fileId?: string;
  width?: number;
  height?: number;
  error?: string;
}

export async function uploadToImageKit(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  try {
    // Get authentication parameters
    const authResponse = await fetch('/api/imagekit/auth');
    if (!authResponse.ok) {
      throw new Error('Failed to get authentication parameters');
    }
    
    const authData = await authResponse.json();
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', imageKitConfig.publicKey);
    formData.append('signature', authData.signature);
    formData.append('expire', authData.expire);
    formData.append('token', authData.token);
    
    if (options.fileName) {
      formData.append('fileName', options.fileName);
    }
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options.useUniqueFileName !== undefined) {
      formData.append('useUniqueFileName', options.useUniqueFileName.toString());
    }
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }
    
    if (options.customMetadata) {
      formData.append('customMetadata', JSON.stringify(options.customMetadata));
    }
    
    // Upload file
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              url: response.url,
              fileId: response.fileId,
              width: response.width,
              height: response.height,
            });
          } else {
            const errorResponse = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              error: errorResponse.message || 'Upload failed'
            });
          }
        } catch {
          resolve({
            success: false,
            error: 'Failed to parse response'
          });
        }
      });
      
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      });
      
      xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
      xhr.send(formData);
    });
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}