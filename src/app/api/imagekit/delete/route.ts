import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(request: NextRequest) {
  try {
    const { fileId, url } = await request.json();

    if (!fileId && !url) {
      return NextResponse.json(
        { error: 'No fileId or url provided' },
        { status: 400 }
      );
    }

    // ImageKit 삭제는 fileId를 사용
    if (fileId) {
      await imagekit.deleteFile(fileId);
      return NextResponse.json({ success: true });
    }

    // URL로 파일 찾아서 삭제 (fallback)
    if (url) {
      // URL에서 파일 경로 추출
      const urlParts = new URL(url);
      const filePath = urlParts.pathname;
      
      // 파일 목록에서 해당 URL의 파일 찾기
      const files = await imagekit.listFiles({
        path: filePath,
      });

      if (files.length > 0) {
        await imagekit.deleteFile(files[0].fileId);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}