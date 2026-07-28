import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token;

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 400 }
    );
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ success: false, error: 'Security check is unavailable' }, { status: 503 });
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  let data: { success?: boolean };
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: formData }
    );
    data = await res.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Security check is unavailable' }, { status: 503 });
  }

  if (data.success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 403 }
    );
  }
}
