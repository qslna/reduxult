// CMS API Client - Frontend에서 CMS API와 통신하는 클라이언트
import { APIResponse } from './api-response';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface ContentType {
  id: string;
  name: string;
  displayName: string;
  schema: {
    fields: ContentField[];
  };
  itemCount?: number;
  createdAt: string;
}

export interface ContentField {
  name: string;
  type: 'text' | 'textarea' | 'rich_text' | 'number' | 'date' | 'boolean' | 'image' | 'gallery' | 'repeater';
  required: boolean;
  label: string;
  description?: string;
  validation?: Record<string, any>;
  fields?: ContentField[];
}

export interface ContentItem {
  id: string;
  contentType: string;
  slug: string;
  title: string;
  data: Record<string, any>;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  updatedBy?: User;
  media: ContentMedia[];
}

export interface ContentMedia {
  fieldName: string;
  sortOrder: number;
  media: MediaItem;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  tags: string[];
  mimeType: string;
  fileSize: number;
  metadata?: Record<string, any>;
  uploadedBy?: User;
  createdAt: string;
  usedIn?: {
    contentItemId: string;
    title: string;
    slug: string;
    fieldName: string;
  }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class CMSClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('cms_token');
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cms_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_refresh_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();
    
    // Handle token refresh if needed
    if (response.status === 401 && this.token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request
        return this.request(endpoint, options);
      }
    }

    return data;
  }

  // Authentication API calls
  async login(email: string, password: string) {
    const response = await this.request<{
      user: User;
      token: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms_refresh_token', response.data.refreshToken);
      }
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.clearToken();
    return response;
  }

  async refreshToken() {
    if (typeof window === 'undefined') return false;
    
    const refreshToken = localStorage.getItem('cms_refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await this.request<{
        user: User;
        token: string;
        refreshToken: string;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.success && response.data) {
        this.setToken(response.data.token);
        localStorage.setItem('cms_refresh_token', response.data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.clearToken();
    return false;
  }

  async getCurrentUser() {
    return this.request<User>('/auth/me');
  }

  // Content Type API calls
  async getContentTypes(page = 1, limit = 10) {
    return this.request<ContentType[]>(`/content/types?page=${page}&limit=${limit}`);
  }

  async createContentType(data: Omit<ContentType, 'id' | 'createdAt' | 'itemCount'>) {
    return this.request<ContentType>('/content/types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Content API calls
  async getContentItems(
    contentType: string,
    params: {
      page?: number;
      limit?: number;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
      search?: string;
    } = {}
  ) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request<ContentItem[]>(`/content/${contentType}?${searchParams}`);
  }

  async getContentItem(contentType: string, id: string) {
    return this.request<ContentItem>(`/content/${contentType}/${id}`);
  }

  async createContentItem(
    contentType: string,
    data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'media'>
  ) {
    return this.request<ContentItem>(`/content/${contentType}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContentItem(
    contentType: string,
    id: string,
    data: Partial<Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'media'>>
  ) {
    return this.request<ContentItem>(`/content/${contentType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContentItem(contentType: string, id: string) {
    return this.request(`/content/${contentType}/${id}`, {
      method: 'DELETE',
    });
  }

  // Media API calls
  async getMediaItems(params: {
    page?: number;
    limit?: number;
    search?: string;
    mimeType?: string;
    tags?: string[];
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags' && Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return this.request<MediaItem[]>(`/media?${searchParams}`);
  }

  async createMediaItem(data: Omit<MediaItem, 'id' | 'createdAt' | 'uploadedBy' | 'usedIn'>) {
    return this.request<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMediaItem(id: string) {
    return this.request<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  // Public API calls (no authentication required)
  async getPublishedContent(contentType: string, slug?: string) {
    const url = slug 
      ? `/public/content/${contentType}?slug=${slug}`
      : `/public/content/${contentType}`;
    
    return this.request<ContentItem | ContentItem[]>(url);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
export const cmsClient = new CMSClient();

// React hook for using CMS client
export function useCMSClient() {
  return cmsClient;
}