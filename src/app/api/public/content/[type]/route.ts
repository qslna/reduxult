import { NextRequest, NextResponse } from 'next/server';
import { dbUtils } from '@/lib/db';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  ERROR_CODES,
  setCorsHeaders,
  setCacheHeaders,
  transformContentItemForAPI
} from '@/lib/api-response';

// GET /api/public/content/[type] - Get published content (no auth required)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type: contentTypeName } = await params;
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    // Get published content
    const content = await dbUtils.getPublishedContent(contentTypeName, slug || undefined);
    
    if (!content) {
      return createErrorResponse(
        slug ? 'Content item not found' : 'No published content found',
        ERROR_CODES.CONTENT_ITEM_NOT_FOUND,
        404
      );
    }
    
    // Transform data for public API (remove sensitive fields)
    const transformData = (item: any) => {
      const transformed = transformContentItemForAPI(item);
      // Remove sensitive information for public API
      const { createdBy, updatedBy, ...publicData } = transformed;
      return publicData;
    };
    
    const responseData = Array.isArray(content) 
      ? content.map(transformData)
      : transformData(content);
    
    const response = createSuccessResponse(responseData);
    
    // Set cache headers for published content (cache for 5 minutes)
    setCacheHeaders(response, 300);
    
    return setCorsHeaders(response);
    
  } catch (error) {
    console.error('Public content API error:', error);
    
    return createErrorResponse(
      'Failed to fetch content',
      ERROR_CODES.SERVER_ERROR,
      500
    );
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}