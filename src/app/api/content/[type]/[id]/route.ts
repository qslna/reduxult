import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserFromRequest, hasPermission, canAccessResource } from '@/lib/auth';
import { prisma, dbUtils } from '@/lib/db';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError, 
  ERROR_CODES,
  setCorsHeaders,
  transformContentItemForAPI
} from '@/lib/api-response';
import { ContentStatus } from '@prisma/client';

// Content item update schema
const ContentItemUpdateSchema = z.object({
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  title: z.string().min(1).max(500).optional(),
  data: z.record(z.any()).optional(),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional()
  }).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
});

// GET /api/content/[type]/[id] - Get specific content item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type: contentTypeName, id } = await params;
    
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
    
    // Get content item with relations
    const contentItem = await dbUtils.getContentItemWithRelations(id);
    
    if (!contentItem) {
      return createErrorResponse(
        'Content item not found',
        ERROR_CODES.CONTENT_ITEM_NOT_FOUND,
        404
      );
    }
    
    // Verify content type matches
    if (contentItem.contentType.name !== contentTypeName) {
      return createErrorResponse(
        'Content type mismatch',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    // Transform and return data
    const response = createSuccessResponse(
      transformContentItemForAPI(contentItem)
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/content/[type]/[id] - Update content item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type: contentTypeName, id } = await params;
    
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
    if (!hasPermission(user.role, 'content:update')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Get existing content item
    const existingItem = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        contentType: true,
        createdBy: { select: { id: true } }
      }
    });
    
    if (!existingItem) {
      return createErrorResponse(
        'Content item not found',
        ERROR_CODES.CONTENT_ITEM_NOT_FOUND,
        404
      );
    }
    
    // Verify content type matches
    if (existingItem.contentType.name !== contentTypeName) {
      return createErrorResponse(
        'Content type mismatch',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    // Check if user can access this resource
    if (!canAccessResource(user.role, 'content:update', existingItem.createdById, user.id)) {
      return createErrorResponse(
        'Insufficient permissions to edit this content',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validation = ContentItemUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const updateData = validation.data;
    
    // If slug is being updated, check for conflicts
    if (updateData.slug && updateData.slug !== existingItem.slug) {
      const conflictingItem = await prisma.contentItem.findUnique({
        where: {
          contentTypeId_slug: {
            contentTypeId: existingItem.contentTypeId,
            slug: updateData.slug
          }
        }
      });
      
      if (conflictingItem) {
        return createErrorResponse(
          'Content item with this slug already exists',
          ERROR_CODES.RESOURCE_ALREADY_EXISTS,
          409
        );
      }
    }
    
    // Store old data for audit log
    const oldData = {
      slug: existingItem.slug,
      title: existingItem.title,
      status: existingItem.status,
      data: existingItem.data
    };
    
    // Handle status change to published
    const statusUpdate: any = {};
    if (updateData.status === 'PUBLISHED' && existingItem.status !== 'PUBLISHED') {
      statusUpdate.publishedAt = new Date();
    }
    
    // Update content item
    const updatedItem = await prisma.contentItem.update({
      where: { id },
      data: {
        ...updateData,
        ...statusUpdate,
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
    
    // Log the update
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'update',
        resource: 'content_item',
        resourceId: id,
        oldData,
        newData: updateData
      }
    });
    
    const response = createSuccessResponse(
      transformContentItemForAPI(updatedItem)
    );
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/content/[type]/[id] - Delete content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type: contentTypeName, id } = await params;
    
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
    if (!hasPermission(user.role, 'content:delete')) {
      return createErrorResponse(
        'Insufficient permissions',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Get existing content item
    const existingItem = await prisma.contentItem.findUnique({
      where: { id },
      include: {
        contentType: true,
        createdBy: { select: { id: true } }
      }
    });
    
    if (!existingItem) {
      return createErrorResponse(
        'Content item not found',
        ERROR_CODES.CONTENT_ITEM_NOT_FOUND,
        404
      );
    }
    
    // Verify content type matches
    if (existingItem.contentType.name !== contentTypeName) {
      return createErrorResponse(
        'Content type mismatch',
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    // Check if user can access this resource
    if (!canAccessResource(user.role, 'content:delete', existingItem.createdById, user.id)) {
      return createErrorResponse(
        'Insufficient permissions to delete this content',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }
    
    // Store data for audit log
    const deletedData = {
      slug: existingItem.slug,
      title: existingItem.title,
      status: existingItem.status
    };
    
    // Delete content item (cascade will handle related records)
    await prisma.contentItem.delete({
      where: { id }
    });
    
    // Log the deletion
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'delete',
        resource: 'content_item',
        resourceId: id,
        oldData: deletedData
      }
    });
    
    const response = createSuccessResponse({
      message: 'Content item deleted successfully'
    });
    
    return setCorsHeaders(response);
    
  } catch (error) {
    return handleApiError(error);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}