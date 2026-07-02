"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Draft Your Vision",
    subtitle: "Post your idea",
    desc: "Define your project, tech stack, and what kind of builders you need. Be specific — the best teammates come to clarity.",
    code: `const project = await create({
  title: "Next-gen Protocol",
  stack: ["Rust", "TypeScript", "WASM"],
  looking_for: ["Backend Engineer", "DevOps"],
  stage: "early",
});
// ✓ Project posted to 1,200+ builders`,
    color: "#D4FF26",
  },
  {
    number: "02",
    title: "Scout the Talent",
    subtitle: "Find your co-founder",
    desc: "Browse verified builder profiles with real shipped projects. No LinkedIn fluff. Just signal.",
    code: `const builders = await search({
  skills: ["Rust", "Systems Design"],
  verified: true,
  shipped_projects: { min: 3 },
  available: true,
});
// ✓ 47 builders matched your criteria`,
    color: "#a78bfa",
  },
  {
    number: "03",
    title: "Build in Public",
    subtitle: "Ship, share, grow",
    desc: "Share daily progress. Let the community amplify your work. Attract collaborators who believe in what you're building.",
    code: `await post({
  content: "Shipped our MVP! 🚀",
  repo: "github.com/you/protocol",
  visibility: "public",
  community: true,
});
// ✓ 340 builders saw your update`,
    color: "#67e8f9",
  },
  {
    number: "04",
    title: "Scale Together",
    subtitle: "From project to startup",
    desc: "The teams formed here become the startups of tomorrow. Start small. Ship fast. Grow into something legendary.",
    code: `await team.scale({
  stage: "pre-seed",
  target: "Y Combinator",
  team_size: 4,
  runway: "18 months",
});
// ✓ Team CollabSphere → YC W25`,
    color: "#fbbf24",
  },
];

// Self-typing code effect
function TypedCode({ code, active }: { code: string; active: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    let i = 0;
    setDisplayed("");
    const type = () => {
      if (i <= code.length) {
        setDisplayed(code.slice(0, i));
        i++;
        rafRef.current = setTimeout(type, 18);
      }
    };
    type();
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  }, [active, code]);

  return (
    <pre className="text-[13px] text-white/70 font-mono leading-relaxed whitespace-pre-wrap break-words">
      {displayed}
      {active && displayed.length < code.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-[#D4FF26]/60 ml-0.5 align-middle"
        />
      )}
    </pre>
  );
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress → active step
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const step = Math.min(Math.floor(v * STEPS.length * 1.05), STEPS.length - 1);
      setActiveStep(Math.max(0, step));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const lineHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-[#030303]"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">

          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase mb-3">
                <span className="w-8 h-px bg-white/20" />
                The Process
              </span>
              <h2 className="font-display text-[clamp(1.8rem,4vw,4rem)] text-white leading-[0.9] tracking-tight">
                How CollabSphere{" "}
                <span className="text-white/30">works.</span>
              </h2>
            </div>

            {/* Step indicators */}
            <div className="hidden lg:flex items-center gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const scrollTarget = sectionRef.current;
                    if (!scrollTarget) return;
                    const rect = scrollTarget.getBoundingClientRect();
                    const top = window.scrollY + rect.top + (i / STEPS.length) * scrollTarget.offsetHeight;
                    window.scrollTo({ top, behavior: "smooth" });
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeStep === i
                      ? "w-8 h-2 bg-[#D4FF26]"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main content: timeline + code */}
          <div className="grid lg:grid-cols-[auto_1fr_1fr] gap-6 lg:gap-12 items-start">

            {/* Timeline line + steps */}
            <div className="hidden lg:flex flex-col items-center gap-0 relative">
              {/* Background line */}
              <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-px bg-white/[0.06]" />
              {/* Animated progress line */}
              <motion.div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-px bg-[#D4FF26]/50"
                style={{ height: lineHeight, originY: 0 }}
              />

              {STEPS.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center gap-16 last:gap-0">
                  <motion.div
                    animate={{
                      backgroundColor: activeStep >= i ? "#D4FF26" : "transparent",
                      borderColor: activeStep >= i ? "#D4FF26" : "rgba(255,255,255,0.1)",
                      scale: activeStep === i ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full border flex items-center justify-center z-10 relative"
                  >
                    <span className={`text-[10px] font-mono font-bold ${activeStep >= i ? "text-black" : "text-white/30"}`}>
                      {step.number}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Step info — left panel */}
            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-2">
                    <span
                      className="text-[11px] font-mono tracking-[0.2em] uppercase"
                      style={{ color: STEPS[activeStep].color }}
                    >
                      {STEPS[activeStep].number} — {STEPS[activeStep].subtitle}
                    </span>
                  </div>
                  <h3 className="font-display text-[clamp(2rem,4vw,4.5rem)] text-white leading-[0.9] tracking-tight mb-6">
                    {STEPS[activeStep].title}
                  </h3>
                  <p className="text-white/50 text-base lg:text-lg leading-relaxed max-w-sm">
                    {STEPS[activeStep].desc}
                  </p>

                  {/* Step dots for mobile */}
                  <div className="flex items-center gap-2 mt-8 lg:hidden">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          activeStep === i ? "w-6 h-1.5 bg-[#D4FF26]" : "w-1.5 h-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Code terminal — right panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block"
              >
                <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-xl overflow-hidden">
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                    <span className="w-3 h-3 rounded-full bg-red-500/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-3 text-[11px] font-mono text-white/20">
                      collabsphere.api.ts
                    </span>
                  </div>
                  {/* Code */}
                  <div className="p-6 min-h-[200px]">
                    <TypedCode code={STEPS[activeStep].code} active={true} />
                  </div>
                  {/* Bottom accent */}
                  <div
                    className="h-px w-full"
                    style={{ background: `linear-gradient(90deg, ${STEPS[activeStep].color}60, transparent)` }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 right-12 hidden lg:flex flex-col items-end gap-2">
            <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
              Step {activeStep + 1} of {STEPS.length}
            </span>
            <div className="w-20 h-px bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#D4FF26]/60"
                animate={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
