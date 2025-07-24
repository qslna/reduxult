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
  getSkipValue
} from '@/lib/api-response';
import { UserRole } from '@prisma/client';

// Content type schema validation
const ContentTypeSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z_]+$/, 'Name must be lowercase with underscores only'),
  displayName: z.string().min(1).max(255),
  schema: z.object({
    fields: z.array(z.object({
      name: z.string().min(1),
      type: z.enum(['text', 'textarea', 'rich_text', 'number', 'date', 'boolean', 'image', 'gallery', 'repeater']),
      required: z.boolean().default(false),
      label: z.string().min(1),
      description: z.string().optional(),
      validation: z.record(z.any()).optional(),
      fields: z.array(z.any()).optional() // For repeater fields
    }))
  })
});

// GET /api/content/types - List all content types
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
    if (!hasPermission(user.role, 'content:read')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Parse pagination
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePaginationParams(searchParams);
    
    // Get content types with pagination
    const [contentTypes, total] = await Promise.all([
      prisma.contentType.findMany({
        skip: getSkipValue(page, limit),
        take: limit,
        orderBy: { displayName: 'asc' },
        include: {
          _count: {
            select: { contentItems: true }
          }
        }
      }),
      prisma.contentType.count()
    ]);
    
    // Transform data
    const transformedContentTypes = contentTypes.map(ct => ({
      id: ct.id,
      name: ct.name,
      displayName: ct.displayName,
      schema: ct.schema,
      itemCount: ct._count.contentItems,
      createdAt: ct.createdAt.toISOString()
    }));
    
    const response = createSuccessResponse(
      transformedContentTypes,
      { pagination: createPaginationMeta(total, page, limit) }
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/content/types - Create new content type
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
    
    // Check permissions (only super admin can create content types)
    if (!hasPermission(user.role, 'contentTypes:manage')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = ContentTypeSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const { name, displayName, schema } = validation.data;
    
    // Check if content type with this name already exists
    const existingContentType = await prisma.contentType.findUnique({
      where: { name }
    });
    
    if (existingContentType) {
      return createErrorResponse(
        'Content type with this name already exists',
        ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        409
      );
    }
    
    // Create content type
    const contentType = await prisma.contentType.create({
      data: {
        name,
        displayName,
        schema
      }
    });
    
    const response = createSuccessResponse({
      id: contentType.id,
      name: contentType.name,
      displayName: contentType.displayName,
      schema: contentType.schema,
      createdAt: contentType.createdAt.toISOString()
    }, undefined, 201);
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}