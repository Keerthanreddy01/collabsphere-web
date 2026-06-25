import { auth } from './firebase'
import {
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'
import { logSecurityEvent } from './security-logger'
import { setAuthCookie } from './auth-cookie'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
// Always prompt the user to select an account (prevents silent auto-signin)
googleProvider.setCustomParameters({ prompt: 'select_account' })
const githubProvider = new GithubAuthProvider()

// ─── Error Mapping ────────────────────────────────────────────────────────────

/**
 * Maps Firebase Auth error codes to safe, user-friendly messages.
 * NEVER expose raw Firebase error codes or messages to the UI —
 * they can leak implementation details and aid attackers.
 */
export function mapAuthError(code: string): string {
  const errorMap: Record<string, string> = {
    // Sign-in errors
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/user-disabled':            'This account has been disabled. Contact support if you think this is a mistake.',
    'auth/user-not-found':           'No account found with that email address.',
    'auth/wrong-password':           'Incorrect password. Please try again.',
    'auth/invalid-credential':       'Incorrect email or password.',
    'auth/too-many-requests':        'Too many failed attempts. Please wait a moment and try again.',
    'auth/network-request-failed':   'Network error. Please check your internet connection.',
    // Sign-up errors
    'auth/email-already-in-use':     'An account with this email already exists. Try signing in instead.',
    'auth/weak-password':            'Password is too weak. Use at least 8 characters, a number, and a symbol.',
    'auth/operation-not-allowed':    'This sign-in method is not enabled. Contact support.',
    // OAuth errors
    'auth/popup-blocked':            'Sign-in popup was blocked. Please allow popups for this site.',
    'auth/popup-closed-by-user':     'Sign-in was cancelled.',
    'auth/cancelled-popup-request':  'Sign-in was cancelled.',
    'auth/account-exists-with-different-credential':
      'An account already exists with the same email. Try a different sign-in method.',
    // Generic fallback
    'auth/internal-error':           'An unexpected error occurred. Please try again.',
  }
  return errorMap[code] ?? 'Something went wrong. Please try again.'
}

// ─── Password Strength ────────────────────────────────────────────────────────

export interface PasswordStrength {
  score: number      // 0–4
  label: string      // 'Weak' | 'Fair' | 'Good' | 'Strong'
  color: string      // Tailwind color class
  errors: string[]   // List of unmet requirements
}

/**
 * Evaluates password strength against security requirements.
 * Returns a score 0–4 and specific error messages for unmet criteria.
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const errors: string[] = []

  if (password.length < 8)         errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password))     errors.push('One uppercase letter')
  if (!/[0-9]/.test(password))     errors.push('One number')
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('One special character (!@#$%...)')

  const score = 4 - errors.length

  const labelMap: Record<number, string> = { 0: 'Very Weak', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' }
  const colorMap: Record<number, string> = {
    0: '#ef4444',  // red
    1: '#f97316',  // orange
    2: '#eab308',  // yellow
    3: '#22c55e',  // green
    4: '#10b981',  // emerald
  }

  return {
    score,
    label: labelMap[score] ?? 'Very Weak',
    color: colorMap[score] ?? '#ef4444',
    errors,
  }
}

// ─── Auth Functions ───────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const result = await signInWithPopup(
      auth, 
      googleProvider,
      browserPopupRedirectResolver
    )
    if (result.user) setAuthCookie(result.user.uid)
    return { user: result.user, error: null }
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider)
      return { user: null, error: null }
    }
    return { user: null, error: { message: mapAuthError(error.code) } }
  }
}

export async function signInWithGithub() {
  try {
    await signInWithRedirect(auth, githubProvider)
    return { user: null, error: null }
  } catch (error: any) {
    return { user: null, error: { message: mapAuthError(error.code) } }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    // Log successful sign-in for audit trail
    await logSecurityEvent({ uid: result.user.uid, event: 'sign_in_success', method: 'email' })
    if (result.user) setAuthCookie(result.user.uid)
    return { data: { user: result.user }, error: null }
  } catch (error: any) {
    // Log failed attempt (no uid — user is unauthenticated)
    await logSecurityEvent({ event: 'sign_in_failure', method: 'email', metadata: { code: error.code } })
    // Map to friendly message — never expose raw Firebase error
    return { data: null, error: { message: mapAuthError(error.code), code: error.code } }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await logSecurityEvent({ uid: result.user.uid, event: 'sign_up_success', method: 'email' })
    if (result.user) setAuthCookie(result.user.uid)
    return { data: { user: result.user }, error: null }
  } catch (error: any) {
    return { data: null, error: { message: mapAuthError(error.code), code: error.code } }
  }
}

export async function signOut() {
  try {
    const uid = auth.currentUser?.uid
    await firebaseSignOut(auth)
    if (uid) await logSecurityEvent({ uid, event: 'sign_out' })
    return { error: null }
  } catch (error: any) {
    return { error: { message: 'Failed to sign out. Please try again.' } }
  }
}

export async function getUser() {
  const user = auth.currentUser
  return { user, error: null }
}

export async function getSession() {
  const user = auth.currentUser
  return { session: user ? { user } : null, error: null }
}
