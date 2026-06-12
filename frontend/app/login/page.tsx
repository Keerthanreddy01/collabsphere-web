"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithEmail, signInWithGithub } from "@/lib/auth";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sparkles, AlertCircle, Clock, Mail, Lock, Eye, EyeOff, Heart } from "lucide-react";
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <div className="min-h-screen w-full bg-[#09090b] text-white font-sans antialiased flex flex-col justify-between items-center selection:bg-[#7e85fe] selection:text-white relative overflow-hidden">

      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle top spotlight */}
        <div className="absolute top-0 inset-x-0 h-[400px] bg-[radial-gradient(circle_at_top,rgba(126,133,254,0.06)_0%,transparent_70%)]" />
        
        {/* Blurred Organic Bottom Waves (As seen in reference screenshot) */}
        <div className="absolute bottom-[-220px] left-[10%] w-[600px] h-[450px] bg-[#fe489e]/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-220px] right-[10%] w-[600px] h-[450px] bg-[#7e85fe]/12 rounded-full blur-[120px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
        
        {/* Cursor tracking spotlight aura */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-300 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(126,133,254,0.08), transparent 80%)`
          }}
        />
      </div>

      {/* Top Spacer / Logo Area */}
      <div className="flex flex-col items-center pt-16 pb-8 relative z-10 w-full">
        {/* Heart Logo Gradient Container */}
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-tr from-[#fe489e] to-[#7e85fe] flex items-center justify-center shadow-[0_8px_30px_rgba(254,72,158,0.25)] mb-5 relative">
          <Heart className="w-5.5 h-5.5 text-white fill-white" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
          Yooo, welcome back!
        </h1>
        <p className="text-white/40 text-[13px] font-medium">
          First time here?{" "}
          <Link href="/signup" className="text-[#7e85fe] hover:text-white transition-colors ml-1 font-semibold underline decoration-[#7e85fe]/30 underline-offset-4">
            Sign up for free
          </Link>
        </p>
      </div>

      {/* Main Centered Content */}
      <div className="flex-1 w-full max-w-[340px] flex flex-col justify-center py-6 relative z-10">
        
        {/* Error / Lockout Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`mb-6 p-4 rounded-xl text-[13px] font-medium text-center flex items-center justify-center gap-2 shadow-sm border ${
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
              <span>
                {isLocked
                  ? `Account locked. Try again in ${countdown}s`
                  : error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleEmailSignIn} className="space-y-5 flex flex-col">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-[11px] font-bold text-white/40 ml-1 tracking-wider uppercase">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLocked}
              className="w-full bg-[#121214]/60 border border-white/[0.06] focus:border-[#7e85fe]/40 focus:bg-[#121214]/80 rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/25 outline-none transition-all font-medium disabled:opacity-40"
            />
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label htmlFor="login-password" className="text-[11px] font-bold text-white/40 tracking-wider uppercase">
                Password
              </label>
              <Link href="/forgot-password" className="text-[12px] font-semibold text-[#7e85fe] hover:text-[#7EE8FA] transition-colors">
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
                placeholder="Enter your password"
                disabled={isLocked}
                className="w-full bg-[#121214]/60 border border-white/[0.06] focus:border-[#7e85fe]/40 focus:bg-[#121214]/80 rounded-xl pl-4 pr-11 py-3 text-[14px] text-white placeholder-white/25 outline-none transition-all font-medium disabled:opacity-40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 p-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* Centered pill submit button */}
          <motion.button
            whileHover={{ scale: isLocked ? 1 : 1.02 }}
            whileTap={{ scale: isLocked ? 1 : 0.98 }}
            type="submit"
            disabled={loading || isLocked}
            className="mx-auto px-6 py-2.5 bg-white/90 hover:bg-white text-black font-semibold rounded-full text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-black/20 cursor-pointer disabled:opacity-40 mt-3"
          >
            {loading ? (
              <div className="h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isLocked ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                Locked
              </>
            ) : (
              <>
                Sign in
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-7">
          <div className="h-[1px] bg-white/[0.04] flex-1" />
          <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest shrink-0">Or continue with</span>
          <div className="h-[1px] bg-white/[0.04] flex-1" />
        </div>

        {/* Social Authentication Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all text-white/70 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Google
          </button>
          <button
            onClick={handleGithubSignIn}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all text-white/70 hover:text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            GitHub
          </button>
        </div>

        {/* Secondary Login Routes */}
        <div className="flex flex-col gap-2 mt-5">
          <button
            type="button"
            className="w-full bg-transparent hover:bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] text-white/40 hover:text-white/60 transition-all font-semibold rounded-xl py-2.5 text-[12px] cursor-pointer"
          >
            Sign in using magic link
          </button>
          <button
            type="button"
            className="w-full bg-transparent hover:bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.06] text-white/40 hover:text-white/60 transition-all font-semibold rounded-xl py-2.5 text-[12px] cursor-pointer"
          >
            Single sign-on (SSO)
          </button>
        </div>
      </div>

      {/* Footer / Indicator dots at very bottom */}
      <div className="w-full relative z-10 pb-8 flex flex-col items-center">
        {/* Page Indicators */}
        <div className="flex gap-1.5 justify-center items-center py-4 select-none mb-4">
          <span className="w-5 h-1.5 rounded-full bg-white/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Legal text */}
        <p className="text-white/20 text-[10px] text-center leading-relaxed max-w-[280px]">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-white/40 hover:text-white transition-colors underline decoration-white/10 underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-white/40 hover:text-white transition-colors underline decoration-white/10 underline-offset-2">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}
