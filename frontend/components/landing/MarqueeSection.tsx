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
  // gradient for the "image" area at the top
  gradient: string;
}

// Arc offsets: each card at a progressively different Y and rotation,
// creating the visual arc like Contra's portfolio cards
const topArc = [
  { y: -80, r: -8 },
  { y: -55, r: -5 },
  { y: -28, r: -3 },
  { y:   0, r: -1 },
  { y:  22, r:  2 },
  { y:  40, r:  4 },
  { y:  53, r:  6 },
  { y:  60, r:  8 },
];

// Bottom row arc is the mirror (rises left-to-right)
const bottomArc = [
  { y:  60, r:  8 },
  { y:  45, r:  5 },
  { y:  25, r:  2 },
  { y:   5, r: -1 },
  { y: -18, r: -3 },
  { y: -38, r: -5 },
  { y: -52, r: -7 },
  { y: -62, r: -9 },
];

const topRowCards: CardData[] = [
  { avatar: "AR", username: "@alex_r",     badge: "COLLAB",    gradient: "from-blue-600 to-blue-900",        text: "looking for a Rust dev for a web3 indexer",        comments: 12, boosts: 34, views: 245 },
  { avatar: "SA", username: "@sara_a",     badge: "UPDATE",    gradient: "from-violet-600 to-purple-900",    text: "just shipped v2 of the workspace collab canvas",   comments: 8,  boosts: 19, views: 180 },
  { avatar: "MC", username: "@mike_codes", badge: "MILESTONE", gradient: "from-rose-600 to-red-900",         text: "milestone: 500 active builders registered! 🎉",    comments: 24, boosts: 88, views: 420 },
  { avatar: "EL", username: "@emily_l",   badge: "COLLAB",    gradient: "from-amber-500 to-orange-800",     text: "need a Figma designer for the onboarding flow",    comments: 5,  boosts: 12, views: 90  },
  { avatar: "DX", username: "@dev_x",     badge: "UPDATE",    gradient: "from-teal-500 to-cyan-900",        text: "cursor syncing in 40 lines of code 🤯",            comments: 14, boosts: 56, views: 310 },
  { avatar: "KB", username: "@kevin_b",   badge: "MILESTONE", gradient: "from-green-600 to-emerald-900",    text: "first team formed on CollabSphere!",               comments: 18, boosts: 72, views: 280 },
  { avatar: "JD", username: "@julia_d",   badge: "COLLAB",    gradient: "from-pink-600 to-fuchsia-900",     text: "seeking co-founder with compiler experience",      comments: 7,  boosts: 29, views: 140 },
  { avatar: "TC", username: "@tim_c",     badge: "UPDATE",    gradient: "from-sky-500 to-blue-900",         text: "deployed the db replication wrapper",              comments: 4,  boosts: 15, views: 110 },
];

const bottomRowCards: CardData[] = [
  { avatar: "HL", username: "@helen_codes", badge: "UPDATE",    gradient: "from-indigo-600 to-indigo-900",   text: "shipped the sandboxed code executor. 100% safe.", comments: 9,  boosts: 41, views: 195 },
  { avatar: "RN", username: "@rust_ninja",  badge: "COLLAB",    gradient: "from-orange-600 to-red-900",      text: "looking for co-founder: async-first IDE",         comments: 15, boosts: 62, views: 330 },
  { avatar: "AS", username: "@ana_s",       badge: "MILESTONE", gradient: "from-purple-600 to-violet-900",   text: "milestone: 10 builds shipped this week! 🚀",      comments: 20, boosts: 95, views: 512 },
  { avatar: "TG", username: "@tom_g",       badge: "COLLAB",    gradient: "from-lime-600 to-green-900",      text: "need help: nextjs route cache bug",                comments: 3,  boosts: 8,  views: 75  },
  { avatar: "JS", username: "@josh_s",      badge: "UPDATE",    gradient: "from-cyan-500 to-teal-900",       text: "optimized next-themes reload — no flash!",        comments: 7,  boosts: 28, views: 150 },
  { avatar: "LC", username: "@lucas_c",     badge: "MILESTONE", gradient: "from-red-500 to-rose-900",        text: "reached 100 users on my side project! 🥳",        comments: 11, boosts: 50, views: 220 },
  { avatar: "PT", username: "@peter_t",     badge: "COLLAB",    gradient: "from-yellow-500 to-amber-900",    text: "building React Native app, need a hand",          comments: 6,  boosts: 18, views: 95  },
  { avatar: "VL", username: "@val_l",       badge: "UPDATE",    gradient: "from-fuchsia-600 to-pink-900",    text: "automated onboarding e2e tests 🎉",               comments: 10, boosts: 33, views: 170 },
];

