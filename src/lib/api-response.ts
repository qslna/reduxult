import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Standard API response interface
export interface APIResponse<T = any> {
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
    [key: string]: any;
  };
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Success response helper
export function createSuccessResponse<T>(
  data: T,
  meta?: APIResponse<T>['meta'],
  status: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta })
  }, { status });
}

// Error response helper
export function createErrorResponse(
  message: string,
  code: string,
  status: number = 400,
  details?: any
): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: {
      message,
      code,
      ...(details && { details })
    }
  }, { status });
}

// HTTP error codes and messages
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Content errors
  CONTENT_TYPE_NOT_FOUND: 'CONTENT_TYPE_NOT_FOUND',
  CONTENT_ITEM_NOT_FOUND: 'CONTENT_ITEM_NOT_FOUND',
  INVALID_CONTENT_SCHEMA: 'INVALID_CONTENT_SCHEMA',
  CONTENT_ALREADY_PUBLISHED: 'CONTENT_ALREADY_PUBLISHED',
  
  // Media errors
  MEDIA_UPLOAD_FAILED: 'MEDIA_UPLOAD_FAILED',
  MEDIA_NOT_FOUND: 'MEDIA_NOT_FOUND',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  
  // Permission errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ADMIN_REQUIRED: 'ADMIN_REQUIRED',
  OWNER_REQUIRED: 'OWNER_REQUIRED',
  
  // System errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

// Predefined error responses
export const errorResponses = {
  unauthorized: () => createErrorResponse(
    'Authentication required',
    ERROR_CODES.UNAUTHORIZED,
    HTTP_STATUS.UNAUTHORIZED
  ),
  
  forbidden: () => createErrorResponse(
    'Insufficient permissions',
    ERROR_CODES.FORBIDDEN,
    HTTP_STATUS.FORBIDDEN
  ),
  
  notFound: (resource: string = 'Resource') => createErrorResponse(
    `${resource} not found`,
    ERROR_CODES.RESOURCE_NOT_FOUND,
    HTTP_STATUS.NOT_FOUND
  ),
  
  conflict: (message: string = 'Resource already exists') => createErrorResponse(
    message,
    ERROR_CODES.RESOURCE_CONFLICT,
    HTTP_STATUS.CONFLICT
  ),
  
  validationError: (details: any) => createErrorResponse(
    'Validation failed',
    ERROR_CODES.VALIDATION_ERROR,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    details
  ),
  
  serverError: (message: string = 'Internal server error') => createErrorResponse(
    message,
    ERROR_CODES.SERVER_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  )
};

// Error handler for API routes
export function handleApiError(error: unknown): NextResponse<APIResponse> {
  console.error('API Error:', error);
  
  // Zod validation errors
  if (error instanceof ZodError) {
    return errorResponses.validationError(error.errors);
  }
  
  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        return errorResponses.conflict('Resource already exists');
      case 'P2025': // Record not found
        return errorResponses.notFound();
      case 'P2003': // Foreign key constraint violation
        return createErrorResponse(
          'Invalid reference to related resource',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST
        );
      default:
        return createErrorResponse(
          'Database operation failed',
          ERROR_CODES.DATABASE_ERROR,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
  }
  
  // Standard Error objects
  if (error instanceof Error) {
    return errorResponses.serverError(error.message);
  }
  
  // Unknown errors
  return errorResponses.serverError('An unexpected error occurred');
}

// Pagination helper
export function createPaginationMeta(
  total: number,
  page: number = 1,
  limit: number = 10
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

// Parse pagination parameters from request
export function parsePaginationParams(
  searchParams: URLSearchParams
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  
  return { page, limit };
}

// Calculate skip value for database queries
export function getSkipValue(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Content transformation helpers
export function transformContentItemForAPI(contentItem: any) {
  return {
    id: contentItem.id,
    contentType: contentItem.contentType.name,
    slug: contentItem.slug,
    title: contentItem.title,
    data: contentItem.data,
    meta: contentItem.meta,
    status: contentItem.status.toLowerCase(),
    publishedAt: contentItem.publishedAt?.toISOString(),
    createdAt: contentItem.createdAt.toISOString(),
    updatedAt: contentItem.updatedAt.toISOString(),
    createdBy: contentItem.createdBy ? {
      id: contentItem.createdBy.id,
      name: contentItem.createdBy.name,
      email: contentItem.createdBy.email
    } : null,
    updatedBy: contentItem.updatedBy ? {
      id: contentItem.updatedBy.id,
      name: contentItem.updatedBy.name,
      email: contentItem.updatedBy.email
    } : null,
    media: contentItem.media?.map((cm: any) => ({
      fieldName: cm.fieldName,
      sortOrder: cm.sortOrder,
      media: {
        id: cm.mediaItem.id,
        filename: cm.mediaItem.filename,
        url: cm.mediaItem.imagekitUrl,
        thumbnailUrl: cm.mediaItem.thumbnailUrl,
        altText: cm.mediaItem.altText,
        caption: cm.mediaItem.caption,
        mimeType: cm.mediaItem.mimeType,
        fileSize: cm.mediaItem.fileSize
      }
    })) || []
  };
}

export function transformMediaItemForAPI(mediaItem: any) {
  return {
    id: mediaItem.id,
    filename: mediaItem.filename,
    originalFilename: mediaItem.originalFilename,
    url: mediaItem.imagekitUrl,
    thumbnailUrl: mediaItem.thumbnailUrl,
    altText: mediaItem.altText,
    caption: mediaItem.caption,
    tags: mediaItem.tags,
    mimeType: mediaItem.mimeType,
    fileSize: mediaItem.fileSize,
    metadata: mediaItem.metadata,
    uploadedBy: mediaItem.uploadedBy ? {
      id: mediaItem.uploadedBy.id,
      name: mediaItem.uploadedBy.name,
      email: mediaItem.uploadedBy.email
    } : null,
    createdAt: mediaItem.createdAt.toISOString()
  };
}

// Response caching headers
export function setCacheHeaders(response: NextResponse, maxAge: number = 300) {
  response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  response.headers.set('CDN-Cache-Control', `max-age=${maxAge * 10}`);
  response.headers.set('Vary', 'Accept-Encoding, Authorization');
  return response;
}

// CORS headers for API
export function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}