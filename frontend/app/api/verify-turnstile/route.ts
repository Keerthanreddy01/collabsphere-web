import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 400 }
    );
  }

  const secretKey = process.env.NODE_ENV === 'development'
    ? '1x0000000000000000000000000000000AA' // Test secret
    : (process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAADorXDHAdoZ99IqXCSrq8zUN2Yg'); // Production secret fallback

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 403 }
    );
  }
}
