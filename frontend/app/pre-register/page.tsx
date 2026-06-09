"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, Smartphone, Award
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { joinWaitlist, getRecentSignups, getWaitlistCount } from "@/lib/waitlist";
import SideRays from "@/components/ui/SideRays";

function WaitlistFormContent() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"android" | "ios" | "both">("both");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState(0);
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Live total count from Firestore
  const [totalCount, setTotalCount] = useState(247);
  // Animated count up state
  const [animatedCount, setAnimatedCount] = useState(0);
  // Recent 3 signups
  const [recentSignups, setRecentSignups] = useState<string[]>(["Keerthan", "Alex", "Purbledx"]);

  // Listen to Firestore waitlist updates for real-time counters
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, "app_waitlist"), (snapshot) => {
      // Update count
      setTotalCount(snapshot.size > 0 ? snapshot.size : 247);
    });
    return () => unsub();
  }, []);

  // Animate count up on count change
  useEffect(() => {
    let start = animatedCount;
    const end = totalCount;
    if (start === end) return;

    const duration = 1200; // 1.2s
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      setAnimatedCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [totalCount]);

  // Fetch recent signups on mount
  useEffect(() => {
    getRecentSignups().then(names => {
      if (names && names.length > 0) setRecentSignups(names);
    });
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await joinWaitlist(email, platform, referredBy);
      if (res.success) {
        setPosition(res.position);
        setRefCode(res.refCode);
        setSuccess(true);
        
        // Trigger confetti celebration
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#06b6d4"]
        });
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/pre-register?ref=${refCode}`
    : `collabsphereweb.vercel.app/pre-register?ref=${refCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Milestone Calculations
  const milestone = Math.ceil((animatedCount + 1) / 500) * 500 || 1500;
  const progressPercent = Math.min(100, Math.floor((animatedCount / milestone) * 100)) || 82;

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* 1. App logo/back header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <a 
          href="/dashboard/home" 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-sm">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>CollabSphere <span className="text-emerald-400">Mobile</span></span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div 
        className="w-full bg-[#ffffff]/[0.02] border border-white/[0.08] rounded-[24px] p-8 md:p-10 backdrop-blur-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Subtle interior glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 rounded-full px-4 py-1 text-xs font-mono font-bold tracking-wide mb-6 border border-emerald-500/20 animate-pulse">
                <span>🚀 Soon on Play Store & App Store</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
                Build Together, <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Anywhere.
                </span>
              </h1>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                CollabSphere is coming to mobile. Pre-register to get early access, exclusive beta features, and jump the launch queue.
              </p>

              {/* Live Progress Bar Card */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span>🔥</span> 
                    <span>{animatedCount.toLocaleString()} builders waiting</span>
                  </span>
                  <span className="text-emerald-400">{progressPercent}%</span>
                </div>
                {/* Track */}
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-1.5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className="text-[10px] text-white/40 flex items-center justify-between">
                  <span>Milestone Progress</span>
                  <span>Next unlock at {milestone.toLocaleString()} 🎯</span>
                </div>
              </div>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-colors"
                  />
                </div>

                {/* Platform selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 pl-1">Target Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["android", "ios", "both"] as const).map((p) => {
                      const isActive = platform === p;
                      const label = p === "android" ? "📱 Android" : p === "ios" ? "🍎 iOS" : "Both";
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                            isActive 
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-xs pl-1 font-semibold">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold rounded-xl py-3.5 mt-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Pre-Register Now</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center"
            >
              {/* Checkmark Animation */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-lg shadow-emerald-500/10"
              >
                <Check className="w-8 h-8 stroke-[3]" />
              </motion.div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                You're #{position.toLocaleString()} in line! 🎉
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                We'll email you at <span className="text-emerald-300 font-bold">{email}</span> when the mobile beta launches.
              </p>

              {/* Referral section */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 text-left mb-6">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2 font-mono flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Move up the line — share your link:
                </span>
                
                <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-xl p-2 pl-3">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-xs text-white/70 outline-none flex-1 font-mono select-all border-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-colors border-none cursor-pointer shrink-0"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex gap-2.5 mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20pre-registered%20for%20CollabSphere%20mobile!%20Join%20the%20waitlist%20to%20get%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full py-2 text-xs font-bold transition-all text-decoration-none"
                  >
                    <Twitter className="w-3.5 h-3.5 fill-current" />
                    <span>Share on X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full py-2 text-xs font-bold transition-all text-decoration-none"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Social Proof Ticker */}
        <div className="border-t border-white/[0.05] mt-6 pt-5">
          <p className="text-white/30 text-[11px] text-center tracking-normal leading-normal font-medium flex items-center justify-center gap-1">
            <span>🧑</span>
            {recentSignups.map((name, i) => (
              <span key={i}>
                <span className="text-white/50 hover:text-emerald-300 transition-colors font-semibold">{name}</span>
                {i < recentSignups.length - 1 ? <span className="text-white/25 mx-1">·</span> : null}
              </span>
            ))}
            <span className="text-white/25 ml-1">just joined</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* SideRays Background Effect */}
      <SideRays
        speed={2.5}
        rayColor1="#10b981"
        rayColor2="#3b82f6"
        intensity={2}
        spread={2}
        origin="top-right"
        tilt={0}
        saturation={1.5}
        blend={0.75}
        falloff={1.6}
        opacity={0.6}
      />

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <span className="text-sm font-mono text-emerald-300">Loading CollabSphere Waitlist...</span>
        </div>
      }>
        <WaitlistFormContent />
      </Suspense>
    </div>
  );
}
