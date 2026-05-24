"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signUpWithEmail } from "@/lib/auth";
import Link from "next/link";
import { Github, Chrome, Twitter } from "lucide-react";

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
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#000008] text-white font-sans antialiased overflow-hidden select-none">
      
      {/* CSS Floating and Particle animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes particleUp {
          0% { transform: translateY(100vh) translateX(0px); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-20px) translateX(20px); opacity: 0; }
        }
        
        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.4);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      {/* FULL PAGE BACKGROUND GRADIENT */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #0d0015 0%, #1a0030 20%, #0d001a 40%, #050010 60%, #000008 100%)"
        }}
      />

      {/* Floating Glowing Blobs */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)"
        }}
      />

      {/* Scattered particles with custom delays */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="floating-particle"
            style={{
              left: `${(i * 9) + 4}%`,
              bottom: "-10px",
              animation: `particleUp ${10 + (i * 2)}s linear infinite`,
              animationDelay: `${i * 1.2}s`
            }}
          />
        ))}
      </div>

      {/* MAIN CONTAINER LAYER */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 py-10 min-h-screen flex items-center justify-center md:justify-start">
        
        {/* CENTER-LEFT FLOATING GLASS CARD */}
        <div 
          className="w-full max-w-[460px] rounded-[24px] shadow-2xl relative border border-white/10 md:ml-[5%] animate-float"
          style={{
            background: "rgba(15, 10, 25, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: "40px 44px"
          }}
        >
          {/* Logo top left of card */}
          <div 
            className="flex items-center gap-2 group cursor-pointer mb-8"
            onClick={() => router.push("/")}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-white text-black font-black text-xs transition-transform group-hover:rotate-[30deg]">
              <span className="leading-none select-none font-bold text-xs">*</span>
            </div>
            <span className="text-base font-black tracking-tight text-white font-sans">collabsphere</span>
          </div>

          {/* Heading subtexts */}
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Sign up
          </h2>
          <p className="text-white/50 text-sm mt-2 mb-8 leading-relaxed">
            Create your builder profile and find your dream team.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
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
                className="w-full text-white rounded-xl px-4 py-3.5 outline-none transition duration-200 text-sm placeholder-white/30 border border-white/10 focus:border-purple-500/50 focus:ring-3 focus:ring-purple-500/15"
                style={{
                  background: "rgba(255,255,255,0.05)"
                }}
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
                className="w-full text-white rounded-xl px-4 py-3.5 outline-none transition duration-200 text-sm placeholder-white/30 border border-white/10 focus:border-purple-500/50 focus:ring-3 focus:ring-purple-500/15"
                style={{
                  background: "rgba(255,255,255,0.05)"
                }}
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
                className="w-full text-white rounded-xl px-4 py-3.5 outline-none transition duration-200 text-sm placeholder-white/30 border border-white/10 focus:border-purple-500/50 focus:ring-3 focus:ring-purple-500/15"
                style={{
                  background: "rgba(255,255,255,0.05)"
                }}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 py-1 text-left">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="accent-pink-500 w-4 h-4 rounded border-white/10 bg-white/5 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-white/40 text-xs font-semibold select-none cursor-pointer">
                I Agree To The Terms & Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold rounded-xl py-3.5 w-full hover:bg-[#f0f0f0] transition duration-200 text-sm flex items-center justify-center mt-2 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-white/30 text-[10px] font-extrabold uppercase select-none tracking-widest shrink-0">
              or sign up via
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Social login buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer"
            >
              <Chrome className="w-4 h-4 text-white shrink-0" />
              <span>Google</span>
            </button>
            <button
              onClick={handleGithubSignIn}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer"
            >
              <Github className="w-4 h-4 text-white shrink-0" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Twitter/X authentication coming soon!")}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-white shrink-0" />
              <span>Twitter</span>
            </button>
          </div>

          {/* Switch links */}
          <p className="text-white/40 text-sm text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition ml-0.5">
              Login
            </Link>
          </p>

        </div>

        {/* RIGHT SIDE FLOATING STATS CARD (hidden on mobile) */}
        <div 
          className="hidden md:flex absolute right-[8%] top-1/2 -translate-y-1/2 w-[320px] rounded-[24px] shadow-xl border border-white/10 animate-float flex-col p-6 space-y-6 text-left relative overflow-hidden"
          style={{
            background: "rgba(15, 10, 25, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
            animationDelay: "1s"
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-white text-black font-black text-xs">
              <span className="leading-none font-bold text-xs">*</span>
            </div>
            <span className="text-xs font-black tracking-widest text-white/50 font-sans uppercase">collabsphere stats</span>
          </div>

          {/* Stats details */}
          <div className="space-y-4 py-2 border-y border-white/10">
            <div>
              <span className="text-2xl font-black text-white block">2,400+</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Active Builders</span>
            </div>
            <div>
              <span className="text-2xl font-black text-white block">180+</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Projects Shipped</span>
            </div>
          </div>

          {/* Stack circle avatars */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex -space-x-1.5">
              <img className="h-6.5 w-6.5 rounded-full ring-2 ring-[#0f0a19] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
              <img className="h-6.5 w-6.5 rounded-full ring-2 ring-[#0f0a19] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
              <img className="h-6.5 w-6.5 rounded-full ring-2 ring-[#0f0a19] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
            </div>
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block text-right">JOIN THE MOVEMENT →</span>
          </div>

        </div>

      </div>

    </div>
  );
}
