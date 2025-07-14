import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !urlEndpoint) {
      return NextResponse.json(
        { error: 'ImageKit configuration missing' },
        { status: 500 }
      );
    }

    // ImageKit delete endpoint
    const deleteUrl = `https://api.imagekit.io/v1/files/${fileId}`;
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${Buffer.from(privateKey + ':').toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('ImageKit delete error:', error);
      return NextResponse.json(
        { error: 'Delete failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}