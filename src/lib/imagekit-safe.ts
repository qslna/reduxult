// Safe ImageKit configuration with fallbacks
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  authenticationEndpoint: '/api/imagekit/auth',
};

// Check if ImageKit is properly configured
export function isImageKitConfigured(): boolean {
  return !!(imagekitConfig.publicKey && imagekitConfig.urlEndpoint);
}

// Safe image URL builder with fallback
export function getSafeImageUrl(src: string | undefined | null): string {
  if (!src) return '/images/designer-placeholder.jpg';
  
  // If it's already a full URL or data URL, return as is
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) {
    return src;
  }
  
  // If ImageKit is configured, use it
  if (isImageKitConfigured() && imagekitConfig.urlEndpoint) {
    return `${imagekitConfig.urlEndpoint}${src.startsWith('/') ? src : `/${src}`}`;
  }
  
  // Fallback to local image
  return `/images/${src}`;
}

// Get placeholder image
export function getPlaceholderImage(): string {
  return '/images/designer-placeholder.jpg';
}