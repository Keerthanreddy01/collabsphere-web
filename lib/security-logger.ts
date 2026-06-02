/**
 * lib/security-logger.ts
 * Lightweight security audit trail for CollabSphere.
 *
 * Writes auth events to Firestore `auth_events` collection so administrators
 * can detect suspicious patterns (repeated failed logins, unusual sign-in
 * locations, etc.) without storing any sensitive data.
 *
 * Each event document contains ONLY:
 *  - uid            (who)
 *  - event          (what happened)
 *  - method         (how: email | google | github)
 *  - timestamp      (when)
 *  - userAgent      (browser fingerprint — no PII)
 */

export type AuthEventType =
  | 'sign_in_success'
  | 'sign_in_failure'
  | 'sign_up_success'
  | 'sign_out'
  | 'password_reset_requested'
  | 'profile_updated'

export interface AuthEventPayload {
  uid?: string          // undefined on failed sign-in (user not authenticated)
  event: AuthEventType
  method?: 'email' | 'google' | 'github'
  metadata?: Record<string, string | number | boolean>
}

/**
 * Logs a security-relevant event to Firestore.
 * Fails silently — logging errors should never break the auth flow.
 */
export async function logSecurityEvent(payload: AuthEventPayload): Promise<void> {
  try {
    const { db } = await import('./firebase')
    if (!db) return // Firebase not initialized (e.g., missing env vars in dev)

    const { collection, addDoc } = await import('firebase/firestore')

    const entry = {
      uid:       payload.uid ?? 'unauthenticated',
      event:     payload.event,
      method:    payload.method ?? 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined'
        ? navigator.userAgent.slice(0, 200) // cap length
        : 'server',
      ...(payload.metadata ?? {}),
    }

    await addDoc(collection(db, 'auth_events'), entry)
  } catch {
    // Never throw — security logging is a non-critical side-effect
  }
}
