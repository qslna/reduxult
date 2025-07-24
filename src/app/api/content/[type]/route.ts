import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import { prisma, dbUtils } from '@/lib/db';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  ERROR_CODES,
  setCorsHeaders,
  parsePaginationParams,
  createPaginationMeta,
  getSkipValue,
  transformContentItemForAPI
} from '@/lib/api-response';
import { ContentStatus } from '@prisma/client';

// Content item validation schema
const ContentItemSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(500),
  data: z.record(z.any()),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional()
  }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT')
});

// GET /api/content/[type] - List content items of specific type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type: contentTypeName } = await params;
    
    // Check authentication
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse(
        'Authentication required',
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }
    
    // Check permissions
    if (!hasPermission(user.role, 'content:read')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Verify content type exists
    const contentType = await prisma.contentType.findUnique({
      where: { name: contentTypeName }
    });
    
    if (!contentType) {
      return createErrorResponse(
        'Content type not found',
        ERROR_CODES.CONTENT_TYPE_NOT_FOUND,
        404
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePaginationParams(searchParams);
    const status = searchParams.get('status') as ContentStatus | null;
    const search = searchParams.get('search') || '';
    
    // Build where clause
    const where: any = {
      contentTypeId: contentType.id
    };
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Get content items with pagination
    const [contentItems, total] = await Promise.all([
      prisma.contentItem.findMany({
        where,
        skip: getSkipValue(page, limit),
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          contentType: true,
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          updatedBy: {
            select: { id: true, name: true, email: true }
          },
          media: {
            include: { mediaItem: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      }),
      prisma.contentItem.count({ where })
    ]);
    
    // Transform data
    const transformedItems = contentItems.map(transformContentItemForAPI);
    
    const response = createSuccessResponse(
      transformedItems,
      { 
        pagination: createPaginationMeta(total, page, limit),
        contentType: {
          name: contentType.name,
          displayName: contentType.displayName,
          schema: contentType.schema
        }
      }
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/content/[type] - Create new content item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type: contentTypeName } = await params;
    
    // Check authentication
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse(
        'Authentication required',
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }
    
    // Check permissions
    if (!hasPermission(user.role, 'content:create')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Verify content type exists
    const contentType = await prisma.contentType.findUnique({
      where: { name: contentTypeName }
    });
    
    if (!contentType) {
      return createErrorResponse(
        'Content type not found',
        ERROR_CODES.CONTENT_TYPE_NOT_FOUND,
        404
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = ContentItemSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const { slug, title, data, meta, status } = validation.data;
    
    // Check if content item with this slug already exists for this content type
    const existingItem = await prisma.contentItem.findUnique({
      where: {
        contentTypeId_slug: {
          contentTypeId: contentType.id,
          slug
        }
      }
    });
    
    if (existingItem) {
      return createErrorResponse(
        'Content item with this slug already exists',
        ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        409
      );
    }
    
    // Validate content data against schema
    // TODO: Implement schema validation logic based on contentType.schema
    
    // Create content item
    const contentItem = await prisma.contentItem.create({
      data: {
        contentTypeId: contentType.id,
        slug,
        title,
        data,
        meta,
        status: status as ContentStatus,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        createdById: user.id,
        updatedById: user.id
      },
      include: {
        contentType: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        updatedBy: {
          select: { id: true, name: true, email: true }
        },
        media: {
          include: { mediaItem: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    // Log the creation
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'create',
        resource: 'content_item',
        resourceId: contentItem.id,
        newData: {
          contentType: contentTypeName,
          slug,
          title,
          status
        }
      }
    });
    
    const response = createSuccessResponse(
      transformContentItemForAPI(contentItem),
      undefined,
      201
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}