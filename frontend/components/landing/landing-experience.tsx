"use client";

import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturePanels } from "@/components/landing/feature-panels";
import { FooterSection } from "@/components/landing/footer-section";

export function LandingExperience() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#0a0a0a] min-h-screen w-full">
        {/* 1 — Hero */}
        <HeroSection />

        {/* 2 — Problem Statement */}
        <ProblemSection />

        {/* 3 — Feature Panels */}
        <FeaturePanels />

        {/* 4 — Footer */}
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
