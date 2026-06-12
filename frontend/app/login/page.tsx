"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithEmail, signInWithGithub } from "@/lib/auth";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertCircle, Clock, Eye, EyeOff, Menu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Rate-limiting constants ──────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Brute-force / rate-limit state
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // ── Countdown timer when locked ────────────────────────────────────────────
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setCountdown(0);
        clearInterval(interval);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const checkAndRedirect = useCallback(async (uid: string) => {
    try {
      const docRef = doc(db, "builder_profiles", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push("/dashboard/home");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      router.push("/onboarding");
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) checkAndRedirect(user.uid);
    });
    return () => unsubscribe();
  }, [checkAndRedirect]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await signInWithEmail(email, password);
      if (authError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_SECONDS * 1000;
          setLockedUntil(until);
          setError(
            `Too many failed attempts. Please wait ${LOCKOUT_SECONDS} seconds before trying again.`
          );
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setError(
            `${authError.message}${remaining <= 2 ? ` (${remaining} attempt${remaining === 1 ? "" : "s"} left before lockout)` : ""}`
          );
        }
      } else if (data?.user) {
        setAttempts(0);
        await checkAndRedirect(data.user.uid);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleGithubSignIn = async () => {
    setError(null);
    try {
      await signInWithGithub();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with GitHub.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased flex items-center justify-center p-4 md:p-8 selection:bg-white/30 relative overflow-hidden">

      {/* Giant Spotlight with Chromatic Aberration Border */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[680px] md:h-[680px] rounded-full z-0 pointer-events-none select-none hidden md:flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 via-green-500 via-cyan-400 to-blue-600 blur-[16px] opacity-65" />
        <div className="absolute inset-2.5 rounded-full bg-[#0a0a0c] shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]" />
      </div>

      {/* Main Container Frame */}
      <div className="w-full max-w-[1000px] bg-[#0c0c0e] border border-white/10 rounded-2xl flex flex-col relative z-10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)]">
        
        {/* Header Bar */}
        <header className="flex h-14 border-b border-white/10 items-stretch select-none text-xs font-semibold tracking-wider">
          <div className="w-[30%] md:w-[22%] border-r border-white/10 flex items-center px-6 text-white font-bold tracking-tight">
            CollabSphere.
          </div>
          <nav className="flex-grow hidden md:flex items-center justify-center text-white">
            <span className="font-semibold tracking-wider text-white">Login</span>
          </nav>
          <div className="w-[25%] md:w-[15%] border-l border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer">
            <Menu className="w-4.5 h-4.5" />
          </div>
        </header>

        {/* Form & Content Body Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[450px]">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-8 md:p-12 border-r-0 lg:border-r border-white/10 flex flex-col justify-center gap-8">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7e85fe] font-bold">Access Panel</span>
              <h2 className="text-2xl font-medium tracking-tight text-white">Sign In</h2>
            </div>

            {/* Error / Lockout Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`p-3 rounded-xl text-[12px] font-medium text-center flex items-center justify-center gap-2 border ${
                    isLocked
                      ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {isLocked ? (
                    <Clock className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{isLocked ? `Locked. Wait ${countdown}s` : error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailSignIn} className="space-y-6">
              
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  Your Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={isLocked}
                  className="bg-transparent border-b border-white/10 focus:border-white/80 outline-none py-3 text-sm text-white placeholder-white/20 transition-all font-medium w-full"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Your Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] text-white/40 hover:text-white transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLocked}
                    className="bg-transparent border-b border-white/10 focus:border-white/80 outline-none py-3 pr-10 text-sm text-white placeholder-white/20 transition-all font-medium w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 text-white/30 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button with chromatic aberration outline glow */}
              <div className="relative group">
                <div className="absolute -inset-[1.5px] bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-blue-500 rounded-lg blur-[2px] opacity-40 group-hover:opacity-75 transition-opacity" />
                <motion.button
                  whileHover={{ scale: isLocked ? 1 : 1.01 }}
                  whileTap={{ scale: isLocked ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading || isLocked}
                  className="relative w-full bg-white text-black font-extrabold uppercase tracking-widest text-[11px] py-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer border-none shadow-md"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Sign in to CollabSphere"
                  )}
                </motion.button>
              </div>
            </form>

            {/* Social Oauth & Secondary sign ups */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-white/10 flex-grow" />
                <span className="text-[9px] uppercase tracking-widest text-white/20">Or Continue With</span>
                <div className="h-[1px] bg-white/10 flex-grow" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all text-white/70 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={handleGithubSignIn}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all text-white/70 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-1 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-[12px] text-white/40 text-center mt-2">
                First time here?{" "}
                <Link href="/signup" className="text-white hover:underline ml-1 font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column: Hero Typography */}
          <div className="lg:col-span-5 p-8 md:p-12 relative flex flex-col justify-between items-center text-center overflow-hidden bg-black/20 select-none">
            
            {/* Pebble Outlined Shape */}
            <div 
              className="absolute w-[280px] h-[280px] border border-white/5 pointer-events-none z-0 animate-pulse duration-5000" 
              style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
            />

            <div className="my-auto relative z-10 flex flex-col items-center gap-6">
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter relative flex flex-col leading-none">
                <span className="text-left font-sans uppercase">Collab</span>
                <span className="h-[2px] w-24 bg-gradient-to-r from-cyan-400 via-white to-pink-500 my-4 self-center lg:self-end" />
                <span className="text-right font-sans uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
                  Sphere
                </span>
              </h1>
              
              <p className="text-white/50 text-xs leading-relaxed max-w-[260px] font-medium">
                Discover and connect with developers worldwide. Build teams, showcase your projects, and win hackathons.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <footer className="flex h-14 border-t border-white/10 items-center justify-center select-none text-[9px] font-bold tracking-widest text-white/30 uppercase px-6">
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-white/20">Send Us E-mail</span>
            <span className="text-white/50 lowercase tracking-normal">collabsphereapp@gmail.com</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
