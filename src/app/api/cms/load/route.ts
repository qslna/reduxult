/**
 * CMS 데이터 로드 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 메모리 저장소 (save route와 동일한 인스턴스 공유)
// 프로덕션에서는 Vercel KV 또는 데이터베이스 사용
const cmsStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('slotId');

    if (!slotId) {
      return NextResponse.json(
        { error: 'Missing required parameter: slotId' },
        { status: 400 }
      );
    }

    // 데이터 로드
    const storedData = cmsStorage.get(slotId);

    if (!storedData) {
      // 데이터가 없으면 빈 응답 (에러가 아님)
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No data found for this slot'
      });
    }

    return NextResponse.json({
      success: true,
      data: storedData.data,
      metadata: {
        slotId: storedData.slotId,
        type: storedData.type,
        lastModified: storedData.lastModified,
        version: storedData.version
      }
    });

  } catch (error) {
    console.error('CMS Load API Error:', error);
    
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