import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, setCorsHeaders } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    // In a stateless JWT setup, logout is mainly client-side
    // The client should remove the token from storage
    
    // For enhanced security, we could maintain a blacklist of tokens
    // or implement token revocation, but for now we'll keep it simple
    
    const response = createSuccessResponse({
      message: 'Logged out successfully'
    });
    
    return setCorsHeaders(response);
    
  } catch (error) {
    const response = createSuccessResponse({
      message: 'Logout completed'
    });
    
    return setCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}