"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signInWithEmail } from "@/lib/auth";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Chrome, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAndRedirect = async (uid: string) => {
    try {
      const docRef = doc(db, "builder_profiles", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboarding_completed) {
        router.push("/dashboard/home");
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Error checking onboarding:", err);
      router.push("/onboarding");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        checkAndRedirect(user.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        await checkAndRedirect(data.user.uid);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans antialiased flex items-center justify-center p-4 selection:bg-[#7e85fe] selection:text-white relative overflow-hidden">
      
      {/* Background Gradients & Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(126,133,254,0.12)_0,transparent_50%)] blur-[80px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(254,72,158,0.08)_0,transparent_50%)] blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(126,232,250,0.08)_0,transparent_50%)] blur-[60px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-[24px] rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
          
          {/* Top Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(126,133,254,0.3)] relative"
            >
              <div className="absolute inset-0 bg-black/10 rounded-[18px]" />
              <Sparkles className="w-7 h-7 text-white relative z-10" />
            </motion.div>
            <h1 className="text-[26px] font-bold tracking-tight text-white mb-2">CollabSphere</h1>
            <p className="text-[#A8A8A8] text-[14px] text-center max-w-[280px] leading-relaxed">
              Discover and connect with developers worldwide.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-white/70 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#7e85fe]/50 focus:bg-white/[0.05] rounded-[16px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none transition-all font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[13px] font-semibold text-white/70">Password</label>
                <Link href="/forgot-password" className="text-[12px] font-medium text-[#7e85fe] hover:text-[#7EE8FA] transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#7e85fe]/50 focus:bg-white/[0.05] rounded-[16px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none transition-all font-medium"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] text-black font-bold rounded-[16px] py-3.5 mt-2 hover:opacity-90 transition-all text-[14px] flex items-center justify-center shadow-[0_0_24px_rgba(126,133,254,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="h-[1px] bg-white/[0.08] flex-1" />
            <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Or</span>
            <div className="h-[1px] bg-white/[0.08] flex-1" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 transition-all text-white font-medium rounded-[16px] py-3.5 text-[14px] flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>
        </div>
        
        <p className="text-white/50 text-[13px] text-center mt-8 font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white hover:text-[#7EE8FA] transition-colors ml-1 font-semibold">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
