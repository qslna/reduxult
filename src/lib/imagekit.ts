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

  return `${imageKitConfig.urlEndpoint}/${transformString}${cleanPath}`;
}