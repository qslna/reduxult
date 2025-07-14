import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: 'ImageKit configuration missing' },
        { status: 500 }
      );
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour

    const auth = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature: auth,
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}