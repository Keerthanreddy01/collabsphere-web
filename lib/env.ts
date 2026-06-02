/**
 * lib/env.ts
 * Runtime validation for required environment variables.
 * Throws a descriptive error at startup if any required env var is missing,
 * preventing silent failures or accidental use of wrong configs.
 */

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

export function validateEnv(): void {
  if (typeof window === 'undefined') return // Only validate on client

  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key] || process.env[key]!.trim() === ''
  )

  if (missing.length > 0) {
    const message = [
      '[CollabSphere] Missing required environment variables:',
      ...missing.map((k) => `  - ${k}`),
      '',
      'Copy .env.example to .env.local and fill in your Firebase credentials.',
    ].join('\n')

    console.error(message)

    if (process.env.NODE_ENV === 'development') {
      throw new Error(message)
    }
  }
}

/**
 * Safe accessor for env vars — throws if called with a missing key.
 */
export function getEnv(key: (typeof REQUIRED_ENV_VARS)[number]): string {
  const value = process.env[key]
  if (!value || value.trim() === '') {
    throw new Error(
      `[CollabSphere] Environment variable "${key}" is not set. ` +
      `Copy .env.example to .env.local and fill in your credentials.`
    )
  }
  return value
}
