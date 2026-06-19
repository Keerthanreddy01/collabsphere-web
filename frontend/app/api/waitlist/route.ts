import { NextRequest, NextResponse } from 'next/server';

// ── In-memory rate limiter ────────────────────────────────────────────────────
// In production with multiple instances, replace with Redis or a similar store.
const rateLimitMap = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3; // max 3 waitlist attempts per IP per hour

  const requests = rateLimitMap.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false; // rate limited
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(req: NextRequest) {
  // Get IP from proxy header or fall back
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit check
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, platform, honeypot } = body;

  // Honeypot check — bots fill this hidden field
  if (honeypot) {
    // Return 200 to not tip off the bot
    return NextResponse.json({ success: true, position: 999, refCode: 'FAKE00' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // Platform validation
  if (!['android', 'ios', 'both'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }

  // All server-side checks passed — let the client proceed with Firebase write
  return NextResponse.json({ success: true });
}