function Card({ card, arc }: { card: CardData; arc: { y: number; r: number } }) {
  const badgeColors = {
    COLLAB:    "bg-blue-500/15 text-blue-300 border border-blue-500/25",
    UPDATE:    "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    MILESTONE: "bg-purple-500/15 text-purple-300 border border-purple-500/25",
  };

  return (
    <div
      style={{
        transform: `translateY(${arc.y}px) rotate(${arc.r}deg)`,
        flexShrink: 0,
      }}
      className="w-[220px] rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.7)] hover:border-white/15 transition-all duration-300 select-none hover:scale-[1.04] cursor-default"
    >
      {/* Top gradient "image" block */}
      <div className={`h-[120px] bg-gradient-to-br ${card.gradient} relative flex items-end p-3`}>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <span className={`relative z-10 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${badgeColors[card.badge]}`}>
          {card.badge}
        </span>
      </div>

      {/* Card body */}
      <div className="bg-[#111111] p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-neutral-700 border border-white/10 flex items-center justify-center text-[8px] font-bold text-neutral-300 font-mono shrink-0">
            {card.avatar}
          </div>
          <span className="text-[11px] font-semibold text-white font-mono truncate">{card.username}</span>
        </div>

        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
          {card.text}
        </p>

        <div className="flex items-center gap-3.5 text-neutral-600 text-[10px] font-mono pt-0.5">
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{card.comments}</span>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500/70" />{card.boosts}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{card.views}</span>
        </div>
      </div>
    </div>
  );
}

function ArcRow({
  cards,
  arc,
  direction = "left",
  duration = 35,
}: {
  cards: CardData[];
  arc: { y: number; r: number }[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const animClass = direction === "left" ? "arc-marquee-left" : "arc-marquee-right";

  return (
    <div className="w-full overflow-hidden py-20">
      <div className="flex">
        {/* Strip A */}
        <div
          className={`flex gap-5 shrink-0 ${animClass}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {cards.map((card, i) => (
            <Card key={`a-${i}`} card={card} arc={arc[i % arc.length]} />
          ))}
        </div>
        {/* Strip B — identical duplicate for seamless loop */}
        <div
          className={`flex gap-5 shrink-0 ${animClass}`}
          style={{ animationDuration: `${duration}s` }}
        >
          {cards.map((card, i) => (
            <Card key={`b-${i}`} card={card} arc={arc[i % arc.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] overflow-hidden z-20 border-b border-white/[0.03]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes arcMarqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes arcMarqueeRight {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .arc-marquee-left  { animation: arcMarqueeLeft  linear infinite; will-change: transform; }
        .arc-marquee-right { animation: arcMarqueeRight linear infinite; will-change: transform; }
      `}} />

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      {/* Label */}
      <div className="pt-20 pb-0 text-center relative z-20">
        <h3 className="font-mono text-xs tracking-[0.3em] uppercase text-neutral-600">
          BUILDERS ALREADY SHIPPING
        </h3>
      </div>

      {/* Edge fade */}
      <div
        className="relative z-20"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        {/* TOP ROW — arcs from high-left to low-right, scrolls LEFT */}
        <ArcRow cards={topRowCards} arc={topArc} direction="left" duration={38} />

        {/* BOTTOM ROW — arcs from low-left to high-right, scrolls RIGHT */}
        <ArcRow cards={bottomRowCards} arc={bottomArc} direction="right" duration={30} />
      </div>

      <div className="pb-20" />
    </section>
  );
}
