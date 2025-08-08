/**
 * CMS 데이터 삭제 API
 */

import { NextRequest, NextResponse } from 'next/server';

// 임시 메모리 저장소 (다른 route와 동일한 인스턴스 공유)
const cmsStorage = new Map<string, any>();

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { slotId, timestamp } = body;

    if (!slotId) {
      return NextResponse.json(
        { error: 'Missing required field: slotId' },
        { status: 400 }
      );
    }

    // 데이터 존재 확인
    const existingData = cmsStorage.get(slotId);
    
    if (!existingData) {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }

    // 데이터 삭제
    const deleted = cmsStorage.delete(slotId);

    if (deleted) {
      console.log(`CMS Data Deleted: ${slotId} at ${timestamp || new Date().toISOString()}`);
      
      return NextResponse.json({
        success: true,
        data: {
          slotId,
          deleted: true,
          deletedAt: timestamp || new Date().toISOString()
        },
        message: 'Data deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete data' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('CMS Delete API Error:', error);
    
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}