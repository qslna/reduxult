import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authenticateUser } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, handleApiError, ERROR_CODES } from '@/lib/api-response';

// Request validation schema
const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid input',
        ERROR_CODES.VALIDATION_ERROR,
        400,
        validation.error.errors
      );
    }
    
    const { email, password } = validation.data;
    
    // Authenticate user
    const authResult = await authenticateUser(email, password);
    
    if (!authResult) {
      return createErrorResponse(
        'Invalid email or password',
        ERROR_CODES.INVALID_CREDENTIALS,
        401
      );
    }
    
    // Return success response with user data and tokens
    return createSuccessResponse({
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        role: authResult.user.role
      },
      token: authResult.token,
      refreshToken: authResult.refreshToken
    }, undefined, 200);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}