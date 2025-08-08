/**
 * CMS 백엔드 상태 확인 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 메모리 저장소 (다른 route와 동일한 인스턴스 공유)
const cmsStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      data: {
        server: {
          status: 'running',
          uptime: uptime,
          uptimeReadable: `${Math.floor(uptime / 60)} minutes`,
          memory: {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
            external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
          }
        },
        cms: {
          totalSlots: cmsStorage.size,
          storageType: 'memory',
          lastCheck: new Date().toISOString()
        }
      },
      message: 'CMS Backend is running normally'
    });

  } catch (error) {
    console.error('CMS Health Check Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        status: 'error',
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 지원 (CORS)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}