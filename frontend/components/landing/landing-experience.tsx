"use client";

import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturePanels } from "@/components/landing/feature-panels";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export function LandingExperience() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#0a0a0a] min-h-screen w-full overflow-clip">
        <HeroSection />
        <ProblemSection />
        <FeaturePanels />
        <FeaturesSection />
        <CtaSection />
        <FooterSection />
      </main>
    </SmoothScroll>
  );
}
