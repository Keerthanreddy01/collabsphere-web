"use client";

import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturePanels } from "@/components/landing/feature-panels";
import { FooterSection } from "@/components/landing/footer-section";

export function LandingExperience() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#0a0a0a] min-h-screen w-full overflow-hidden">
        {/* Navigation / Header */}
        <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 md:px-16 lg:px-24 py-6 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <img src="/newlogo.png" alt="CS Logo" className="w-5 h-5 opacity-80" />
            <span className="font-sans font-bold text-sm tracking-widest text-white uppercase">
              CollabSphere
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/login" className="text-neutral-400 hover:text-white transition-colors">
              Sign in
            </a>
            <a
              href="/pre-register"
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white font-medium transition-all"
            >
              Join waitlist
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection />

        {/* Problem Section */}
        <ProblemSection />

        {/* Feature Panels Section */}
        <FeaturePanels />

        {/* Footer Section */}
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
