import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://reduxult.vercel.app';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/about/collective',
    '/about/visual-art', 
    '/about/fashion-film',
    '/about/installation',
    '/about/memory',
    '/designers',
    '/projects',
    '/exhibitions',
    '/contact',
  ];

  // Designer pages
  const designers = [
    'choi-eunsol',
    'hwang-jinsu',
    'kim-bomin',
    'kim-gyeongsu',
    'lee-taehyeon',
    'park-parang'
  ];

  // Project pages
  const projects = [
    'redux-2024-collection',
    'visual-art-exhibition',
    'memory-installation'
  ];

  const staticRoutes = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  const designerRoutes = designers.map((id) => ({
    url: `${baseUrl}/designers/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((id) => ({
    url: `${baseUrl}/projects/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...designerRoutes,
    ...projectRoutes,
  ];
}