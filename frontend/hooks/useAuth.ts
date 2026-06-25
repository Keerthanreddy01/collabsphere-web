"use client"
import { useState, useEffect, useCallback } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { setAuthCookie, clearAuthCookie, getAuthCookieUid } from '@/lib/auth-cookie'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Guard: auth is null when Firebase env vars are missing
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If the user is logged in but the routing cookie isn't set, set it now
        // This ensures active sessions before the waitlist gate was deployed still get routed
        if (!getAuthCookieUid()) {
          setAuthCookie(firebaseUser.uid)
        }
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  /**
   * Securely signs out the user:
   * 1. Calls Firebase signOut (invalidates the session token)
   * 2. Clears local React state
   * 3. Redirects to login page
   *
   * Always use this instead of calling signOut() directly from components.
   */
  const signOutAndClear = useCallback(async () => {
    try {
      await signOut()
      clearAuthCookie()
      setUser(null)
      router.push('/login')
    } catch {
      // Fallback: force redirect even if signOut fails
      router.push('/login')
    }
  }, [router])

  return { user, loading, signOutAndClear }
}
