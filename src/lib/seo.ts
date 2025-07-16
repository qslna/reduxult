import type { Metadata } from 'next';

// Base SEO configuration
export const baseMetadata: Metadata = {
  title: {
    template: '%s | REDUX',
    default: 'REDUX - Fashion & Art Collective'
  },
  description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다. 패션과 예술의 경계를 넘나드는 창의적인 작품을 선보입니다.',
  keywords: [
    'REDUX',
    'fashion design',
    'art collective',
    'fashion collective',
    'korean designers',
    'seoul fashion',
    'creative collective',
    'fashion art',
    'contemporary fashion',
    'avant-garde fashion'
  ],
  authors: [{ name: 'REDUX Creative Collective' }],
  creator: 'REDUX',
  publisher: 'REDUX',
  category: 'Fashion & Art',
  metadataBase: new URL('https://reduxult.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'REDUX',
    title: 'REDUX - Fashion & Art Collective',
    description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
    url: 'https://reduxult.vercel.app',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'REDUX Fashion & Art Collective',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REDUX - Fashion & Art Collective',
    description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

// Page-specific metadata generators
export const generatePageMetadata = (
  title: string,
  description: string,
  path: string,
  image?: string
): Metadata => ({
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: `https://reduxult.vercel.app${path}`,
    images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
  },
  twitter: {
    title,
    description,
    images: image ? [image] : undefined,
  },
});

// Designer metadata generator
export const generateDesignerMetadata = (
  name: string,
  nameKo: string,
  bio: string,
  id: string,
  profileImage?: string
): Metadata => ({
  title: `${name} (${nameKo})`,
  description: `${name} (${nameKo}) - REDUX 디자이너. ${bio.slice(0, 160)}...`,
  alternates: {
    canonical: `/designers/${id}`,
  },
  openGraph: {
    title: `${name} - REDUX Designer`,
    description: `${name} (${nameKo}) - REDUX 디자이너. ${bio.slice(0, 160)}...`,
    url: `https://reduxult.vercel.app/designers/${id}`,
    type: 'profile',
    images: profileImage ? [{ url: profileImage, width: 1200, height: 630, alt: name }] : undefined,
  },
  twitter: {
    title: `${name} - REDUX Designer`,
    description: `${name} (${nameKo}) - REDUX 디자이너. ${bio.slice(0, 160)}...`,
    images: profileImage ? [profileImage] : undefined,
  },
});

// Project metadata generator
export const generateProjectMetadata = (
  title: string,
  titleKo: string,
  description: string,
  id: string,
  image?: string
): Metadata => ({
  title: `${title} (${titleKo})`,
  description: `${title} (${titleKo}) - ${description.slice(0, 160)}...`,
  alternates: {
    canonical: `/projects/${id}`,
  },
  openGraph: {
    title: `${title} - REDUX Project`,
    description: `${title} (${titleKo}) - ${description.slice(0, 160)}...`,
    url: `https://reduxult.vercel.app/projects/${id}`,
    type: 'article',
    images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
  },
  twitter: {
    title: `${title} - REDUX Project`,
    description: `${title} (${titleKo}) - ${description.slice(0, 160)}...`,
    images: image ? [image] : undefined,
  },
});

// Structured data generators
export const generateOrganizationStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'REDUX',
  alternateName: 'REDUX Creative Collective',
  url: 'https://reduxult.vercel.app',
  logo: 'https://reduxult.vercel.app/logo.png',
  description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
  foundingDate: '2020',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Seoul',
      addressCountry: 'KR'
    }
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+82-10-0000-0000',
    contactType: 'customer service',
    email: 'contact@redux.kr'
  },
  sameAs: [
    'https://instagram.com/redux_official'
  ]
});

export const generatePersonStructuredData = (
  name: string,
  nameKo: string,
  bio: string,
  instagramHandle?: string,
  profileImage?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: name,
  alternateName: nameKo,
  description: bio,
  image: profileImage,
  jobTitle: 'Fashion Designer',
  worksFor: {
    '@type': 'Organization',
    name: 'REDUX'
  },
  sameAs: instagramHandle ? [`https://instagram.com/${instagramHandle.replace('@', '')}`] : undefined
});

export const generateCreativeWorkStructuredData = (
  title: string,
  titleKo: string,
  description: string,
  images: string[],
  designers: string[],
  date?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: title,
  alternateName: titleKo,
  description: description,
  image: images,
  creator: designers.map(designer => ({
    '@type': 'Person',
    name: designer
  })),
  dateCreated: date,
  publisher: {
    '@type': 'Organization',
    name: 'REDUX'
  }
});

// Breadcrumb structured data
export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `https://reduxult.vercel.app${item.url}`
  }))
});

// Website structured data
export const generateWebsiteStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'REDUX',
  url: 'https://reduxult.vercel.app',
  description: 'REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다.',
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://reduxult.vercel.app/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
});