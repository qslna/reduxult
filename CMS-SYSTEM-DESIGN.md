# REDUX Modern CMS System Design Document

## 1. Overview

### 1.1 Current State Analysis
- **Static Data Management**: Currently using static files in `/src/data/` for content
- **Image Management**: Manual file uploads and hardcoded paths  
- **Admin Interface**: Basic admin button with placeholder functionality
- **Content Updates**: Requires code changes and redeployment

### 1.2 CMS System Goals
- **Real-time Content Management**: Edit content without code changes
- **Media Management**: Upload, organize, and optimize images/videos
- **User Authentication**: Secure admin access with role-based permissions
- **Performance**: Maintain fast loading times with optimized content delivery
- **SEO Control**: Dynamic meta tags and structured data management

## 2. System Architecture

### 2.1 Technology Stack

#### Frontend (Client-Side)
- **Framework**: Next.js 15.1.0 (App Router)
- **State Management**: Zustand (already integrated)
- **UI Components**: Custom design system + existing components
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: React DnD for content ordering

#### Backend (API Layer)
- **API Routes**: Next.js API routes (`/api/*`)
- **Database**: Prisma ORM + PostgreSQL (or SQLite for development)
- **Authentication**: NextAuth.js with JWT tokens
- **File Storage**: ImageKit CDN (already configured)
- **Caching**: Redis for session and content cache

#### Infrastructure
- **Deployment**: Vercel (current platform)
- **CDN**: ImageKit for media assets
- **Database**: Vercel Postgres or PlanetScale
- **Cache**: Vercel KV (Redis-compatible)

### 2.2 Data Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   API Routes    │    │   Database      │
│                 │◄──►│                 │◄──►│                 │
│ • Admin Panel   │    │ • /api/content  │    │ • Content       │
│ • Public Pages  │    │ • /api/media    │    │ • Media         │
│ • Auth Forms    │    │ • /api/auth     │    │ • Users         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   External      │
                    │                 │
                    │ • ImageKit CDN  │
                    │ • Email Service │
                    │ • Analytics     │
                    └─────────────────┘
```

## 3. Database Schema

### 3.1 Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor', 'viewer');

-- Content Management
CREATE TABLE content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- 'designer', 'exhibition', 'about_section'
  display_name VARCHAR(255) NOT NULL,
  schema JSONB NOT NULL, -- Field definitions
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type_id UUID REFERENCES content_types(id) ON DELETE CASCADE,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  data JSONB NOT NULL, -- Flexible content data
  meta JSONB, -- SEO meta tags, description, etc.
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(content_type_id, slug)
);

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Media Management
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(500) NOT NULL,
  original_filename VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  imagekit_file_id VARCHAR(255),
  imagekit_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[],
  metadata JSONB, -- EXIF data, dimensions, etc.
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content-Media Relations
CREATE TABLE content_media (
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  media_item_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL, -- 'hero_image', 'gallery', etc.
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (content_item_id, media_item_id, field_name)
);

-- Navigation and Menus
CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  href VARCHAR(500),
  content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Content Type Examples

```json
// Designer Content Type Schema
{
  "name": "designer",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "required": true,
      "label": "Designer Name"
    },
    {
      "name": "bio",
      "type": "textarea",
      "required": true,
      "label": "Biography"
    },
    {
      "name": "instagram_handle",
      "type": "text",
      "label": "Instagram Handle"
    },
    {
      "name": "profile_image",
      "type": "image",
      "required": true,
      "label": "Profile Image"
    },
    {
      "name": "portfolio_images",
      "type": "gallery",
      "label": "Portfolio Gallery"
    },
    {
      "name": "featured_projects",
      "type": "repeater",
      "label": "Featured Projects",
      "fields": [
        {
          "name": "title",
          "type": "text",
          "required": true
        },
        {
          "name": "description",
          "type": "textarea"
        },
        {
          "name": "image",
          "type": "image",
          "required": true
        }
      ]
    }
  ]
}
```

## 4. API Design

### 4.1 API Endpoints

#### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register (admin only)
GET    /api/auth/me
POST   /api/auth/refresh
```

#### Content Management
```
GET    /api/content/types
GET    /api/content/types/:type
POST   /api/content/types (admin only)
PUT    /api/content/types/:id (admin only)

GET    /api/content/:type
GET    /api/content/:type/:slug
POST   /api/content/:type
PUT    /api/content/:type/:id
DELETE /api/content/:type/:id
POST   /api/content/:type/:id/publish
POST   /api/content/:type/:id/unpublish
```

#### Media Management
```
GET    /api/media
POST   /api/media/upload
GET    /api/media/:id
PUT    /api/media/:id
DELETE /api/media/:id
POST   /api/media/bulk-upload
GET    /api/media/search
```

