import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const token = searchParams.get('token') || '';
  const expire = searchParams.get('expire') || '';
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';

  if (!privateKey) {
    return NextResponse.json(
      { error: 'ImageKit private key not configured' },
      { status: 500 }
    );
  }

  const defaultExpire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes
  const authenticationParameters = token + (expire || defaultExpire);

  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(authenticationParameters)
    .digest('hex');

  return NextResponse.json({
    token,
    expire: expire || defaultExpire,
    signature,
  });
}