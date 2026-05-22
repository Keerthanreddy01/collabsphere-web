"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const licenses = [
  {
    name: "MIT License",
    badge: "OPEN",
    description: "The core Collabsphere platform is open source under the MIT License. Free to use, fork, and extend. Attribution appreciated but not required.",
    permissions: ["Commercial use", "Modification", "Distribution", "Private use"],
    conditions: ["License and copyright notice"],
    limitations: ["No liability", "No warranty"],
  },
  {
    name: "Community Content",
    badge: "CC BY 4.0",
    description: "All community-submitted content — project pages, builder profiles, build logs — are published under Creative Commons Attribution 4.0.",
    permissions: ["Share", "Adapt", "Commercial use"],
    conditions: ["Attribution required", "Indicate changes"],
    limitations: ["No additional restrictions"],
  },
  {
    name: "Brand Assets",
    badge: "RESTRICTED",
    description: "The Collabsphere™ name, logo, and brand assets are proprietary. Usage requires explicit written permission from The Galaxy Corp.",
    permissions: ["View"],
    conditions: ["Written approval required", "No modifications"],
    limitations: ["No redistribution", "No commercial use"],
  },
];

const faq = [
  {
    q: "Can I use Collabsphere code in my own product?",
    a: "Yes. The MIT License allows commercial use. Just keep the copyright notice in your source.",
  },
  {
    q: "Can I fork and deploy my own instance?",
    a: "Absolutely. That's what open source is for. We'd love to hear what you build.",
  },
  {
    q: "Can I use the Collabsphere name in my project?",
    a: "Only with prior written permission. Reach out to hi@collab.tech for brand usage requests.",
  },
  {
    q: "What governs user-submitted content?",
    a: "Builder profiles and project content fall under CC BY 4.0. You own your content — we just display it.",
  },
];

const badgeColors: Record<string, string> = {
  OPEN: "text-green-400 bg-green-400/10 border-green-400/20",
  "CC BY 4.0": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  RESTRICTED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function LicensesPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">COLLABSPHERE™</span>
        </Link>
        <span className="text-xs font-mono text-white/30 tracking-widest">LICENSES</span>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-8">
            <span className="w-12 h-px bg-white/20" />
            LEGAL · OPEN SOURCE
          </span>
          <h1 className="text-7xl md:text-[10rem] lg:text-[160px] font-display tracking-tight leading-[0.85] mb-8">
            OPEN
            <br />
            <span className="text-white/20">BY DEFAULT.</span>
          </h1>
          <p className="text-xl text-white/50 max-w-lg leading-relaxed">
            We believe in transparent, builder-first licensing. No lock-in. No surprises. Just clear terms.
          </p>
        </div>
      </section>

      {/* License cards */}
      <section className="px-6 lg:px-12 pb-24 max-w-[1400px] mx-auto">
        <div className="space-y-4">
          {licenses.map((license, i) => (
            <div
              key={license.name}
              className={`p-10 border border-white/10 bg-white/[0.02] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 120 + 200}ms` }}
            >
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 border ${badgeColors[license.badge]} mb-4 inline-block`}>
                    {license.badge}
                  </span>
                  <h2 className="text-3xl font-display">{license.name}</h2>
                </div>
              </div>
              <p className="text-white/50 leading-relaxed mb-8 max-w-2xl">{license.description}</p>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs font-mono text-green-400 mb-3 block">PERMISSIONS</span>
                  <ul className="space-y-2">
                    {license.permissions.map((p) => (
                      <li key={p} className="text-sm text-white/50 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-mono text-yellow-400 mb-3 block">CONDITIONS</span>
                  <ul className="space-y-2">
                    {license.conditions.map((c) => (
                      <li key={c} className="text-sm text-white/50 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-yellow-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-mono text-red-400 mb-3 block">LIMITATIONS</span>
                  <ul className="space-y-2">
                    {license.limitations.map((l) => (
                      <li key={l} className="text-sm text-white/50 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-12 pb-40 max-w-[1400px] mx-auto">
        <span className="text-xs font-mono text-white/30 tracking-widest mb-10 block">FREQUENTLY ASKED</span>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <div key={i} className={`border border-white/10 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: `${i * 80 + 600}ms` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium pr-8">{item.q}</span>
                <span className={`text-xl text-white/40 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40" : "max-h-0"}`}>
                <p className="px-6 pb-6 text-white/50 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-20 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <a
            href="mailto:hi@collab.tech"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-mono hover:bg-white/90 transition-all duration-300 group"
          >
            ASK A LEGAL QUESTION
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-sm font-mono hover:border-white transition-all duration-300"
          >
            BACK TO HOME
          </Link>
        </div>
      </section>
    </main>
  );
}
