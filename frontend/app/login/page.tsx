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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[680px] md:h-[680px] rounded-full z-0 pointer-events-none select-none flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 via-green-500 via-cyan-400 to-blue-600 blur-[12px] opacity-80" />
        <div className="absolute inset-2.5 rounded-full bg-white shadow-[inset_0_0_80px_rgba(0,0,0,0.15)]" />
      </div>

      {/* Main Container Frame */}
      <div className="w-full max-w-[1000px] bg-[#0c0c0e]/95 border border-white/10 rounded-2xl flex flex-col relative z-10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        
        {/* Header Bar */}
        <header className="flex h-14 border-b border-white/10 items-stretch select-none text-xs font-semibold tracking-wider">
          <div className="w-[30%] md:w-[22%] border-r border-white/10 flex items-center px-6 text-white font-bold tracking-tight">
            CollabSphere.
          </div>
          <nav className="flex-grow hidden md:flex items-center justify-center gap-10 text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/pre-register" className="hover:text-white transition-colors">Waitlist</Link>
            <Link href="/hackathons" className="hover:text-white transition-colors">Hackathons</Link>
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
                  className="bg-transparent border-b border-white/15 focus:border-white outline-none py-3 text-sm text-white placeholder-white/20 transition-all font-medium w-full"
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
                    className="bg-transparent border-b border-white/15 focus:border-white outline-none py-3 pr-10 text-sm text-white placeholder-white/20 transition-all font-medium w-full"
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
              <div className="relative group pt-4">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 to-blue-500 rounded-lg blur-[2px] opacity-75 group-hover:opacity-100 transition-opacity" />
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
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Google
                </button>
                <button
                  onClick={handleGithubSignIn}
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
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
              className="absolute w-[240px] h-[300px] border border-white/10 pointer-events-none z-0" 
              style={{ borderRadius: "42% 58% 70% 30% / 45% 45% 55% 55%" }}
            />

            <div className="my-auto relative z-10 flex flex-col items-center gap-6">
              <h1 
                className="text-5xl md:text-7xl font-serif text-white tracking-tight relative"
                style={{
                  textShadow: "-1.5px -1.5px 0 rgba(0,255,255,0.6), 1.5px 1.5px 0 rgba(255,0,255,0.6)"
                }}
              >
                Collab
                <span className="block text-right text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
                  ——— Sphere
                </span>
              </h1>
              
              <p className="text-white/60 text-xs leading-relaxed max-w-[240px]">
                Discover and connect with developers worldwide. Build teams, showcase your projects, and win hackathons.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <footer className="flex h-14 border-t border-white/10 items-stretch select-none text-[9px] font-bold tracking-widest text-white/30 uppercase">
          <div className="w-[30%] md:w-[22%] border-r border-white/10 flex flex-col justify-center px-6 gap-1">
            <span className="text-[7px] text-white/20">Call Us</span>
            <span className="text-white/50">+909-009-9009</span>
          </div>
          <div className="flex-grow hidden md:flex flex-col justify-center px-10 gap-1 text-center">
            <span className="text-[7px] text-white/20">Here's Our Address, Come And We'll Give You Cookies</span>
            <span className="text-white/50">Jameson Sparle St. 25/A, Los Angeles, US</span>
          </div>
          <div className="w-[35%] md:w-[25%] border-l border-white/10 flex flex-col justify-center px-6 gap-1 text-right">
            <span className="text-[7px] text-white/20">Send Us E-mail</span>
            <span className="text-white/50 lowercase">support@collabsphere.io</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
