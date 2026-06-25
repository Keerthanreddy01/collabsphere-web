/**
 * lib/auth-cookie.ts
 *
 * Manages the `cs_uid` routing-signal cookie.
 *
 * ⚠️  ROUTING SIGNAL ONLY — NEVER USE FOR AUTH CHECKS.
 *     This cookie is not signed or verified. It exists solely to let
 *     middleware.ts route authenticated users to the /locked page without
 *     needing to run the Firebase Admin SDK on every request.
 *     Any actual authorization MUST use Firebase Auth (onAuthStateChanged /
 *     auth.currentUser), NOT this cookie.
 */

const COOKIE_NAME = 'cs_uid';
// 7 days in seconds
const MAX_AGE    = 60 * 60 * 24 * 7;

/**
 * Sets the cs_uid cookie. Call this immediately after a successful Firebase
 * sign-in or sign-up, passing the authenticated user's UID.
 */
export function setAuthCookie(uid: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${uid}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

/**
 * Clears the cs_uid cookie. Call this on sign-out.
 */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Reads the cs_uid from document.cookie. Returns null if not set.
 * For use in client components that need to check cookie state synchronously.
 */
export function getAuthCookieUid(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split('=')[1] : null;
}
