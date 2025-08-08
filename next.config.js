/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 활성화하여 개발 중 문제 조기 발견
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
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
      'framer-motion', 
      'lucide-react', 
      'gsap', 
      '@radix-ui/react-dialog', 
      '@radix-ui/react-toast'
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'INP', 'TTFB'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // 추가 성능 최적화
    optimizeCss: true,
    // 더 세밀한 청크 분할
    modularizeImports: {
      'framer-motion': {
        transform: 'framer-motion/dist/es/{{member}}',
      },
      'lucide-react': {
        transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      },
    },
  },
  serverExternalPackages: ['sharp'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 웹팩 최적화 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 프로덕션 환경에서만 청크 최적화 적용
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // 프레이머 모션 별도 청크
          framerMotion: {
            name: 'framer-motion',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Lucide 아이콘 별도 청크
          lucideIcons: {
            name: 'lucide-react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            priority: 20,
            enforce: true,
          },
          // CMS 관련 컴포넌트들
          cmsComponents: {
            name: 'cms-components',
            chunks: 'async',
            test: /[\\/]src[\\/]components[\\/](cms|admin)[\\/]/,
            priority: 15,
            minChunks: 1,
          },
          // UI 컴포넌트들
          uiComponents: {
            name: 'ui-components',
            chunks: 'all',
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            priority: 10,
            minSize: 10000,
          },
        },
      };
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