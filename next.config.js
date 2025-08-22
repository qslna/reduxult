/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 활성화하여 개발 중 문제 조기 발견
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-dialog', 
      '@radix-ui/react-toast'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'INP', 'TTFB'],
  },
  // Turbopack 설정 (turbo가 이제 안정화되어 experimental 밖으로 이동)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // 빌드 안정성을 위한 설정
  compress: true,
  // modularizeImports를 experimental 밖으로 이동
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  serverExternalPackages: ['sharp'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 단순화된 웹팩 설정 (빌드 안정성 우선)
  webpack: (config, { dev, isServer }) => {
    // SVG 지원
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 개발 환경에서만 최적화 적용
    if (!dev && !isServer) {
      // 기본 최적화만 유지
      config.optimization.minimize = true;
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/:path*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/imagekit/:path*',
        destination: '/api/imagekit/:path*',
      },
    ];
  },
};

export default nextConfig;