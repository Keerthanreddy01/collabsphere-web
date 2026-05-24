"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signUpWithEmail } from "@/lib/auth";
import Link from "next/link";
import { Github, Chrome, Apple } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Success! Please check your email to confirm your registration.");
        setTimeout(() => {
          router.push("/login");
        }, 5000);
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

  const handleGithubSignIn = async () => {
    setError(null);
    try {
      await signInWithGithub();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with GitHub");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#0a0a0a] text-white font-sans antialiased overflow-x-hidden">
      
      {/* CSS Floating and Bouncing animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
      `}</style>

      {/* LEFT COLUMN: FORM PANEL */}
      <div className="h-screen flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-20 py-10 bg-[#0a0a0a] relative select-none">
        
        {/* Logo Top Left */}
        <div 
          className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 group cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="flex items-center justify-center w-5.5 h-5.5 rounded-[7px] bg-white text-black font-black text-xs transition-transform group-hover:rotate-[30deg]">
            <span className="leading-none select-none font-bold text-sm">*</span>
          </div>
          <span className="text-base font-black tracking-tight text-white font-sans">collabsphere</span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto text-left mt-10">
          
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Sign up
          </h2>
          <p className="text-gray-400 text-sm mt-2 mb-8 leading-relaxed">
            Create your builder profile and find your dream team.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
              {success}
            </div>
          )}

          {/* Email / Password Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-gray-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 outline-none transition duration-200 text-sm"
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-gray-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 outline-none transition duration-200 text-sm"
              />
            </div>

            <div>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-gray-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 outline-none transition duration-200 text-sm"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 py-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="accent-pink-500 w-4 h-4 rounded border-white/10 bg-white/5 cursor-pointer"
              />
              <label htmlFor="terms" className="text-gray-400 text-xs font-semibold select-none cursor-pointer">
                I Agree To The Terms & Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold rounded-xl py-3.5 w-full hover:bg-gray-100 transition duration-200 text-sm flex items-center justify-center mt-2 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider with lines */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-gray-500 text-xs font-bold uppercase select-none tracking-wider shrink-0">
              or sign up via
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Social Row (3 in a row) */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-bold cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-white shrink-0" />
              <span>Google</span>
            </button>
            <button
              onClick={handleGithubSignIn}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-bold cursor-pointer"
            >
              <Github className="w-4 h-4 text-white shrink-0" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Apple login coming soon!")}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-bold cursor-pointer"
            >
              <Apple className="w-4 h-4 text-white shrink-0" />
              <span>Apple</span>
            </button>
          </div>

          {/* Bottom link routes */}
          <p className="text-gray-500 text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-500 hover:text-pink-400 font-semibold transition ml-0.5">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT COLUMN: VISUAL PANEL (hidden below md) */}
      <div className="hidden md:block h-screen overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #1a0520 60%, #0a0a0a 100%)"
        }}
      >
        
        {/* Floating background glowing orbs */}
        <div 
          className="absolute top-1/4 right-10 w-96 h-96 rounded-full blur-[80px] pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)"
          }}
        />

        <div 
          className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full blur-[90px] pointer-events-none z-0 animate-float-slow"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)"
          }}
        />

        {/* Centered Large Glowing Orb */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[40px] pointer-events-none z-0 animate-float"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)"
          }}
        />

        {/* Floating particles (CSS glowing dots scattered) */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
          <div className="absolute top-20 left-1/4 w-1.5 h-1.5 rounded-full bg-pink-400 blur-[1px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-purple-400 blur-[1px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-300 blur-[1px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-pink-300 blur-[1px] animate-pulse" />
        </div>

        {/* Floating Glassmorphic Computer Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-sm px-6 animate-float">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[36px] p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
            
            {/* Header stars logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5.5 h-5.5 rounded-[7px] bg-white text-black font-black text-xs">
                <span className="leading-none font-bold text-sm">*</span>
              </div>
              <span className="text-base font-black tracking-tight text-white font-sans uppercase">collabsphere</span>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-2 gap-4 py-1.5 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div>
                <span className="text-[9px] font-extrabold text-purple-300 block uppercase tracking-wider">Active Community</span>
                <span className="text-xl font-black text-white block mt-0.5">2,400+</span>
                <span className="text-[8px] font-bold text-gray-400">Verified Builders</span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-pink-300 block uppercase tracking-wider">Shipped Projects</span>
                <span className="text-xl font-black text-white block mt-0.5">180+</span>
                <span className="text-[8px] font-bold text-gray-400">In Production</span>
              </div>
            </div>

            {/* Avatar Stack */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex -space-x-2">
                <img className="h-7 w-7 rounded-full ring-2 ring-[#121318] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
                <img className="h-7 w-7 rounded-full ring-2 ring-[#121318] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
                <img className="h-7 w-7 rounded-full ring-2 ring-[#121318] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
              </div>
              <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-widest block text-right">Join the movement →</span>
            </div>

          </div>
        </div>

        {/* Gradient dark fade to black at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />

      </div>

    </div>
  );
}
