"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";

const featuredBuilders = [
  {
    handle: "AMELIA_W",
    role: "UI Designer",
    stack: ["Figma", "React", "CSS"],
    projects: 12,
    collab: "94%",
    bio: "Crafting pixel-perfect interfaces for next-gen startups. From zero to shipped.",
    tag: "DESIGN LEAD",
  },
  {
    handle: "S. RIVERS",
    role: "Rust Architect",
    stack: ["Rust", "WASM", "C++"],
    projects: 8,
    collab: "98%",
    bio: "Building blazing-fast protocols from the ground up. Performance is a feature.",
    tag: "SYSTEMS",
  },
  {
    handle: "MIA_KH",
    role: "Design Lead",
    stack: ["Figma", "Next.js", "Motion"],
    projects: 19,
    collab: "91%",
    bio: "Where brand meets code. I turn visions into products people love to use.",
    tag: "CREATIVE",
  },
  {
    handle: "MAX_P",
    role: "WASM Guru",
    stack: ["WASM", "Rust", "TypeScript"],
    projects: 6,
    collab: "99%",
    bio: "Pushing the web to native-speed execution. WASM is not the future — it's now.",
    tag: "WASM CORE",
  },
  {
    handle: "LIAM_T",
    role: "Backend Engineer",
    stack: ["Go", "Postgres", "Redis"],
    projects: 15,
    collab: "96%",
    bio: "Scalable APIs, clean architecture. Ships on time, every time.",
    tag: "BACKEND",
  },
  {
    handle: "SYNE_K",
    role: "Founder & Builder",
    stack: ["React", "Node", "AWS"],
    projects: 23,
    collab: "89%",
    bio: "Serial builder. 3 exits. Currently building the next thing in public.",
    tag: "FOUNDER",
  },
];

export default function FeaturedPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white dark:bg-black/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-3 text-black dark:text-white/60 hover:text-black dark:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">COLLABSPHERE™</span>
        </Link>
        <span className="text-xs font-mono text-black dark:text-white/30 tracking-widest">FEATURED BUILDERS</span>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-3 text-sm font-mono text-black dark:text-white/40 mb-8">
            <span className="w-12 h-px bg-black/20 dark:bg-white/20" />
            FEATURED_BUILDERS · 2026
          </span>
          <h1 className="text-7xl md:text-[10rem] lg:text-[160px] font-display tracking-tight leading-[0.85] mb-8">
            ELITE
            <br />
            <span className="text-black dark:text-white/20">BUILDERS.</span>
          </h1>
          <p className="text-xl text-black dark:text-white/50 max-w-lg leading-relaxed">
            Hand-picked builders with verified track records. Real code, real history, real results.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 lg:px-12 pb-40 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBuilders.map((builder, i) => (
            <div
              key={builder.handle}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative p-8 border transition-all duration-500 cursor-default ${
                hoveredIndex === i
                  ? "border-gray-200 dark:border-white/30 bg-white/[0.04]"
                  : "border-gray-200 dark:border-white/10 bg-white/[0.01]"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Tag */}
              <span className="text-[10px] font-mono text-black dark:text-white/30 tracking-widest mb-6 block">{builder.tag}</span>

              {/* Handle */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-display">{builder.handle}</h2>
                  <p className="text-sm text-black dark:text-white/40 mt-1">{builder.role}</p>
                </div>
                <div className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
                  hoveredIndex === i ? "border-black/20 dark:border-white bg-white text-white dark:text-black" : "border-gray-200 dark:border-white/20"
                }`}>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-black dark:text-white/50 leading-relaxed mb-6">{builder.bio}</p>

              {/* Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {builder.stack.map((s) => (
                  <span key={s} className="text-[11px] font-mono px-2 py-1 border border-gray-200 dark:border-white/10 text-black dark:text-white/40">
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <div>
                  <span className="text-2xl font-display block">{builder.projects}</span>
                  <span className="text-[11px] text-black dark:text-white/30 font-mono">projects</span>
                </div>
                <div>
                  <span className="text-2xl font-display block">{builder.collab}</span>
                  <span className="text-[11px] text-black dark:text-white/30 font-mono">collab rate</span>
                </div>
              </div>

              {/* Active bar on hover */}
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-white transition-transform duration-500 origin-left ${
                hoveredIndex === i ? "scale-x-100" : "scale-x-0"
              }`} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-black dark:text-white/30 text-sm font-mono mb-6">2,400+ builders on the platform</p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 border border-gray-200 dark:border-white/20 text-sm font-mono hover:border-black/20 dark:border-white hover:bg-white hover:text-white dark:text-black transition-all duration-300 group"
          >
            JOIN THE COMMUNITY
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
