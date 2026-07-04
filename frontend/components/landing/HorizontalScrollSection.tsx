"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Flame, MessageSquare, Eye, GitFork } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Reusable floating card components ──────────────────────────────────────

function PostCard({
  username,
  handle,
  badge,
  text,
  tags,
  rotate,
  top,
  left,
  right,
  comments = 8,
  boosts = 34,
  views = 210,
}: {
  username: string;
  handle: string;
  badge: "MILESTONE" | "COLLAB" | "UPDATE";
  text: string;
  tags?: string[];
  rotate: string;
  top?: string;
  left?: string;
  right?: string;
  comments?: number;
  boosts?: number;
  views?: number;
}) {
  const badgeColors = {
    MILESTONE: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    COLLAB: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    UPDATE: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  };
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      className="absolute w-[280px] rounded-2xl bg-[#111]/95 border border-white/10 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm flex flex-col gap-3 z-20"
      style={{ transform: `rotate(${rotate})`, top, left, right }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white font-mono">
            {initials}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">{username}</div>
            <div className="text-[10px] text-neutral-500">{handle} · just now</div>
          </div>
        </div>
        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${badgeColors[badge]}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-neutral-300 leading-relaxed">{text}</p>
      {tags && (
        <div className="flex gap-2">
          {tags.map((t) => (
            <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-500 font-mono border border-white/8">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-4 text-neutral-600 text-[10px] font-mono pt-0.5 border-t border-white/5">
        <span className="flex items-center gap-1 pt-2"><MessageSquare className="w-3 h-3" />{comments}</span>
        <span className="flex items-center gap-1 pt-2"><Flame className="w-3 h-3 text-orange-500/60" />{boosts}</span>
        <span className="flex items-center gap-1 pt-2"><Eye className="w-3 h-3" />{views}</span>
      </div>
    </div>
  );
}

function ProfileCard({ rotate, top, left, right }: { rotate: string; top?: string; left?: string; right?: string }) {
  return (
    <div
      className="absolute w-[240px] rounded-2xl bg-[#111]/95 border border-white/10 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm z-20"
      style={{ transform: `rotate(${rotate})`, top, left, right }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
          MK
        </div>
        <div>
          <div className="text-sm font-semibold text-white">@mike_k</div>
          <div className="text-[10px] text-neutral-500">React · Node · Postgres</div>
        </div>
      </div>
      <div className="text-xs text-neutral-400 mb-3">
        Looking to join a small team building a SaaS product. 2 yrs exp.
      </div>
      <button className="w-full py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 transition-colors">
        View profile →
      </button>
    </div>
  );
}

function MockFeed() {
  return (
    <div className="w-[420px] rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-20">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#141414] border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/40" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/40" />
        <span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/40" />
        <span className="ml-3 text-[10px] text-neutral-600 font-mono tracking-widest">collabsphere.app/feed</span>
      </div>
      <div className="p-4 space-y-3">
        {[
          { u: "KR", name: "Keerthan Reddy", text: "Shipped the real-time matchmaking algorithm!", badge: "MILESTONE", boosts: 88 },
          { u: "SA", name: "Sara A.", text: "Looking for a React dev — building async-first IDE.", badge: "COLLAB", boosts: 41 },
          { u: "DX", name: "@dev_x", text: "Cursor syncing in 40 lines. Wild.", badge: "UPDATE", boosts: 56 },
        ].map((p, i) => (
          <div key={i} className="bg-[#161616] rounded-xl p-3 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[8px] font-bold text-white">{p.u}</div>
                <span className="text-[11px] text-white font-semibold">{p.name}</span>
              </div>
              <span className="text-[8px] text-purple-300 font-mono border border-purple-500/30 bg-purple-500/10 px-1 py-0.5 rounded">
                {p.badge}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">{p.text}</p>
            <div className="flex gap-3 text-neutral-600 text-[9px] font-mono">
              <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-orange-500/60" />{p.boosts}</span>
              <span className="flex items-center gap-1"><GitFork className="w-2.5 h-2.5" />3</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function HorizontalScrollSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const ctx = gsap.context(() => {
        gsap.to(innerRef.current, {
          x: "-75%",
          ease: "none",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, outerRef);

      return () => ctx.revert();
    },
    { scope: outerRef }
  );

  return (
    /* Outer pin wrapper — explicit height so no layout shift */
    <div
      ref={outerRef}
      className="relative w-full overflow-hidden bg-[#0a0a0a] z-20"
      style={{ height: "100vh" }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Inner horizontal container — 400vw wide */}
      <div
        ref={innerRef}
        className="flex h-screen"
        style={{ width: "400vw", willChange: "transform" }}
      >

        {/* ── PANEL 1: BUILD ───────────────────────────────────────────── */}
        <div className="relative w-screen h-screen bg-[#0a0a0a] flex flex-col justify-center items-start px-16 sm:px-24 overflow-hidden shrink-0">
          {/* Giant word */}
          <h2
            className="font-anton uppercase text-[#E83526] leading-[0.85] select-none pointer-events-none z-10"
            style={{ fontSize: "clamp(120px, 20vw, 220px)", letterSpacing: "-0.04em" }}
          >
            BUILD
          </h2>
          <p className="mt-6 font-mono text-sm tracking-widest uppercase text-neutral-500 z-10">
            Share what you're working on.
          </p>

          {/* Floating card */}
          <PostCard
            username="Keerthan Reddy"
            handle="@keerthanreddy1706"
            badge="MILESTONE"
            text="just shipped CollabSphere v1 — real-time builder matching is live 🚀"
            tags={["#collabsphere", "#v1"]}
            rotate="-6deg"
            top="18%"
            right="8%"
            comments={22}
            boosts={91}
            views={480}
          />

          {/* Decorative red line */}
          <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-[#E83526]/20" />
          <div className="absolute bottom-14 left-16 font-mono text-[10px] text-neutral-700 tracking-widest uppercase">
            01 — Build
          </div>
        </div>

        {/* ── PANEL 2: CONNECT ─────────────────────────────────────────── */}
        <div className="relative w-screen h-screen bg-[#0a0a0a] flex flex-col justify-center items-start px-16 sm:px-24 overflow-hidden shrink-0">
          <h2
            className="font-anton uppercase text-[#F4F1EA] leading-[0.85] select-none pointer-events-none z-10"
            style={{ fontSize: "clamp(100px, 17vw, 200px)", letterSpacing: "-0.04em" }}
          >
            CONNECT
          </h2>
          <p className="mt-6 font-mono text-sm tracking-widest uppercase text-neutral-500 z-10">
            Find people who want to build with you.
          </p>

          {/* Two overlapping floating cards */}
          <PostCard
            username="Alex Rivera"
            handle="@alexr"
            badge="COLLAB"
            text="building a DeFi dashboard — need a frontend co-founder, React preferred"
            rotate="5deg"
            top="12%"
            right="14%"
            comments={9}
            boosts={45}
            views={320}
          />
          <ProfileCard rotate="-3deg" top="42%" right="5%" />

          <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-white/[0.06]" />
          <div className="absolute bottom-14 left-16 font-mono text-[10px] text-neutral-700 tracking-widest uppercase">
            02 — Connect
          </div>
        </div>

        {/* ── PANEL 3: SHIP ────────────────────────────────────────────── */}
        <div className="relative w-screen h-screen bg-[#0a0a0a] flex flex-col justify-center items-start px-16 sm:px-24 overflow-hidden shrink-0">
          <h2
            className="font-anton uppercase text-[#E83526] leading-[0.85] select-none pointer-events-none z-10"
            style={{ fontSize: "clamp(120px, 20vw, 220px)", letterSpacing: "-0.04em" }}
          >
            SHIP
          </h2>
          <p className="mt-6 font-mono text-sm tracking-widest uppercase text-neutral-500 z-10">
            Turn ideas into real products.
          </p>

          {/* Floating mock feed */}
          <div className="absolute top-[12%] right-[6%] z-20" style={{ transform: "rotate(4deg)" }}>
            <MockFeed />
          </div>

          <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-[#E83526]/20" />
          <div className="absolute bottom-14 left-16 font-mono text-[10px] text-neutral-700 tracking-widest uppercase">
            03 — Ship
          </div>
        </div>

        {/* ── PANEL 4: CTA ─────────────────────────────────────────────── */}
        <div className="relative w-screen h-screen bg-[#0a0a0a] flex flex-col justify-center items-center text-center px-16 overflow-hidden shrink-0">
          {/* Large decorative background text */}
          <span
            className="absolute inset-0 flex items-center justify-center font-anton uppercase text-white/[0.03] pointer-events-none select-none leading-none"
            style={{ fontSize: "clamp(120px, 22vw, 240px)" }}
          >
            GO
          </span>

          <div className="relative z-10 space-y-8 max-w-xl mx-auto">
            {/* Small label */}
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#E83526]">
              04 — You're ready
            </p>

            <h2 className="font-anton uppercase text-white text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-tight">
              Ready to<br />
              <span className="text-[#E83526]">build?</span>
            </h2>

            <p className="font-sans text-neutral-400 text-base sm:text-lg leading-relaxed">
              Join the waitlist. Early access is limited.
            </p>

            <Link
              href="/pre-register"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#E83526] text-white font-bold text-base hover:bg-[#c62d1e] transition-colors shadow-[0_8px_40px_rgba(232,53,38,0.35)] border-2 border-[#E83526] group"
            >
              Get early access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bottom border line */}
          <div className="absolute bottom-16 left-16 right-16 h-[1px] bg-white/[0.06]" />
        </div>

      </div>
    </div>
  );
}
