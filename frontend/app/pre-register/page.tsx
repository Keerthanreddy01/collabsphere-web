"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Check, Copy, Share2, ArrowLeft, Twitter, Linkedin, Sparkles, Smartphone, Award, ChevronDown
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { joinWaitlist, getRecentSignups, getWaitlistCount } from "@/lib/waitlist";
import { Turnstile } from '@marsidev/react-turnstile';
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

const AnimatedLines = () => {
  // Horizontal bars matching the screenshot exactly
  const lines = [
    // Top group
    { top: '22%', left: '35%', width: '120px', height: '4px', delay: 0 },
    { top: '23%', left: '39%', width: '30px', height: '8px', delay: 0.1 },
    { top: '25%', left: '34%', width: '150px', height: '6px', delay: 0.2 },
    { top: '28%', left: '48%', width: '60px', height: '4px', delay: 0.3 },
    { top: '25%', left: '50%', width: '40px', height: '4px', delay: 0.4 },
    
    // Left group
    { top: '27%', left: '10%', width: '80px', height: '6px', delay: 0.1 },
    { top: '30%', left: '22%', width: '110px', height: '6px', delay: 0.5 },
    { top: '45%', left: '9%', width: '18px', height: '8px', delay: 0.2 },
    { top: '48%', left: '9%', width: '35px', height: '6px', delay: 0.4 },
    { top: '48%', left: '27%', width: '70px', height: '4px', delay: 0.3 },
    
    // Right group
    { top: '25%', left: '81%', width: '140px', height: '6px', delay: 0.1 },
    { top: '28%', left: '78%', width: '160px', height: '6px', delay: 0.3 },
    { top: '29%', left: '67%', width: '75px', height: '6px', delay: 0.2 },
    { top: '45%', left: '63%', width: '40px', height: '6px', delay: 0.4 },
    { top: '45%', left: '71%', width: '85px', height: '6px', delay: 0.1 },
    { top: '48%', left: '79%', width: '8px', height: '8px', delay: 0.5 },
    { top: '48%', left: '83%', width: '25px', height: '6px', delay: 0.2 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      <div className="relative w-full max-w-[1400px] h-full">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ 
              delay: line.delay, 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] // Custom ease out
            }}
            style={{
              position: 'absolute',
              top: line.top,
              left: line.left,
              width: line.width,
              height: line.height,
              background: '#ff453a',
              transformOrigin: 'left center',
            }}
          />
        ))}
      </div>
    </div>
  );
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<'idle' | 'solved' | 'error'>('idle');

  const faqs = [
    { q: "What is CollabSphere?", a: "CollabSphere is the ultimate mobile app for builders, allowing you to track, learn, and compete in the decentralized ecosystem." },
    { q: "When will the Beta launch?", a: "We are rolling out exclusive access to our waitlist members soon. Pre-register to secure your spot in line." },
    { q: "What platforms are supported?", a: "We will launch natively on both iOS and Android to give you a seamless mobile experience." },
    { q: "Is it free to join the waitlist?", a: "Yes, joining the waitlist is completely free. Early members will receive priority access and exclusive beta rewards." },
    { q: "How do I move up the waitlist?", a: "Share your unique referral link! Every friend who signs up using your link moves you higher up the queue." }
  ];


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

    // Server-side Turnstile token verification (only if widget loaded)
    if (turnstileToken) {
      try {
        const verifyRes = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setErrorMsg('Verification failed. Please refresh and try again.');
          return;
        }
      } catch {
        // Turnstile verification failed silently - fall through to rate limit protection
      }
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
    <div className="relative z-10 w-full min-h-screen flex flex-col">
      
      {/* Header Navigation */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-50">
        <div className="flex items-center gap-6">
          <a 
            href="/dashboard/home" 
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[10px] uppercase font-syncopate tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </a>
          <div className="font-syncopate text-white text-[12px] font-bold uppercase tracking-widest hidden md:block">
            CollabSphere
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 text-center flex flex-col items-center z-10 flex-1 py-32 justify-center">
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* EARLY ACCESS BADGE */}
              <div className="border border-[#ff453a]/20 text-[#ff453a] bg-transparent px-[14px] py-[6px] text-[10px] font-mono tracking-[0.2em] uppercase mb-[24px] flex items-center justify-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
                EARLY ACCESS
              </div>

              {/* HEADING */}
              <h1 className="font-sans text-white font-[700] tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(44px, 5vw, 64px)', lineHeight: '1' }}>
                CollabSphere is almost ready.
              </h1>
              
              {/* SUBTEXT */}
              <p className="text-[#888888] text-[16px] leading-[1.6] max-w-[420px] mx-auto mb-[40px] font-sans">
                We're inviting engineers to run it on<br/>real code and help shape what ships.
              </p>

              {/* FORM ROW */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center relative z-20">
                <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="bg-transparent border border-[#333333] text-white placeholder-[#555555] px-[20px] py-[14px] text-[13px] font-mono outline-none transition-all focus:border-[#ff453a] w-full sm:w-[320px] rounded-none"
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
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-[#ff453a] text-black font-mono font-[700] px-[28px] py-[15px] text-[11px] tracking-[0.1em] uppercase transition-all flex items-center justify-center w-full sm:w-auto
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-[#ff5544]'}
                    `}
                    style={{ 
                      clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                    }}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      "JOIN WAITLIST"
                    )}
                  </button>
                </div>

                {/* Cloudflare Turnstile Widget - optional, gracefully hidden if blocked */}
                <div className="w-full flex justify-center mt-[16px] min-h-[0px]">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                      setTurnstileStatus('solved');
                    }}
                    onError={() => {
                      setTurnstileToken(null);
                      setTurnstileStatus('error');
                    }}
                    onExpire={() => {
                      setTurnstileToken(null);
                      setTurnstileStatus('idle');
                    }}
                    options={{
                      theme: 'dark',
                      size: 'flexible',
                    }}
                  />
                </div>
                {turnstileStatus === 'error' && (
                  <p className="text-red-500 text-[10px] font-mono mt-1 text-center">Verification failed. Please refresh.</p>
                )}
                {errorMsg && (
                  <p className="text-red-500 text-xs font-bold font-sans mt-3 text-center">{errorMsg}</p>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="text-center w-full max-w-md mx-auto flex flex-col items-center"
            >
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 border-2 border-[#ff453a] flex items-center justify-center mx-auto mb-8"
              >
                <Check className="w-8 h-8 text-[#ff453a] stroke-[2.5]" />
              </motion.div>

              <h2 className="font-sans text-[#ffffff] text-[44px] md:text-[56px] font-[700] tracking-[-0.03em] leading-none mb-4">
                You're on the list.
              </h2>
              
              <p className="text-[#666666] text-[14px] leading-relaxed max-w-xs mx-auto mb-10 font-mono">
                Check your email for confirmation
              </p>

              <div className="border border-[#222222] p-6 text-left w-full bg-[#0f0f0f]">
                <span className="text-[10px] font-bold text-[#555555] uppercase tracking-[0.2em] block mb-5 font-mono text-center">
                  Share to move up the waitlist
                </span>
                
                <div className="flex gap-0 items-center border border-[#2a2a2a] mb-5">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-[12px] text-[#888888] outline-none flex-1 font-mono px-3 py-3 border-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-[#1a1a1a] hover:bg-[#222222] text-[#ffffff] border-l border-[#2a2a2a] transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#ff453a]" /> : <Copy className="w-4 h-4 text-[#888888]" />}
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20pre-registered%20for%20CollabSphere!%20Join%20the%20waitlist%20to%20get%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#ff453a] hover:text-[#ff453a] bg-transparent text-[#666666] py-3 text-[11px] transition-all font-mono font-bold uppercase tracking-widest"
                  >
                    <Twitter className="w-3 h-3 fill-current" />
                    <span>X / Twitter</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#ff453a] hover:text-[#ff453a] bg-transparent text-[#666666] py-3 text-[11px] transition-all font-mono font-bold uppercase tracking-widest"
                  >
                    <Linkedin className="w-3 h-3 fill-current" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="w-full mt-auto pt-20 pb-8 flex flex-col items-center z-20 relative px-6 md:px-12 bg-transparent">
        <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-between items-start border-t border-white/10 pt-16">
          
          <div className="flex flex-col max-w-[300px] mb-12 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <img src="/newlogo.png" alt="Logo" className="w-6 h-6 grayscale opacity-80" />
              <span className="font-syne text-[20px] font-[800] tracking-tight text-[#ffffff] uppercase">
                CollabSphere
              </span>
            </div>
            <p className="text-[#777777] text-[13px] leading-[1.6] font-sans">
              Local-first AI for developers who refuse to be dependent on the cloud.
            </p>
          </div>

          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-5">
              <span className="text-[#555555] text-[11px] font-bold tracking-[0.1em] uppercase">Connect</span>
              <a href="#" className="text-[#999999] text-[13px] hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-[#999999] text-[13px] hover:text-white transition-colors">LinkedIn</a>
            </div>
            <div className="flex flex-col gap-5">
              <span className="text-[#555555] text-[11px] font-bold tracking-[0.1em] uppercase">Legal</span>
              <a href="#" className="text-[#999999] text-[13px] hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 mt-16">
          <span className="text-[#444444] text-[11px] font-mono uppercase tracking-widest">
            © 2026 COLLABSPHERE INC. ALL RIGHTS RESERVED.
          </span>
          <span className="text-[#444444] text-[11px] font-mono uppercase tracking-widest mt-4 md:mt-0 flex items-center gap-2">
            ALL SYSTEMS LOCAL
          </span>
        </div>
      </div>

    </div>
  );
}

export default function PreRegisterPage() {
  return (
    <div 
      className="min-h-screen w-full bg-[#0d0d0d] text-white flex flex-col relative font-sans overflow-y-auto overflow-x-hidden"
    >
      {/* Perspective Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center 0',
          transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-20%)',
          transformOrigin: 'top center',
        }}
      />
      {/* Heavy Noise Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
          mixBlendMode: 'screen'
        }}
      />
      {/* Main Container lines to match screenshot vertical bounding box */}
      <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
        <div className="w-full max-w-[1200px] border-x border-white/5 h-full relative">
          <div className="absolute top-[15%] w-full border-b border-white/5" />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
      `}} />

      <AnimatedLines />

      <Suspense fallback={
        <div className="h-full w-full flex flex-col items-center justify-center relative z-10 min-h-screen">
          <div className="w-10 h-10 border-4 border-[#ef4444]/20 border-t-[#ef4444] rounded-full animate-spin mb-4" />
          <span className="text-sm font-mono text-[#ef4444]/70">Loading Waitlist...</span>
        </div>
      }>
        <WaitlistFormContent />
      </Suspense>
    </div>
  );
}

// Trigger deployment


