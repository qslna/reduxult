// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest, hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  ERROR_CODES,
  setCorsHeaders,
  parsePaginationParams,
  createPaginationMeta,
  getSkipValue,
  transformMediaItemForAPI
} from '@/lib/api-response';

// Media upload schema
const MediaUploadSchema = z.object({
  filename: z.string().min(1),
  originalFilename: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().positive(),
  imagekitFileId: z.string().optional(),
  imagekitUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional()
});

// GET /api/media - List media items
export async function GET(request: NextRequest) {
  try {
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
    if (!hasPermission(user.role, 'media:read')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePaginationParams(searchParams);
    const search = searchParams.get('search') || '';
    const mimeType = searchParams.get('mimeType') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalFilename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (mimeType) {
      where.mimeType = { startsWith: mimeType };
    }
    
    if (tags.length > 0) {
      where.tags = { hasSome: tags };
    }
    
    // Get media items with pagination
    const [mediaItems, total] = await Promise.all([
      prisma.mediaItem.findMany({
        where,
        skip: getSkipValue(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true }
          },
          content: {
            include: {
              contentItem: {
                select: { id: true, title: true, slug: true }
              }
            }
          }
        }
      }),
      prisma.mediaItem.count({ where })
    ]);
    
    // Transform data
    const transformedItems = mediaItems.map(item => ({
      ...transformMediaItemForAPI(item),
      usedIn: item.content.map(c => ({
        contentItemId: c.contentItem.id,
        title: c.contentItem.title,
        slug: c.contentItem.slug,
        fieldName: c.fieldName
      }))
    }));
    
    const response = createSuccessResponse(
      transformedItems,
      { pagination: createPaginationMeta(total, page, limit) }
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/media - Create media record (after upload to ImageKit)
export async function POST(request: NextRequest) {
  try {
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
    if (!hasPermission(user.role, 'media:upload')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = MediaUploadSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const mediaData = validation.data;
    
    // Create media item record
    const mediaItem = await prisma.mediaItem.create({
      data: {
        ...mediaData,
        uploadedById: user.id
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    // Log the upload
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'create',
        resource: 'media_item',
        resourceId: mediaItem.id,
        newData: {
          filename: mediaItem.filename,
          mimeType: mediaItem.mimeType,
          fileSize: mediaItem.fileSize
        }
      }
    });
    
    const response = createSuccessResponse(
      transformMediaItemForAPI(mediaItem),
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