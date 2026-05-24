"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithGithub, signInWithEmail } from "@/lib/auth"
import Link from "next/link"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkAndRedirect = async (uid: string) => {
    try {
      const docRef = doc(db, 'builder_profiles', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push('/dashboard/home')
      } else {
        router.push('/onboarding')
      }
    } catch (err) {
      console.error("Error checking onboarding:", err)
      router.push('/onboarding')
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAndRedirect(user.uid)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await signInWithEmail(email, password)
      if (error) {
        setError(error.message)
      } else if (data?.user) {
        await checkAndRedirect(data.user.uid)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }


  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google")
    }
  }

  const handleGithubSignIn = async () => {
    setError(null)
    try {
      await signInWithGithub()
    } catch (err: any) {
      setError(err.message || "Failed to sign in with GitHub")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md px-6 z-10">
        <div className="bg-[#0d0d11]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-display">
              WELCOME BACK
            </h2>
            <p className="text-sm text-zinc-400">
              Sign in to Collabsphere
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {/* Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub Login Button */}
            <button
              onClick={handleGithubSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 border border-zinc-800 rounded-xl transition duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-zinc-500 text-xs font-bold uppercase select-none">or</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          {/* Email / Password Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-400 uppercase mb-2 pl-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#09090b] border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:border-zinc-700 outline-none transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-400 uppercase mb-2 pl-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09090b] border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:border-zinc-700 outline-none transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-pink-500 hover:text-pink-400 font-semibold transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
