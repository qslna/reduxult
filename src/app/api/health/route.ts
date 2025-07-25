import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSuccessResponse, createErrorResponse, setCorsHeaders } from '@/lib/api-response';

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  try {
    // Check database health
    const dbHealth = await db.healthCheck();
    
    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      environment_variables: {
        status: missingEnvVars.length === 0 ? 'healthy' : 'warning',
        missing: missingEnvVars
      },
      services: {
        database: dbHealth.status === 'ok' ? 'healthy' : 'unhealthy',
        imagekit: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ? 'configured' : 'not_configured'
      }
    };
    
    // Determine overall status
    const isHealthy = dbHealth.status === 'ok' && missingEnvVars.length === 0;
    const status = isHealthy ? 200 : 503;
    healthStatus.status = isHealthy ? 'healthy' : 'unhealthy';
    
    const response = createSuccessResponse(healthStatus, undefined, status);
    return setCorsHeaders(response);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse = createErrorResponse(
      'Health check failed',
      'HEALTH_CHECK_FAILED',
      503,
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return setCorsHeaders(errorResponse);
  }
}

export async function OPTIONS() {
  const response = NextResponse.json(null, { status: 200 });
  return setCorsHeaders(response);
}