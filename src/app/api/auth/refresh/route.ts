import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { refreshUserToken } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, handleApiError, ERROR_CODES, setCorsHeaders } from '@/lib/api-response';

// Request validation schema
const RefreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = RefreshSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const { refreshToken } = validation.data;
    
    // Refresh tokens
    const authResult = await refreshUserToken(refreshToken);
    
    if (!authResult) {
      return createErrorResponse(
        'Invalid or expired refresh token',
        ERROR_CODES.TOKEN_INVALID,
        401
      );
    }
    
    // Return new tokens
    const response = createSuccessResponse({
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role
      },
      token: authResult.token,
      refreshToken: authResult.refreshToken
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