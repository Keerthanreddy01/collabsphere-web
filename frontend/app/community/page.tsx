"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Users, Zap, Globe, MessageSquare } from "lucide-react";

const stats = [
  { value: "2,400+", label: "Active Builders" },
  { value: "180+", label: "Projects Shipped" },
  { value: "94%", label: "Collaboration Rate" },
  { value: "48h", label: "Avg. Team Formed" },
];

const pillars = [
  {
    icon: Users,
    title: "Build Together",
    description: "Find co-founders and teammates who match your technical DNA. No recruiters, no middlemen — just builders finding builders.",
  },
  {
    icon: Zap,
    title: "Ship Fast",
    description: "The best communities don't just talk — they ship. Post your progress daily and let the community fuel your momentum.",
  },
  {
    icon: Globe,
    title: "Build in Public",
    description: "Transparency builds trust. Share your journey, your failures, your wins. The community amplifies what's real.",
  },
  {
    icon: MessageSquare,
    title: "Real Feedback",
    description: "Get blunt, honest, technical feedback from people who've been there. No fluff, just signal.",
  },
];

const recentActivity = [
  { user: "MAX_P", action: "shipped WASM runtime v2.1", time: "2m ago", type: "SHIP" },
  { user: "AMELIA_W", action: "posted new UI system for review", time: "8m ago", type: "BUILD" },
  { user: "S. RIVERS", action: "formed team with LIAM_T", time: "15m ago", type: "TEAM" },
  { user: "SYNE_K", action: "hit $10k MRR — building in public", time: "1h ago", type: "WIN" },
  { user: "MIA_KH", action: "launched design sprint", time: "2h ago", type: "BUILD" },
  { user: "NOVA_R", action: "posted Rust crate — 340 stars", time: "3h ago", type: "SHIP" },
];

const typeColors: Record<string, string> = {
  SHIP: "text-[#eca8d6] bg-[#eca8d6]/10",
  BUILD: "text-blue-400 bg-blue-400/10",
  TEAM: "text-green-400 bg-green-400/10",
  WIN: "text-yellow-400 bg-yellow-400/10",
};

export default function CommunityPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    const interval = setInterval(() => setTick((p) => p + 1), 3000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white dark:bg-black/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-3 text-black dark:text-white/60 hover:text-black dark:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">COLLABSPHERE™</span>
        </Link>
        <span className="text-xs font-mono text-black dark:text-white/30 tracking-widest">COMMUNITY</span>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eca8d6]/10 text-[#eca8d6] text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eca8d6] animate-pulse" />
            LIVE · {2400 + tick} builders online
          </div>
          <h1 className="text-7xl md:text-[10rem] lg:text-[160px] font-display tracking-tight leading-[0.85] mb-8">
            WHERE
            <br />
            <span className="text-black dark:text-white/20">BUILDERS LIVE.</span>
          </h1>
          <p className="text-xl text-black dark:text-white/50 max-w-lg leading-relaxed">
            Not a social network. Not a job board. A place where real builders ship real things — together.
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className={`px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto transition-all duration-1000 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="p-8 border border-gray-200 dark:border-white/10 bg-white/[0.02]"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="text-5xl font-display block mb-2">{stat.value}</span>
              <span className="text-sm text-black dark:text-white/40 font-mono">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <span className="text-xs font-mono text-black dark:text-white/30 tracking-widest mb-12 block">HOW WE BUILD</span>
        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`p-10 border border-gray-200 dark:border-white/10 bg-white/[0.02] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="w-10 h-10 border border-gray-200 dark:border-white/20 flex items-center justify-center mb-6">
                <pillar.icon className="w-5 h-5 text-black dark:text-white/60" />
              </div>
              <h3 className="text-2xl font-display mb-3">{pillar.title}</h3>
              <p className="text-black dark:text-white/50 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live feed */}
      <section className="px-6 lg:px-12 pb-40 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs font-mono text-black dark:text-white/30 tracking-widest">LIVE FEED</span>
          <span className="w-2 h-2 rounded-full bg-[#eca8d6] animate-pulse" />
        </div>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-5 border border-gray-200 dark:border-white/10 hover:border-gray-200 dark:border-white/30 transition-all duration-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              style={{ transitionDelay: `${i * 80 + 400}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-mono px-2 py-0.5 ${typeColors[item.type]}`}>{item.type}</span>
                <span className="text-sm font-mono text-black dark:text-white/60">{item.user}</span>
                <span className="text-sm text-black dark:text-white/40">{item.action}</span>
              </div>
              <span className="text-xs text-black dark:text-white/20 font-mono shrink-0">{item.time}</span>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-white dark:text-black text-sm font-mono hover:bg-white/90 transition-all duration-300 group"
          >
            JOIN THE COMMUNITY
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
