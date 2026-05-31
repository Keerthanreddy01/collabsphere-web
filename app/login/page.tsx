"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signInWithEmail } from "@/lib/auth";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Chrome, Sparkles } from "lucide-react";

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
        router.push("/dashboard/welcome");
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
    <div className="min-h-screen w-full bg-black text-white font-sans antialiased flex flex-col items-center justify-center p-4 selection:bg-[#7e85fe] selection:text-white">

      {/* Top Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] flex items-center justify-center mb-3">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CollabSphere</h1>
      </div>

      {/* Decorative Cards (like Nuvio) */}
      <div className="flex justify-center items-end gap-4 mb-16 h-[140px]">
        {/* Left Card */}
        <div className="w-[110px] h-[120px] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden transform -rotate-6 translate-x-4 translate-y-2 shadow-2xl z-0">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" alt="art" className="w-full h-full object-cover opacity-80" />
        </div>
        {/* Center Card */}
        <div className="w-[130px] h-[140px] rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden shadow-2xl z-10 scale-105">
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop" alt="art" className="w-full h-full object-cover" />
        </div>
        {/* Right Card */}
        <div className="w-[110px] h-[120px] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden transform rotate-6 -translate-x-4 translate-y-2 shadow-2xl z-0">
          <img src="https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=200&auto=format&fit=crop" alt="art" className="w-full h-full object-cover opacity-80" />
        </div>
      </div>

      <div className="w-full max-w-[340px] text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          Welcome to CollabSphere
        </h2>
        <p className="text-[#888888] text-sm mb-8 leading-relaxed">
          Your platform to discover all developers.<br />Sign in with email to get started.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-[#111111] border border-white/5 focus:border-[#7e85fe] rounded-[10px] px-4 py-3.5 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#111111] border border-white/5 focus:border-[#7e85fe] rounded-[10px] px-4 py-3.5 text-sm text-white placeholder-[#666666] outline-none transition-all font-medium"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7EE8FA] via-[#7e85fe] to-[#fe489e] text-black font-bold rounded-[10px] py-3.5 mt-2 hover:opacity-90 transition-all text-sm flex items-center justify-center active:scale-[0.98]"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[#666666] text-xs font-medium">Or</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full bg-[#111111] border border-white/5 hover:bg-[#1a1a1a] transition-all text-white font-medium rounded-[10px] py-3.5 text-sm flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-[#666666] text-xs text-center mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-white hover:text-[#7EE8FA] transition ml-1 font-semibold">
            Sign up
          </Link>
        </p>
      </div>

    </div>
  );
}
