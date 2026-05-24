"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithGithub, signUpWithEmail } from "@/lib/auth";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAndRedirect(user.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 text-white font-sans antialiased overflow-hidden select-none">
      
      {/* FULL-SCREEN SCENIC SUNSET BACKGROUND IMAGE (Sourced directly from user's loginpage.png) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: "url('/loginpage.png')"
        }}
      />
      {/* Dark overlay to match contrast */}
      <div className="fixed inset-0 z-0 bg-black/20 pointer-events-none" />

      {/* MAIN FLOAT CONTAINER CARD */}
      <div 
        className="relative z-10 w-full max-w-[1000px] min-h-[600px] md:h-[620px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row backdrop-blur-md animate-fade-in"
        style={{
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
        }}
      >
        
        {/* LEFT COLUMN: WHITE GLASSMORPHISM FORM PANEL */}
        <div 
          className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative select-none backdrop-blur-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          
          {/* Logo top left */}
          <div 
            className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-white text-black font-black text-xs transition-transform group-hover:rotate-[30deg]">
              <span className="leading-none select-none font-bold text-xs">*</span>
            </div>
            <span className="text-base font-black tracking-tight text-white font-sans">collabsphere</span>
          </div>

          {/* Form wrapper */}
          <div className="w-full max-w-[340px] mx-auto text-left mt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Sign up
            </h2>
            <p className="text-white/60 text-xs mt-2 mb-8 leading-relaxed">
              Create your builder profile and find your dream team.
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-white/30 focus:border-white/40 focus:ring-3 focus:ring-white/5 outline-none transition duration-200 text-sm"
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
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-white/30 focus:border-white/40 focus:ring-3 focus:ring-white/5 outline-none transition duration-200 text-sm"
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
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 placeholder-white/30 focus:border-white/40 focus:ring-3 focus:ring-white/5 outline-none transition duration-200 text-sm"
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
                <label htmlFor="terms" className="text-white/40 text-[10px] font-semibold select-none cursor-pointer">
                  I Agree To The Terms & Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-semibold rounded-xl py-3.5 w-full hover:bg-[#f0f0f0] transition duration-200 text-sm flex items-center justify-center mt-2 cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

            {/* Social buttons */}
            <div className="flex gap-2.5 mb-6">
              <button
                onClick={handleGoogleSignIn}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-black/20 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer backdrop-blur-md"
              >
                <Chrome className="w-4 h-4 text-white shrink-0" />
                <span>Google</span>
              </button>
              <button
                onClick={handleGithubSignIn}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-black/20 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer backdrop-blur-md"
              >
                <Github className="w-4 h-4 text-white shrink-0" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Twitter/X authentication coming soon!")}
                className="flex-1 flex items-center justify-center gap-2 bg-black/20 border border-white/10 rounded-xl py-3 text-white hover:bg-white/10 transition text-xs font-semibold cursor-pointer backdrop-blur-md"
              >
                <Twitter className="w-4 h-4 text-white shrink-0" />
                <span>Twitter</span>
              </button>
            </div>

            {/* Switch routes */}
            <p className="text-white/40 text-xs text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-pink-500 hover:text-pink-400 font-semibold transition ml-0.5">
                Login
              </Link>
            </p>

          </div>

        </div>

        {/* RIGHT COLUMN: TRANSLUCENT GLASS (Reveals background Sunset computer landscape) */}
        <div 
          className="hidden md:flex w-full md:w-1/2 bg-white/5 backdrop-blur-xl border-l border-white/10 flex-col justify-between p-12 text-left relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.02)"
          }}
        >
          {/* Subtle logo badge top */}
          <div className="flex items-center gap-2 select-none opacity-45">
            <div className="flex items-center justify-center w-5 h-5 rounded-[6px] bg-white text-black font-black text-xs">
              <span className="leading-none font-bold text-xs">*</span>
            </div>
            <span className="text-xs font-black tracking-widest text-white font-sans uppercase">collabsphere portal</span>
          </div>

          {/* Stats indicators layered on glass bottom */}
          <div className="space-y-4 bg-black/25 border border-white/5 rounded-[24px] p-6 max-w-xs shadow-md backdrop-blur-md self-end mt-auto">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="text-left">
                <span className="text-xl font-black text-white block">2,400+</span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider block mt-0.5">Active Builders</span>
              </div>
              <div className="text-left">
                <span className="text-xl font-black text-white block">180+</span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider block mt-0.5">Projects Shipped</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex -space-x-1.5">
                <img className="h-6 w-6 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
                <img className="h-6 w-6 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
                <img className="h-6 w-6 rounded-full ring-2 ring-purple-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" alt="builder" />
              </div>
              <span className="text-[9px] font-extrabold text-[#CDFF3D] uppercase tracking-widest block text-right">JOIN THE MOVEMENT →</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
