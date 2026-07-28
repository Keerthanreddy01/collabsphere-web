import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'

const rateLimitMap = new Map<string, number[]>()
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateLimitMap.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000)
  if (recent.length >= 3) return true
  rateLimitMap.set(ip, [...recent, now])
  return false
}

function createRefCode(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return process.env.NODE_ENV !== 'production'
  if (typeof token !== 'string' || !token) return false

  const formData = new FormData()
  formData.set('secret', secret)
  formData.set('response', token)
  formData.set('remoteip', ip)
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: formData,
    })
    return response.ok && Boolean((await response.json()).success)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }
  const db = adminDb
  if (!db) {
    return NextResponse.json({ error: 'Waitlist service is unavailable.' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const platform = body?.platform
  const referredBy = typeof body?.referredBy === 'string' ? body.referredBy.slice(0, 32) : null
  if (!EMAIL_PATTERN.test(email) || !['android', 'ios', 'both'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid waitlist details.' }, { status: 400 })
  }
  if (!await verifyTurnstile(body?.turnstileToken, ip)) {
    return NextResponse.json({ error: 'Security check failed. Please refresh and try again.' }, { status: 403 })
  }

  try {
    const result = await db.runTransaction(async (transaction) => {
      const waitlist = db.collection('app_waitlist')
      const existing = await transaction.get(waitlist.where('email', '==', email).limit(1))
      if (!existing.empty) {
        const record = existing.docs[0].data()
        return { position: record.position, refCode: record.ref_code, existing: true }
      }

      const counterRef = db.collection('_system').doc('waitlist')
      const counter = await transaction.get(counterRef)
      const position = (counter.data()?.count ?? 0) + 1
      const refCode = createRefCode()
      transaction.set(waitlist.doc(), {
        email, platform, referred_by: referredBy, position, ref_code: refCode,
        joined_at: FieldValue.serverTimestamp(),
      })
      transaction.set(counterRef, { count: position }, { merge: true })
      return { position, refCode, existing: false }
    })
    return NextResponse.json({
      success: true, position: result.position, refCode: result.refCode,
      message: result.existing ? 'Already registered!' : 'Pre-registered successfully!',
    })
  } catch {
    return NextResponse.json({ error: 'Unable to join the waitlist. Please try again.' }, { status: 500 })
  }
}
