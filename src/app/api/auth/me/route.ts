import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, getUserProfile } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, handleApiError, ERROR_CODES, setCorsHeaders } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from request
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return createErrorResponse(
        'Authentication required',
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }
    
    // Get full user profile from database
    const userProfile = await getUserProfile(user.id);
    
    if (!userProfile) {
      return createErrorResponse(
        'User not found',
        ERROR_CODES.RESOURCE_NOT_FOUND,
        404
      );
    }
    
    // Return user profile
    const response = createSuccessResponse({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role,
      avatarUrl: userProfile.avatarUrl,
      createdAt: userProfile.createdAt.toISOString(),
      lastLoginAt: userProfile.lastLoginAt?.toISOString() || null
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