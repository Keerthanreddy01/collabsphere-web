"use client";

import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { HeroSection } from "@/components/landing/hero-section";
import { StackingPanelsSection } from "@/components/landing/StackingPanelsSection";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturePanels } from "@/components/landing/feature-panels";
import { FooterSection } from "@/components/landing/footer-section";

export function LandingExperience() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#0a0a0a] min-h-screen w-full overflow-hidden">
        {/* 1 — Hero */}
        <HeroSection />

        {/* 2 — Stacking Panels: POST → CONNECT → SHIP → CTA */}
        <StackingPanelsSection />

        {/* 3 — Problem Statement scrollytelling */}
        <ProblemSection />

        {/* 4 — Feature Panels */}
        <FeaturePanels />

        {/* 5 — Footer */}
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
