/**
 * CMS 전체 데이터 로드 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 메모리 저장소 (다른 route와 동일한 인스턴스 공유)
const cmsStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    // 모든 CMS 데이터를 객체로 변환
    const allData: Record<string, any> = {};
    const metadata: Record<string, any> = {};

    cmsStorage.forEach((value, key) => {
      allData[key] = value.data;
      metadata[key] = {
        type: value.type,
        lastModified: value.lastModified,
        version: value.version
      };
    });

    return NextResponse.json({
      success: true,
      data: allData,
      metadata,
      count: cmsStorage.size,
      message: `Loaded ${cmsStorage.size} CMS entries`
    });

  } catch (error) {
    console.error('CMS Load All API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
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