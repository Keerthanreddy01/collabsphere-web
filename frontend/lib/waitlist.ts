export type WaitlistPlatform = 'android' | 'ios' | 'both'

export type WaitlistResult = {
  success: boolean
  position: number
  refCode: string
  message: string
}

/**
 * Waitlist records are intentionally handled by the server: they contain PII
 * and position assignment must be atomic.
 */
export async function joinWaitlist(
  email: string,
  platform: WaitlistPlatform,
  referredBy: string | null,
  turnstileToken: string | null,
): Promise<WaitlistResult> {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, platform, referredBy, turnstileToken }),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.success) {
    return {
      success: false,
      position: 0,
      refCode: '',
      message: body?.error ?? 'Unable to join the waitlist. Please try again.',
    }
  }
  return body as WaitlistResult
}