#### Navigation
```
GET    /api/navigation
PUT    /api/navigation
POST   /api/navigation/items
PUT    /api/navigation/items/:id
DELETE /api/navigation/items/:id
```

### 4.2 Response Formats

```typescript
// Standard API Response
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Content Item Response
interface ContentItemResponse {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  data: Record<string, any>;
  meta: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  media: MediaItem[];
}
```

## 5. Frontend Components

### 5.1 Admin Interface Structure

```
src/app/admin/
├── layout.tsx              # Admin layout with auth guard
├── page.tsx                # Dashboard overview
├── content/
│   ├── page.tsx           # Content types listing
│   ├── [type]/
│   │   ├── page.tsx       # Content items listing
│   │   ├── new/
│   │   │   └── page.tsx   # Create new content
│   │   └── [id]/
│   │       ├── page.tsx   # Edit content
│   │       └── preview/
│   │           └── page.tsx # Preview content
├── media/
│   ├── page.tsx           # Media library
│   └── upload/
│       └── page.tsx       # Bulk upload interface
├── navigation/
│   └── page.tsx           # Navigation management
├── users/
│   ├── page.tsx           # User management
│   └── [id]/
│       └── page.tsx       # Edit user
└── settings/
    └── page.tsx           # System settings
```

### 5.2 Key React Components

```typescript
// Content Editor Components
- ContentEditor: Main content editing interface
- FieldRenderer: Dynamic field rendering based on schema
- MediaPicker: Image/video selection and upload
- RichTextEditor: WYSIWYG editor for content
- SlugEditor: URL slug management
- SEOEditor: Meta tags and SEO settings
- PreviewMode: Live preview of content

// Media Management Components  
- MediaLibrary: Grid view of all media
- MediaUploader: Drag & drop upload interface
- MediaEditor: Crop, resize, alt text editing
- MediaSearch: Search and filter media
- BulkActions: Batch operations on media

// Navigation Components
- NavigationBuilder: Drag & drop menu builder
- MenuItemEditor: Individual menu item settings
- NavigationPreview: Live preview of navigation

// User Management Components
- UserTable: List of all users
- UserEditor: Create/edit user profiles
- RoleManager: Permission management
- ActivityLog: User activity tracking
```

## 6. Security Considerations

### 6.1 Authentication & Authorization

```typescript
// Role-based access control
enum UserRole {
  SUPER_ADMIN = 'super_admin', // Full system access
  ADMIN = 'admin',             // Content + user management
  EDITOR = 'editor',           // Content management only
  VIEWER = 'viewer'            // Read-only access
}

// Permission matrix
const PERMISSIONS = {
  'content:read': ['super_admin', 'admin', 'editor', 'viewer'],
  'content:create': ['super_admin', 'admin', 'editor'],
  'content:update': ['super_admin', 'admin', 'editor'],
  'content:delete': ['super_admin', 'admin'],
  'content:publish': ['super_admin', 'admin'],
  'media:upload': ['super_admin', 'admin', 'editor'],
  'media:delete': ['super_admin', 'admin'],
  'users:manage': ['super_admin'],
  'system:settings': ['super_admin']
};
```

### 6.2 Data Validation

```typescript
// Content validation schemas using Zod
const DesignerSchema = z.object({
  name: z.string().min(1).max(255),
  bio: z.string().min(10).max(2000),
  instagram_handle: z.string().optional(),
  profile_image: z.string().url(),
  portfolio_images: z.array(z.string().url()),
  featured_projects: z.array(z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(500),
    image: z.string().url()
  }))
});

// API input validation middleware
export function validateContentInput(schema: z.ZodSchema) {
  return (req: NextRequest, res: NextResponse, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        }
      }, { status: 400 });
    }
  };
}
```

### 6.3 Security Measures

- **CSRF Protection**: Built-in Next.js CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Sanitization**: XSS prevention for rich text content
- **File Upload Security**: MIME type validation, file size limits
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Environment Variables**: Secure credential management

## 7. Performance Optimization

### 7.1 Caching Strategy

```typescript
// Multi-layer caching approach
interface CacheConfig {
  // Browser cache
  browser: {
    static_assets: '1y',      // Images, CSS, JS
    api_responses: '5m',      // Dynamic content
    page_content: '1h'        // Rendered pages
  };
  
  // CDN cache (Vercel Edge)
  cdn: {
    static_content: '1d',     // Static pages
    api_responses: '10m',     // API responses
    media_assets: '1y'        // Images/videos
  };
  
  // Application cache (Redis)
  redis: {
    content_items: '1h',      // Content data
    media_metadata: '6h',     // Media file info
    navigation_menu: '1d',    // Navigation structure
    user_sessions: '24h'      // Authentication
  };
}

// Cache invalidation on content updates
export async function invalidateContentCache(contentType: string, slug?: string) {
  const cacheKeys = [
    `content:${contentType}`,
    `content:${contentType}:${slug}`,
    'navigation:main',
    'sitemap'
  ];
  
  await Promise.all([
    redis.del(...cacheKeys),
    revalidateTag(`content-${contentType}`),
    revalidatePath(`/${contentType}`),
    slug && revalidatePath(`/${contentType}/${slug}`)
  ]);
}
```

