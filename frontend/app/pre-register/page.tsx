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

    // Turnstile verification check
    if (!turnstileToken) {
      setErrorMsg('Please complete the human verification below.');
      return;
    }

    // Server-side Turnstile token verification
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
      setErrorMsg('Verification error. Please try again.');
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
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
      
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

      <div className="w-full max-w-2xl mx-auto px-6 text-center flex flex-col items-center justify-center z-10">
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
              <div className="border border-[#ef4444] text-[#ef4444] bg-transparent px-[16px] py-[6px] rounded-[4px] text-[11px] font-bold tracking-[0.15em] uppercase mb-[32px] flex items-center justify-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                EARLY ACCESS
              </div>

              {/* HEADING */}
              <h1 className="font-syne text-[#ffffff] font-[800] leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
                CollabSphere is almost ready.
              </h1>
              
              {/* SUBTEXT */}
              <p className="text-[#888888] text-[16px] leading-[1.6] max-w-[480px] mx-auto mb-[40px] font-sans">
                We're inviting developers to build, collaborate and ship together. Join the waitlist to secure your spot.
              </p>

              {/* FORM ROW */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center relative z-20">
                <div className="flex flex-col sm:flex-row w-full justify-center max-w-[500px]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="bg-[#111111] border border-[#2a2a2a] text-[#ffffff] placeholder-[#555555] px-[20px] py-[14px] text-[15px] outline-none transition-all focus:border-[#ef4444] w-full sm:w-[340px] rounded-[4px] sm:rounded-[4px_0_0_4px] sm:border-r-0 mb-3 sm:mb-0"
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
                    disabled={loading || !turnstileToken}
                    className={`bg-[#ef4444] text-[#ffffff] font-[700] px-[28px] py-[14px] text-[13px] tracking-[0.08em] uppercase transition-all flex items-center justify-center rounded-[4px] sm:rounded-[0_4px_4px_0] border-none w-full sm:w-auto
                      ${!turnstileToken ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-[#dc2626] sm:hover:-skew-x-2'}
                    `}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "JOIN WAITLIST"
                    )}
                  </button>
                </div>

                {/* Cloudflare Turnstile Widget */}
                <div className="w-full flex justify-center mt-[16px]">
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#10b981]"
              >
                <Check className="w-12 h-12 stroke-[3]" />
              </motion.div>

              <h2 className="font-syne text-[#ffffff] text-[40px] md:text-[48px] font-extrabold tracking-tighter leading-none mb-4">
                You're in! 🎉
              </h2>
              
              <p className="text-[#888888] text-[16px] leading-relaxed max-w-xs mx-auto mb-8 font-sans">
                Check your email for confirmation
              </p>

              <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 text-left w-full">
                <span className="text-[12px] font-bold text-[#888888] uppercase tracking-[0.1em] block mb-4 font-sans text-center">
                  Share to move up the waitlist
                </span>
                
                <div className="flex gap-2 items-center bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-2 pl-4">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="bg-transparent text-sm text-[#ffffff] outline-none flex-1 font-mono select-all border-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2.5 bg-[#111111] hover:bg-[#222222] text-[#ffffff] rounded border border-[#2a2a2a] transition-colors cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=I%20just%20pre-registered%20for%20CollabSphere!%20Join%20the%20waitlist%20to%20get%20early%20access%3A%20${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#ffffff] hover:text-[#ffffff] bg-transparent text-[#888888] rounded py-3 text-[12px] transition-all text-decoration-none font-sans font-bold uppercase"
                  >
                    <Twitter className="w-4 h-4 fill-current" />
                    <span>X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] hover:border-[#ffffff] hover:text-[#ffffff] bg-transparent text-[#888888] rounded py-3 text-[12px] transition-all text-decoration-none font-sans font-bold uppercase"
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
      className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col relative font-sans select-none overflow-y-auto overflow-x-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Syncopate:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
      `}} />

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


