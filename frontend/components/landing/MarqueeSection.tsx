"use client";

import React from "react";
import { MessageSquare, Flame, Eye } from "lucide-react";

interface CardData {
  avatar: string;
  username: string;
  badge: "COLLAB" | "UPDATE" | "MILESTONE";
  text: string;
  comments: number;
  boosts: number;
  views: number;
  rotate: string;
}

const topRowCards: CardData[] = [
  {
    avatar: "AR",
    username: "@alex_r",
    badge: "COLLAB",
    text: "looking for a Rust developer for a web3 indexer",
    comments: 12,
    boosts: 34,
    views: 245,
    rotate: "rotate-[5deg] translate-y-3",
  },
  {
    avatar: "SA",
    username: "@sara_a",
    badge: "UPDATE",
    text: "just shipped v2 of the workspace collab canvas",
    comments: 8,
    boosts: 19,
    views: 180,
    rotate: "rotate-[-3deg] -translate-y-2",
  },
  {
    avatar: "MC",
    username: "@mike_codes",
    badge: "MILESTONE",
    text: "milestone: 500 active builders registered! 🎉",
    comments: 24,
    boosts: 88,
    views: 420,
    rotate: "rotate-[6deg] translate-y-4",
  },
  {
    avatar: "EL",
    username: "@emily_l",
    badge: "COLLAB",
    text: "need a Figma designer to polish the onboarding flow",
    comments: 5,
    boosts: 12,
    views: 90,
    rotate: "rotate-[-4deg] -translate-y-3",
  },
  {
    avatar: "DX",
    username: "@dev_x",
    badge: "UPDATE",
    text: "implemented cursor syncing in 40 lines of code",
    comments: 14,
    boosts: 56,
    views: 310,
    rotate: "rotate-[8deg] translate-y-5",
  },
  {
    avatar: "KB",
    username: "@kevin_b",
    badge: "MILESTONE",
    text: "first collaboration team formed on CollabSphere!",
    comments: 18,
    boosts: 72,
    views: 280,
    rotate: "rotate-[-6deg] -translate-y-4",
  },
];

const bottomRowCards: CardData[] = [
  {
    avatar: "HL",
    username: "@helen_codes",
    badge: "UPDATE",
    text: "shipped the sandboxed code executor. 100% safe.",
    comments: 9,
    boosts: 41,
    views: 195,
    rotate: "rotate-[-5deg] translate-y-3",
  },
  {
    avatar: "RN",
    username: "@rust_ninja",
    badge: "COLLAB",
    text: "looking for a co-founder to build an async-first IDE",
    comments: 15,
    boosts: 62,
    views: 330,
    rotate: "rotate-[4deg] -translate-y-2",
  },
  {
    avatar: "AS",
    username: "@ana_s",
    badge: "MILESTONE",
    text: "milestone: 10 builds shipped this week! 🚀",
    comments: 20,
    boosts: 95,
    views: 512,
    rotate: "rotate-[-6deg] translate-y-4",
  },
  {
    avatar: "TG",
    username: "@tom_g",
    badge: "COLLAB",
    text: "need help debugging a nextjs route cache issue",
    comments: 3,
    boosts: 8,
    views: 75,
    rotate: "rotate-[3deg] -translate-y-1",
  },
  {
    avatar: "JS",
    username: "@josh_s",
    badge: "UPDATE",
    text: "just optimized next-themes reload speed. no flash!",
    comments: 7,
    boosts: 28,
    views: 150,
    rotate: "rotate-[-8deg] translate-y-5",
  },
  {
    avatar: "LC",
    username: "@lucas_c",
    badge: "MILESTONE",
    text: "reached 100 users on my side project! 🥳",
    comments: 11,
    boosts: 50,
    views: 220,
    rotate: "rotate-[5deg] -translate-y-3",
  },
];

function Card({ card }: { card: CardData }) {
  const badgeColors = {
    COLLAB: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    UPDATE: "bg-[#8FFF00]/10 text-[#8FFF00] border border-[#8FFF00]/20",
    MILESTONE: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  };

  return (
    <div
      className={`w-[280px] h-[140px] rounded-2xl bg-[#111111] border border-white/[0.08] p-4 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.65)] hover:border-[#E83526]/30 transform transition-transform duration-300 hover:scale-[1.05] select-none ${card.rotate} shrink-0`}
    >
      {/* Top row: Avatar & user info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-300 font-mono">
            {card.avatar}
          </div>
          <div>
            <div className="text-xs font-semibold text-white font-mono leading-none">
              {card.username}
            </div>
          </div>
        </div>
        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${badgeColors[card.badge]}`}>
          {card.badge}
        </span>
      </div>

      {/* Middle row: Text content */}
      <p className="text-xs text-neutral-350 font-light line-clamp-2 leading-relaxed">
        {card.text}
      </p>

      {/* Bottom row: Small engagement icons */}
      <div className="flex items-center gap-4 text-neutral-600 text-[10px] font-mono">
        <span className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          {card.comments}
        </span>
        <span className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500/70" />
          {card.boosts}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          {card.views}
        </span>
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-24 overflow-visible z-20 border-b border-white/[0.03] perspective-1000">
      {/* Gritty Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-20">
        <h3 className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-neutral-500">
          BUILDERS ALREADY SHIPPING
        </h3>
      </div>

      {/* Curved Perspective Marquee Tracks */}
      <div
        className="relative flex flex-col gap-12 sm:gap-16 w-full overflow-visible py-6 z-20"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
          maskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)",
        }}
      >

        {/* Top Row: Curves UPWARDS at the sides, scrolls LEFT */}
        <div
          className="flex w-max overflow-hidden select-none"
          style={{
            transform: "perspective(1000px) rotateX(15deg) rotateZ(-3deg) translateY(-25px)",
            transformOrigin: "center center",
          }}
        >
          <div className="flex gap-6 px-3 marquee will-change-transform">
            {topRowCards.map((card, i) => (
              <Card key={`top-1-${i}`} card={card} />
            ))}
            {topRowCards.map((card, i) => (
              <Card key={`top-2-${i}`} card={card} />
            ))}
          </div>
        </div>

        {/* Bottom Row: Curves DOWNWARDS at the sides, scrolls RIGHT */}
        <div
          className="flex w-max overflow-hidden select-none"
          style={{
            transform: "perspective(1000px) rotateX(-15deg) rotateZ(3deg) translateY(25px)",
            transformOrigin: "center center",
          }}
        >
          <div className="flex gap-6 px-3 marquee-reverse will-change-transform">
            {bottomRowCards.map((card, i) => (
              <Card key={`bottom-1-${i}`} card={card} />
            ))}
            {bottomRowCards.map((card, i) => (
              <Card key={`bottom-2-${i}`} card={card} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
