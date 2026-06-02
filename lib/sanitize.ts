/**
 * lib/sanitize.ts
 * Centralized sanitization utilities to prevent XSS, injection attacks,
 * and unauthorized field overwrites on user-generated content.
 */

// ─── Text Sanitization ────────────────────────────────────────────────────────

/**
 * Strips HTML/script tags, trims whitespace, and enforces max length.
 * Use on all user-generated text before storing in Firestore.
 */
export function sanitizeText(input: unknown, maxLength = 5000): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')            // strip HTML tags
    .replace(/javascript:/gi, '')        // remove javascript: URIs
    .replace(/on\w+\s*=/gi, '')          // strip event handlers (onclick=, etc.)
    .replace(/data:/gi, '')              // strip data: URIs
    .trim()
    .slice(0, maxLength)
}

/**
 * Short-text variant for names, usernames, roles (max 100 chars).
 */
export function sanitizeShortText(input: unknown): string {
  return sanitizeText(input, 100)
}

/**
 * Medium-text variant for bios, descriptions (max 500 chars).
 */
export function sanitizeBio(input: unknown): string {
  return sanitizeText(input, 500)
}

// ─── URL Sanitization ─────────────────────────────────────────────────────────

/**
 * Validates that a URL uses only http or https schemes.
 * Returns empty string for any dangerous or malformed URLs.
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') return ''
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    return trimmed
  } catch {
    return ''
  }
}

// ─── Profile Update Whitelist ─────────────────────────────────────────────────

// Fields that users are NEVER allowed to set via updateProfile()
const PROTECTED_PROFILE_FIELDS = new Set([
  'uid',
  'email',
  'created_at',
  'onboarding_completed',
  'provider',
  'auth_provider',
])

// Fields allowed to be updated, with their sanitizers
const ALLOWED_PROFILE_FIELDS: Record<string, (v: unknown) => unknown> = {
  full_name:        sanitizeShortText,
  display_name:     sanitizeShortText,
  bio:              sanitizeBio,
  location:         sanitizeShortText,
  role:             sanitizeShortText,
  username:         sanitizeShortText,
  avatar_url:       sanitizeUrl,
  website:          sanitizeUrl,
  github_url:       sanitizeUrl,
  twitter_url:      sanitizeUrl,
  availability:     sanitizeShortText,
  stack:            (v) => Array.isArray(v) ? v.map(sanitizeShortText).slice(0, 20) : [],
  updated_at:       (v) => v, // controlled internally, allow pass-through
}

/**
 * Whitelists and sanitizes profile update fields.
 * - Strips any protected fields (uid, email, etc.)
 * - Sanitizes allowed fields through their specific sanitizers
 * - Drops any unknown fields entirely
 *
 * @param updates - Raw updates object from user input
 * @returns Safe, sanitized updates object
 */
export function sanitizeProfileUpdate(updates: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(updates)) {
    // Block protected fields
    if (PROTECTED_PROFILE_FIELDS.has(key)) {
      console.warn(`[Security] Blocked attempt to update protected field: "${key}"`)
      continue
    }

    // Only allow whitelisted fields
    const sanitizer = ALLOWED_PROFILE_FIELDS[key]
    if (!sanitizer) {
      console.warn(`[Security] Dropped unknown profile field: "${key}"`)
      continue
    }

    safe[key] = sanitizer(value)
  }

  return safe
}

// ─── Post Content Sanitization ────────────────────────────────────────────────

/**
 * Sanitizes a post object before writing to Firestore.
 * Also removes PII (author_email) that should not be stored in post documents.
 */
export function sanitizePost(post: Record<string, unknown>): Record<string, unknown> {
  const { author_email: _removed, ...rest } = post as any // remove PII
  return {
    ...rest,
    content:         sanitizeText(rest.content, 2000),
    author_name:     sanitizeShortText(rest.author_name),
    author_username: sanitizeShortText(rest.author_username),
    author_avatar:   sanitizeUrl(rest.author_avatar),
    stack_tags:      Array.isArray(rest.stack_tags)
                       ? rest.stack_tags.map((t: unknown) => sanitizeShortText(t)).slice(0, 10)
                       : [],
  }
}
