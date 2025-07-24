// ImageKit Client - Frontend에서 ImageKit API와 통신하는 클라이언트
import ImageKit from 'imagekit-javascript';

export interface ImageKitUploadOptions {
  file: File;
  fileName: string;
  folder?: string;
  tags?: string[];
  customMetadata?: Record<string, any>;
  transformation?: {
    pre?: string;
    post?: {
      type: 'transformation';
      value: string;
    }[];
  };
}

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  AITags?: Array<{
    name: string;
    confidence: number;
    source: string;
  }>;
}

class ImageKitClient {
  private imagekit!: ImageKit;
  private isInitialized = false;

  constructor() {
    // Initialize only on client side
    if (typeof window !== 'undefined') {
      this.initializeImageKit();
    }
  }

  private initializeImageKit() {
    try {
      this.imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
      });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize ImageKit:', error);
    }
  }

  // Get authentication parameters for upload
  private async getAuthParams() {
    try {
      const response = await fetch('/api/imagekit/auth');
      if (!response.ok) {
        throw new Error('Failed to get authentication parameters');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get auth params:', error);
      throw error;
    }
  }

  // Upload file to ImageKit
  async uploadFile(options: ImageKitUploadOptions): Promise<ImageKitUploadResponse> {
    if (!this.isInitialized) {
      throw new Error('ImageKit client not initialized');
    }

    try {
      const authParams = await this.getAuthParams();
      
      const uploadResponse = await this.imagekit.upload({
        file: options.file,
        fileName: options.fileName,
        folder: options.folder || '/redux-cms',
        tags: options.tags?.join(','),
        customMetadata: options.customMetadata,
        transformation: options.transformation,
        ...authParams
      });

      return uploadResponse as unknown as ImageKitUploadResponse;
    } catch (error) {
      console.error('ImageKit upload failed:', error);
      throw new Error('Failed to upload file to ImageKit');
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files: ImageKitUploadOptions[]): Promise<ImageKitUploadResponse[]> {
    const results = await Promise.allSettled(
      files.map(fileOptions => this.uploadFile(fileOptions))
    );

    const successful: ImageKitUploadResponse[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push(`File ${index + 1}: ${result.reason.message}`);
      }
    });

    if (failed.length > 0) {
      console.warn('Some uploads failed:', failed);
    }

    return successful;
  }

  // Generate URL with transformations
  generateUrl(
    path: string,
    transformations?: {
      height?: number;
      width?: number;
      aspectRatio?: string;
      quality?: number;
      format?: 'jpg' | 'png' | 'webp' | 'avif';
      crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
      background?: string;
      blur?: number;
      grayscale?: boolean;
      progressive?: boolean;
      lossless?: boolean;
      trim?: boolean;
      rotate?: number;
      radius?: number | string;
      border?: string;
    }
  ): string {
    if (!this.isInitialized) {
      return path; // Return original path if ImageKit not available
    }

    try {
      return this.imagekit.url({
        path,
        transformation: transformations ? [transformations as any] : undefined
      });
    } catch (error) {
      console.error('Failed to generate ImageKit URL:', error);
      return path;
    }
  }

  // Get optimized image URL for different use cases
  getOptimizedUrl(
    path: string,
    preset: 'thumbnail' | 'medium' | 'large' | 'hero' | 'gallery' = 'medium'
  ): string {
    const presets = {
      thumbnail: {
        width: 150,
        height: 150,
        crop: 'maintain_ratio' as const,
        quality: 80,
        format: 'webp' as const
      },
      medium: {
        width: 800,
        height: 600,
        crop: 'maintain_ratio' as const,
        quality: 85,
        format: 'webp' as const
      },
      large: {
        width: 1200,
        height: 900,
        crop: 'maintain_ratio' as const,
        quality: 90,
        format: 'webp' as const
      },
      hero: {
        width: 1920,
        height: 1080,
        crop: 'maintain_ratio' as const,
        quality: 90,
        format: 'webp' as const
      },
      gallery: {
        width: 600,
        height: 400,
        crop: 'maintain_ratio' as const,
        quality: 85,
        format: 'webp' as const
      }
    };

    return this.generateUrl(path, presets[preset]);
  }

  // Get responsive image URLs
  getResponsiveUrls(path: string): {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  } {
    return {
      small: this.generateUrl(path, { width: 480, quality: 75, format: 'webp' }),
      medium: this.generateUrl(path, { width: 768, quality: 80, format: 'webp' }),
      large: this.generateUrl(path, { width: 1024, quality: 85, format: 'webp' }),
      xlarge: this.generateUrl(path, { width: 1200, quality: 90, format: 'webp' })
    };
  }

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only images and videos are allowed.' };
    }

    return { valid: true };
  }

  // Get file info from ImageKit
  async getFileDetails(fileId: string) {
    try {
      // This would require a backend API call since file details API needs private key
      const response = await fetch(`/api/imagekit/files/${fileId}`);
      if (!response.ok) {
        throw new Error('Failed to get file details');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get file details:', error);
      throw error;
    }
  }

  // Delete file from ImageKit
  async deleteFile(fileId: string) {
    try {
      const response = await fetch(`/api/imagekit/files/${fileId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  // Bulk delete files
  async deleteMultipleFiles(fileIds: string[]) {
    const results = await Promise.allSettled(
      fileIds.map(fileId => this.deleteFile(fileId))
    );

    const successful: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(fileIds[index]);
      } else {
        failed.push(fileIds[index]);
      }
    });

    return { successful, failed };
  }
}

// Create singleton instance
export const imagekitClient = new ImageKitClient();

// React hook for using ImageKit client
export function useImageKit() {
  return imagekitClient;
}

// Utility functions for common transformations
export const imageTransforms = {
  // Profile picture optimization
  avatar: (size: number = 150) => ({
    width: size,
    height: size,
    crop: 'force' as const,
    radius: 'max',
    quality: 90,
    format: 'webp' as const
  }),

  // Gallery thumbnail
  galleryThumb: (width: number = 300, height: number = 200) => ({
    width,
    height,
    crop: 'maintain_ratio' as const,
    quality: 80,
    format: 'webp' as const
  }),

  // Hero image optimization
  hero: (width: number = 1920, height: number = 1080) => ({
    width,
    height,
    crop: 'maintain_ratio' as const,
    quality: 90,
    format: 'webp' as const,
    progressive: true
  }),

  // Portfolio image optimization
  portfolio: (maxWidth: number = 1200) => ({
    width: maxWidth,
    crop: 'maintain_ratio' as const,
    quality: 90,
    format: 'webp' as const,
    progressive: true
  })
};