### 7.2 Database Optimization

```sql
-- Database indexes for performance
CREATE INDEX idx_content_items_type_status ON content_items(content_type_id, status);
CREATE INDEX idx_content_items_slug ON content_items(slug);
CREATE INDEX idx_content_items_published ON content_items(published_at) WHERE status = 'published';
CREATE INDEX idx_media_items_tags ON media_items USING GIN(tags);
CREATE INDEX idx_content_media_content ON content_media(content_item_id);

-- Full-text search indexes
CREATE INDEX idx_content_search ON content_items USING GIN(to_tsvector('english', title || ' ' || (data->>'description')));
```

## 8. Content Migration Strategy

### 8.1 Migration from Static Data

```typescript
// Migration script for existing static data
interface MigrationPlan {
  phase1: {
    description: 'Migrate static content files to database';
    tasks: [
      'Import designers from /src/data/designers.ts',
      'Import exhibitions from /src/data/exhibitions.ts', 
      'Import navigation from /src/data/navigation.ts',
      'Import categories from /src/data/categories.ts'
    ];
  };
  
  phase2: {
    description: 'Upload and organize media assets';
    tasks: [
      'Bulk upload existing images to ImageKit',
      'Create media records in database',
      'Link media to content items',
      'Generate thumbnails and optimized versions'
    ];
  };
  
  phase3: {
    description: 'Update frontend to use CMS data';
    tasks: [
      'Replace static imports with API calls',
      'Add loading states and error handling',
      'Implement cache invalidation',
      'Test all page functionality'
    ];
  };
}

// Example migration script
async function migrateDesigners() {
  const staticDesigners = await import('@/data/designers');
  
  for (const designer of staticDesigners.designers) {
    await createContentItem({
      contentType: 'designer',
      slug: designer.id,
      title: designer.name,
      data: {
        name: designer.name,
        bio: designer.bio,
        instagram_handle: designer.instagram,
        profile_image: await uploadToImageKit(designer.image),
        portfolio_images: await Promise.all(
          designer.portfolioImages.map(uploadToImageKit)
        )
      },
      status: 'published'
    });
  }
}
```

### 8.2 Backward Compatibility

During migration, maintain backward compatibility:
- Keep static data files as fallback
- Graceful degradation if CMS is unavailable  
- Feature flags to toggle between static/dynamic content

## 9. Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema setup with Prisma
- [ ] Basic authentication with NextAuth.js
- [ ] Core API routes structure
- [ ] Admin layout and navigation

### Phase 2: Content Management (Week 3-4)
- [ ] Content type management
- [ ] Dynamic content editor
- [ ] Content listing and search
- [ ] Basic media upload

### Phase 3: Media Management (Week 5-6)
- [ ] Advanced media library
- [ ] ImageKit integration
- [ ] Bulk upload functionality
- [ ] Media optimization pipeline

### Phase 4: Advanced Features (Week 7-8)
- [ ] Navigation builder
- [ ] SEO management
- [ ] User management
- [ ] Content preview and publishing

### Phase 5: Migration & Testing (Week 9-10)
- [ ] Data migration scripts
- [ ] Frontend integration
- [ ] Performance optimization
- [ ] Security testing and deployment

## 10. Success Metrics

### 10.1 Performance Metrics
- **Page Load Time**: < 2 seconds for content pages
- **Admin Interface**: < 1 second for content editing
- **Image Optimization**: 60% reduction in image sizes
- **Cache Hit Rate**: > 80% for repeated requests

### 10.2 User Experience Metrics
- **Content Update Time**: < 5 minutes from edit to live
- **Media Upload Speed**: < 30 seconds for batch uploads
- **Admin Task Completion**: 50% faster content management
- **Error Rate**: < 1% for content operations

### 10.3 Technical Metrics
- **API Response Time**: < 200ms average
- **Database Query Performance**: < 100ms average
- **Uptime**: 99.9% availability
- **Security**: Zero security incidents

---

This design document provides a comprehensive foundation for building a modern, scalable CMS system for the REDUX portfolio website. The modular architecture ensures flexibility while maintaining high performance and security standards.