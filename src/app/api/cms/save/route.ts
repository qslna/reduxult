/**
 * CMS 데이터 저장 API
 * localStorage 대체 서버사이드 저장소
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 메모리 저장소 (프로덕션에서는 Vercel KV 또는 데이터베이스 사용)
const cmsStorage = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, data, type, timestamp } = body;

    // 입력 검증
    if (!slotId || data === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: slotId and data' },
        { status: 400 }
      );
    }

    // 데이터 타입 검증
    if (type === 'gallery' && !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Gallery type requires array data' },
        { status: 400 }
      );
    }

    if (type === 'single' && Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Single type requires non-array data' },
        { status: 400 }
      );
    }

    // 데이터 저장
    const saveData = {
      slotId,
      data,
      type: type || 'single',
      lastModified: timestamp || new Date().toISOString(),
      version: (cmsStorage.get(slotId)?.version || 0) + 1
    };

    cmsStorage.set(slotId, saveData);

    // 로그 기록
    console.log(`CMS Data Saved: ${slotId} (${type || 'single'}) at ${saveData.lastModified}`);

    return NextResponse.json({
      success: true,
      data: saveData,
      message: 'Data saved successfully'
    });

  } catch (error) {
    console.error('CMS Save API Error:', error);
    
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}