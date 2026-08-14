"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Zap,
  Bell,
  Users,
  CheckCircle2,
  ArrowUpRight,
  Wifi,
  Battery,
  Signal,
  FolderGit2,
  Radio,
  QrCode,
  Sparkles
} from "lucide-react";

export function UniqueEffectsSection() {
  const [activeTab, setActiveTab] = useState<"matches" | "projects" | "rooms">("matches");
  const [qrOpen, setQrOpen] = useState(false);

  // Auto-switch tabs inside mobile mockup every 4.5 seconds
  useEffect(() => {
    const tabs: Array<"matches" | "projects" | "rooms"> = ["matches", "projects", "rooms"];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIdx];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="mobile-app" className="relative py-28 lg:py-36 bg-[#040404] text-white overflow-hidden border-t border-b border-white/10">
      {/* Editorial Background Gradients & Ambient Glow */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#E83526]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#E83526]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: EDITORIAL COPY & DOWNLOAD CTAS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#E83526]/30 bg-[#E83526]/10 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-[#E83526] animate-pulse" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#E83526] font-semibold">
                MOBILE EXPERIENCE · ALWAYS SYNCED
              </span>
            </div>

            {/* Editorial Headline */}
            <h2 className="text-5xl md:text-7xl lg:text-[82px] font-display tracking-tight leading-[0.92] text-white uppercase mb-8">
              YOUR WORK.<br />
              <span className="font-serif-italic text-[#E83526] font-normal lowercase italic text-6xl md:text-8xl lg:text-[96px] leading-[0.85] tracking-normal block my-1">
                your network.
              </span>
              EVERYWHERE.
            </h2>

            {/* Supporting Copy */}
            <p className="text-lg md:text-xl text-white/70 font-sans leading-relaxed max-w-xl mb-10">
              Discover verified co-founders, match with elite builders, manage pull requests, and hop into live audio rooms — all right from your pocket with the native CollabSphere mobile app.
            </p>

            {/* Value Props / Feature Pills */}
            <div className="grid sm:grid-cols-2 gap-4 w-full max-w-lg mb-12">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-[#E83526]/20 flex items-center justify-center text-[#E83526] shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Instant Co-Founder Match</h4>
                  <p className="text-xs text-white/50">AI matched by stack & availability</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-[#E83526]/20 flex items-center justify-center text-[#E83526] shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Push Audits & Invites</h4>
                  <p className="text-xs text-white/50">Never miss a collab request</p>
                </div>
              </div>
            </div>

            {/* CTAs Section: App Store & Google Play */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full max-w-lg">
              {/* App Store Button */}
              <a
                href="#download-ios"
                onClick={(e) => { e.preventDefault(); setQrOpen(true); }}
                className="flex-1 group relative flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-white text-black hover:bg-[#F4F1EA] transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Apple Logo SVG */}
                <svg className="w-7 h-7 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.37-6.08-3.38-2.76-7.25-7.4-11.62-13.94-6.42-9.59-11.55-20.15-15.39-31.67-3.84-11.53-5.76-22.75-5.76-33.66 0-14.37 3.59-26.24 10.77-35.6 7.18-9.37 16.27-14.15 27.27-14.35 4.69 0 9.87 1.18 15.54 3.54 5.67 2.36 9.61 3.54 11.83 3.54 1.9 0 5.96-1.23 12.18-3.69 6.22-2.45 11.39-3.56 15.52-3.34 8.02.49 15.42 2.99 22.2 7.5 6.78 4.51 11.66 10.61 14.64 18.3-13.06 7.9-19.46 18.66-19.2 32.28.25 10.6 4.34 19.53 12.27 26.79 7.93 7.25 17.38 11.33 28.35 12.24-2.58 7.74-6.02 15.2-10.33 22.38zM119.22 31.84c0-7.07 2.61-13.84 7.83-20.31 5.22-6.47 11.82-10.42 19.8-11.85.25 1.14.38 2.1.38 2.88 0 7.23-2.67 14.16-8.01 20.79-5.34 6.63-11.97 10.51-19.89 11.64-.09-.76-.11-1.81-.11-3.15z" />
                </svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">Download on the</span>
                  <span className="text-base font-bold font-sans">App Store</span>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#download-android"
                onClick={(e) => { e.preventDefault(); setQrOpen(true); }}
                className="flex-1 group relative flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-white transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Google Play Logo SVG */}
                <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.42V3.234c0-.53.21-1.04.609-1.42zM15.206 13.414l2.586 2.586-12.029 6.945 9.443-9.531zM17.792 10.828l3.14 1.812c.74.427.74 1.127 0 1.554l-3.14 1.812-2.3-2.3 2.3-2.374zM5.763 1.241l12.029 6.945-2.586 2.586-9.443-9.531z" />
                </svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-70 text-white/70">GET IT ON</span>
                  <span className="text-base font-bold font-sans">Google Play</span>
                </div>
              </a>

              {/* Scan QR Code Trigger Button */}
              <button
                type="button"
                onClick={() => setQrOpen(!qrOpen)}
                className="p-4 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 flex items-center justify-center shrink-0"
                title="Scan QR Code to install"
              >
                <QrCode className="w-6 h-6 text-[#E83526]" />
              </button>
            </div>

            {/* Interactive QR Code Modal/Drop-in */}
            <AnimatePresence>
              {qrOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="w-full max-w-lg overflow-hidden"
                >
                  <div className="p-6 rounded-2xl border border-[#E83526]/30 bg-[#0F0F0F] flex items-center gap-6 shadow-2xl">
                    <div className="w-24 h-24 p-2 bg-white rounded-xl shrink-0 flex items-center justify-center">
                      {/* Generative QR Pattern SVG */}
                      <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="5" y="5" width="30" height="30" rx="4" fill="black" />
                        <rect x="11" y="11" width="18" height="18" fill="white" />
                        <rect x="15" y="15" width="10" height="10" fill="black" />

                        <rect x="65" y="5" width="30" height="30" rx="4" fill="black" />
                        <rect x="71" y="11" width="18" height="18" fill="white" />
                        <rect x="75" y="15" width="10" height="10" fill="black" />

                        <rect x="5" y="65" width="30" height="30" rx="4" fill="black" />
                        <rect x="11" y="71" width="18" height="18" fill="white" />
                        <rect x="15" y="75" width="10" height="10" fill="black" />

                        <rect x="45" y="10" width="10" height="10" fill="black" />
                        <rect x="45" y="45" width="10" height="10" fill="black" />
                        <rect x="65" y="45" width="10" height="10" fill="black" />
                        <rect x="45" y="65" width="15" height="15" fill="black" />
                        <rect x="70" y="70" width="15" height="15" fill="black" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                        <span>Scan to Install</span>
                        <Sparkles className="w-4 h-4 text-[#E83526]" />
                      </h4>
                      <p className="text-xs text-white/60 leading-relaxed mb-2">
                        Point your camera at the QR code to instantly launch CollabSphere Mobile on iOS or Android.
                      </p>
                      <span className="text-[11px] font-mono text-[#E83526] font-semibold">
                        ✓ Version 2.4.0 Live Build
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>


          {/* RIGHT COLUMN: REALISTIC SMARTPHONE MOCKUP & FLOATING CARDS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center items-center py-6"
          >

            {/* Ambient Backlight Glow behind Phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E83526]/30 via-transparent to-[#E83526]/20 blur-[90px] rounded-full pointer-events-none" />

            {/* FLOATING CARD 1: Instant Match Notification (Top Right) */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 md:right-0 z-30 p-4 rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl max-w-[210px] hidden sm:block"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-bold text-white">New Match!</span>
                    <span className="text-[9px] font-mono text-white/40">Just now</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-tight">
                    Sarah (Ex-Stripe) accepted your collab request.
                  </p>
                </div>
              </div>
            </motion.div>


            {/* FLOATING CARD 2: Active Collab Push Alert (Bottom Left) */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-4 md:-left-8 z-30 p-4 rounded-2xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl max-w-[220px] hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E83526]/20 border border-[#E83526]/40 flex items-center justify-center text-[#E83526] shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E83526]">LIVE VOICE ROOM</span>
                  <p className="text-xs font-bold text-white truncate">Late Night Hackers</p>
                  <p className="text-[10px] text-white/50">14 builders tuning in</p>
                </div>
              </div>
            </motion.div>


            {/* REALISTIC MODERN SMARTPHONE FRAME */}
            <motion.div
              whileHover={{ rotateY: -4, rotateX: 3, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-20 w-[300px] sm:w-[330px] h-[610px] sm:h-[660px] rounded-[48px] p-3.5 bg-gradient-to-b from-[#2A2A2A] via-[#141414] to-[#080808] border-[3px] border-white/20 shadow-[0_25px_90px_-15px_rgba(232,53,38,0.3)] perspective-1000"
            >
              {/* Phone Inner Frame / Bezel */}
              <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden border border-white/10 flex flex-col justify-between">
                
                {/* Screen Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-40" />

                {/* Top Status Bar & Dynamic Island Notch */}
                <div className="relative z-30 pt-3 px-6 pb-2 flex items-center justify-between text-white/90 text-xs font-mono">
                  <span>09:41</span>
                  {/* Dynamic Island Notch */}
                  <div className="w-24 h-4 bg-black rounded-full border border-white/10 flex items-center justify-end px-2 gap-1.5 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-blue-500/60" />
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* APP HEADER INSIDE PHONE */}
                <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-md z-20">
                  <div className="flex items-center gap-2">
                    <img src="/newlogo.png" alt="CollabSphere Logo" className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-display text-sm tracking-tight text-white">COLLABSPHERE</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">1.4k online</span>
                  </div>
                </div>

                {/* APP MAIN VIEW DISPLAY AREA */}
                <div className="flex-1 p-4 overflow-hidden relative z-10 flex flex-col justify-start">
                  <AnimatePresence mode="wait">
                    
                    {/* TAB 1: MATCHES VIEW */}
                    {activeTab === "matches" && (
                      <motion.div
                        key="matches"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3.5"
                      >
                        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#121212] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E83526]/20 text-[#E83526] text-[10px] font-mono font-bold">
                              ⚡ 98% MATCH
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">Open to Collab</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E83526] to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              SC
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">Sarah Chen</h4>
                              <p className="text-xs text-white/50">Senior Systems Architect</p>
                            </div>
                          </div>

                          <p className="text-xs text-white/70 leading-normal line-clamp-2">
                            "Building high-throughput WebGL engines. Looking for a rust backend co-founder!"
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/80">Rust</span>
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/80">Next.js</span>
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/80">Solana</span>
                          </div>

                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-[#E83526] text-white font-bold text-xs hover:bg-[#E83526]/90 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                          >
                            <span>Connect Now</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Mini Activity Feed */}
                        <div className="p-3 rounded-xl border border-white/5 bg-[#0A0A0A] flex items-center justify-between text-xs">
                          <span className="text-white/60">Collab Requests</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold text-[10px]">
                            3 Pending
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 2: PROJECTS VIEW */}
                    {activeTab === "projects" && (
                      <motion.div
                        key="projects"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3.5"
                      >
                        <div className="p-3.5 rounded-2xl border border-white/10 bg-[#121212] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <FolderGit2 className="w-3.5 h-3.5 text-[#E83526]" />
                              WiseEarth Engine
                            </span>
                            <span className="text-[10px] font-mono text-white/50">85% Shipped</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#E83526] to-amber-500 w-[85%]" />
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-white/70 space-y-1">
                            <div className="flex justify-between font-mono text-[10px] text-white/50">
                              <span>LATEST COMMIT</span>
                              <span>2m ago</span>
                            </div>
                            <p className="font-mono text-white truncate">PR #142: Added WebGL shader pipeline</p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500 border border-black text-[9px] flex items-center justify-center font-bold">AK</div>
                              <div className="w-6 h-6 rounded-full bg-purple-500 border border-black text-[9px] flex items-center justify-center font-bold">MR</div>
                              <div className="w-6 h-6 rounded-full bg-emerald-500 border border-black text-[9px] flex items-center justify-center font-bold">+9</div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold">12 Contributors</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: ROOMS VIEW */}
                    {activeTab === "rooms" && (
                      <motion.div
                        key="rooms"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3.5"
                      >
                        <div className="p-3.5 rounded-2xl border border-[#E83526]/30 bg-[#140A0A] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full bg-[#E83526] text-white text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              LIVE NOW
                            </span>
                            <span className="text-[10px] font-mono text-white/60">Voice Room</span>
                          </div>

                          <h4 className="text-sm font-bold text-white">🎙️ Late Night Shipping Session</h4>
                          <p className="text-xs text-white/60">Discussing Next.js 16 Turbo & WebGL performance.</p>

                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#E83526] flex items-center justify-center text-white text-xs font-bold">
                                CS
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block leading-tight">Host: Keerthan</span>
                                <span className="text-[9px] text-emerald-400 font-mono">Speaking...</span>
                              </div>
                            </div>
                            {/* Soundwave animation effect */}
                            <div className="flex items-center gap-0.5 h-4">
                              <span className="w-1 h-full bg-[#E83526] animate-pulse" />
                              <span className="w-1 h-2/3 bg-[#E83526] animate-pulse delay-75" />
                              <span className="w-1 h-full bg-[#E83526] animate-pulse delay-150" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

                {/* APP BOTTOM NAVIGATION TAB BAR */}
                <div className="p-2.5 border-t border-white/10 bg-black/90 backdrop-blur-md grid grid-cols-3 gap-1 z-30">
                  <button
                    type="button"
                    onClick={() => setActiveTab("matches")}
                    className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                      activeTab === "matches" ? "bg-[#E83526] text-white shadow-md" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Matches</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                      activeTab === "projects" ? "bg-[#E83526] text-white shadow-md" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Projects</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("rooms")}
                    className={`py-2 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all ${
                      activeTab === "rooms" ? "bg-[#E83526] text-white shadow-md" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Rooms</span>
                  </button>
                </div>

                {/* Bottom Bar Home Indicator */}
                <div className="pb-1 pt-0.5 flex justify-center bg-black">
                  <div className="w-28 h-1 rounded-full bg-white/30" />
                </div>

              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
