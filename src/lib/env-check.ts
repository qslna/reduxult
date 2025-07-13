// Environment variable validation
export function checkRequiredEnvVars() {
  const requiredVars = {
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    
    // In production, show a more user-friendly message
    if (process.env.NODE_ENV === 'production') {
      console.error('Application configuration error. Please check environment variables.');
    }
    
    return {
      isValid: false,
      missingVars,
      message: `Missing required environment variables: ${missingVars.join(', ')}`
    };
  }

  return { isValid: true, missingVars: [] };
}

// Check if ImageKit is properly configured
export function isImageKitConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT &&
    process.env.IMAGEKIT_PRIVATE_KEY
  );
}