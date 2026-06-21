"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, Smartphone, Award
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist, getRecentSignups, getWaitlistCount } from "@/lib/waitlist";
import SideRays from "@/components/ui/SideRays";
import emailjs from "@emailjs/browser";

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

const sendConfirmationEmail = async (
  email: string, 
  platform: string
) => {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: email,
        user_name: email.split("@")[0],
        platform: platform,
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
  } catch (error) {
    console.error("Email confirmation failed");
  }
};

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
  const [honeypot, setHoneypot] = useState("");

  // Live total count from Firestore
  const [totalCount, setTotalCount] = useState(0);
  const [recentSignups, setRecentSignups] = useState<string[]>([]);

  // Listen to Firestore waitlist updates for real-time counters
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(collection(db, "app_waitlist"), (snapshot) => {
      // Update count
      setTotalCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  // Fetch recent signups on mount
  useEffect(() => {
    getRecentSignups().then(names => {
      if (names && names.length > 0) setRecentSignups(names);
    });
  }, [success]);

  const checkDuplicate = async (emailToCheck: string) => {
    if (!db) return false;
    const q = query(
      collection(db, 'app_waitlist'),
      where('email', '==', emailToCheck.toLowerCase().trim())
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    // Client-side honeypot check
    if (honeypot) {
      console.log('Bot detected');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    // Server-side rate limit + validation via API route
    try {
      const apiRes = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, platform, honeypot }),
      });

      if (!apiRes.ok) {
        const errData = await apiRes.json();
        setErrorMsg(errData.error || 'Something went wrong.');
        return;
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      return;
    }

    // Duplicate check against Firestore
    const alreadyExists = await checkDuplicate(email);
    if (alreadyExists) {
      setErrorMsg('This email is already registered!');
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await joinWaitlist(email, platform, referredBy);
      if (res.success) {
        // 2. Send confirmation email
        await sendConfirmationEmail(email, platform);

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

  return (
    <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
      
      {/* LEFT PANEL - Typography and Stats */}
      <div className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 relative h-full py-6 md:py-8 overflow-y-auto no-scrollbar">
        {/* Header inside left panel */}
        <div className="flex items-center gap-6 mb-6 md:mb-8 w-full z-20 shrink-0">
          <a 
            href="/dashboard/home" 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] uppercase font-syncopate tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </a>
          <div className="font-syncopate text-white text-[12px] font-bold uppercase tracking-widest">
            CollabSphere
          </div>
        </div>

        <div className="flex flex-col my-auto pb-8 md:pb-0 z-10 w-full">
          <div className="font-syncopate text-[#D4F842] text-[10px] md:text-[12px] uppercase tracking-[0.3em] font-bold mb-4">
            Official Mobile Beta
          </div>

          <h1 className="font-syne text-white text-[36px] md:text-[46px] lg:text-[56px] font-bold leading-[0.9] tracking-tighter mb-3">
            The app is <br/> coming.
          </h1>
          
          <p className="font-sans text-white/50 text-[13px] md:text-[15px] leading-relaxed max-w-md font-medium">
            We're launching the next generation of builder collaboration tools on iOS and Android. Pre-register to secure your spot.
          </p>

          {/* HIGH-TECH PREMIUM WAITLIST METRIC BOARD - BRUTALIST PIXEL STYLE */}
          <div className="mt-4 lg:mt-6 w-full max-w-md">
            <div className="relative overflow-hidden border-[4px] border-black bg-[#D4F842] p-4 lg:p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Pixel art corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 bg-black" />
              <div className="absolute top-0 right-0 w-8 h-4 bg-black" />
              <div className="absolute top-4 right-4 w-4 h-4 bg-black" />
              <div className="absolute bottom-0 left-0 w-8 h-4 bg-black" />
              <div className="absolute bottom-4 left-4 w-4 h-4 bg-black" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-black" />
              
              <div className="flex flex-col gap-3 relative z-10">
                {/* Header: Label and Active Indicator */}
                <div className="flex items-center justify-between border-b-[3px] border-black pb-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-40"></span>
                      <span className="relative inline-flex h-3 w-3 bg-black"></span>
                    </span>
                    <span className="text-[12px] font-syncopate font-bold uppercase tracking-[0.1em] text-black">
                      NETWORK STATUS
                    </span>
                  </div>
                  
                  <span className="px-2 py-1 bg-black text-[#D4F842] text-[10px] font-mono font-bold tracking-wider uppercase">
                    v1.0-BETA
                  </span>
                </div>

                {/* Counter & Avatar Pile Grid */}
                <div className="flex items-center justify-between gap-2 py-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-syncopate font-black text-4xl lg:text-5xl tracking-tighter text-black">
                        {totalCount.toLocaleString()}
                      </span>
                      <span className="text-black text-sm font-bold font-syncopate uppercase tracking-wider">
                        Joined
                      </span>
                    </div>
                    <span className="text-[12px] font-mono text-black font-bold mt-1 uppercase">
                      [ SECURING EARLY ACCESS ]
                    </span>
                  </div>

                  {/* Overlapping Avatar Group - Brutalist */}
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-flex h-8 w-8 items-center justify-center bg-white border-[3px] border-black text-[10px] font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      KR
                    </div>
                    <div className="inline-flex h-8 w-8 items-center justify-center bg-white border-[3px] border-black text-[10px] font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      ST
                    </div>
                    <div className="inline-flex h-8 w-8 items-center justify-center bg-white border-[3px] border-black text-[10px] font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      JD
                    </div>
                    <div className="inline-flex h-8 w-8 items-center justify-center bg-black border-[3px] border-black text-[10px] font-black text-[#D4F842] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      +{totalCount}
                    </div>
                  </div>
                </div>

                {/* Progress bar representing Beta phase spots */}
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-[10px] font-mono font-black tracking-wide text-black uppercase">
                    <span>CAPACITY FILL</span>
                    <span>{Math.min(100, Math.max(0, Math.round((totalCount / 150) * 100)))}%</span>
                  </div>
                  <div className="h-4 w-full bg-transparent border-[3px] border-black p-[2px]">
                    <div 
                      className="h-full bg-black transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, Math.max(0, (totalCount / 150) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Terminal-like system log representing activity */}
                <div className="border-[3px] border-black bg-white p-2 lg:p-3 font-mono text-[10px] leading-relaxed text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2">
                  <div className="flex items-center gap-2 font-black mb-1 border-b-[2px] border-black/10 pb-1">
                    <span className="w-2 h-2 bg-black animate-pulse" />
                    <span>SYS_FEED // LIVE</span>
                  </div>
                  {recentSignups.length > 0 ? (
                    <div className="flex items-center justify-between text-black font-bold">
                      <span>&gt; user_joined: <span className="bg-black text-[#D4F842] px-1">{recentSignups[0]}</span></span>
                      <span className="text-[10px] uppercase">JUST NOW</span>
                    </div>
                  ) : (
                    <span className="text-black/50 font-bold uppercase">&gt; AWAITING NEXT CONNECTION...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Arch Form */}
      <div className="w-full md:w-[380px] lg:w-[450px] xl:w-[600px] bg-[#D4F842] rounded-t-[60px] md:rounded-t-none md:rounded-l-[80px] min-h-[70vh] md:h-full relative flex flex-col justify-center px-8 md:px-10 lg:px-16 xl:px-20 shadow-[-30px_0_80px_rgba(212,248,66,0.15)] py-12 md:py-0 md:overflow-y-auto no-scrollbar">
        {/* Toggle graphic */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 bg-[#063CB9] w-12 h-6 rounded-full p-[3px] flex items-center justify-end shadow-inner">
          <div className="bg-white w-[18px] h-[18px] rounded-full" />
        </div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="font-syncopate text-black text-[28px] font-bold tracking-tight uppercase mb-8 leading-tight">
                Join The<br/>Waitlist
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-white/40 border-2 border-black/10 focus:border-[#063CB9] focus:bg-white rounded-xl px-5 py-4 text-black placeholder-black/40 outline-none transition-all font-syne font-bold text-sm tracking-wide"
                  />
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-syncopate font-bold text-black/50 uppercase tracking-widest block w-full">Select Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["android", "ios", "both"] as const).map((p) => {
                      const isActive = platform === p;
                      const label = p === "android" ? "Android" : p === "ios" ? "iOS" : "Both";
                      
                      const AppleIcon = () => (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-[14px] h-[14px] fill-current shrink-0"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                      );
                      const PlayIcon = () => (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-[14px] h-[14px] fill-current shrink-0"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                      );

                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPlatform(p)}
                          className={`py-3.5 px-2 rounded-xl text-[11px] font-syncopate font-bold uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                            isActive 
                              ? "bg-[#063CB9] text-white shadow-md shadow-[#063CB9]/30 scale-105" 
                              : "bg-black/5 text-black/50 hover:bg-black/10"
                          }`}
                        >
                          {p === "ios" && <AppleIcon />}
                          {p === "android" && <PlayIcon />}
                          {p === "both" && (
                            <div className="flex items-center gap-0.5 opacity-80">
                              <AppleIcon />
                              <PlayIcon />
                            </div>
                          )}
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-red-500 text-xs font-bold font-sans">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#063CB9] hover:bg-[#052b82] text-white font-syncopate font-bold rounded-xl py-4 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#063CB9]/20 flex items-center justify-center gap-2 cursor-pointer border-none uppercase tracking-widest text-[13px]"
                >
                  {loading ? (
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Pre-Register Now</span>
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
              className="text-center w-full"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 bg-[#063CB9]/10 border-[4px] border-[#063CB9] rounded-full flex items-center justify-center mx-auto mb-8 text-[#063CB9] shadow-2xl shadow-[#063CB9]/20"
              >
                <Check className="w-12 h-12 stroke-[3]" />
              </motion.div>

              <h2 className="font-syne text-[#063CB9] text-[64px] font-extrabold tracking-tighter leading-none mb-4">
                #{position.toLocaleString()}
              </h2>
              <div className="font-syncopate text-black text-[20px] font-bold tracking-tight uppercase mb-8">
                You're in line
              </div>
              
              <p className="text-black/60 text-sm leading-relaxed max-w-xs mx-auto mb-10 font-sans font-medium">
                We'll email you at <br/><span className="text-[#063CB9] font-bold text-base block mt-2">{email}</span><br/>when the beta launches.
              </p>

              <div className="bg-black/5 border border-black/10 rounded-2xl p-6 text-left w-full">
                <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest block mb-4 font-syncopate text-center">
                  Move up the line — share
                </span>
                
                <div className="flex gap-2 items-center bg-white/50 border border-black/10 rounded-xl p-2 pl-4">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-sm text-black outline-none flex-1 font-mono select-all border-none font-bold"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-[#063CB9]/10 hover:bg-[#063CB9] text-[#063CB9] hover:text-white rounded-lg transition-colors border-none cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20pre-registered%20for%20CollabSphere%20mobile!%20Join%20the%20waitlist%20to%20get%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-black/10 hover:border-[#063CB9] bg-transparent text-black rounded-xl py-3 text-xs font-bold transition-all text-decoration-none font-syncopate uppercase tracking-widest"
                  >
                    <Twitter className="w-4 h-4 fill-current" />
                    <span>X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-black/10 hover:border-[#063CB9] bg-transparent text-black rounded-xl py-3 text-xs font-bold transition-all text-decoration-none font-syncopate uppercase tracking-widest"
                  >
                    <Linkedin className="w-4 h-4 fill-current" />
                    <span>In</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div 
      className="min-h-screen md:h-screen w-full bg-black text-white flex flex-col relative md:overflow-hidden font-sans select-none"
      style={{
        backgroundImage: `repeating-radial-gradient(circle at 50% 100%, transparent 0, transparent 8px, rgba(255,255,255,0.06) 8px, rgba(255,255,255,0.06) 9px)`
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
      `}} />



      <Suspense fallback={
        <div className="h-full w-full flex flex-col items-center justify-center relative z-10">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <span className="text-sm font-mono text-emerald-300">Loading Waitlist...</span>
        </div>
      }>
        <WaitlistFormContent />
      </Suspense>
    </div>
  );
}

// Trigger deployment


