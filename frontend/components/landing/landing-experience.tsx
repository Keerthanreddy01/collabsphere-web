"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { SquiblProvider } from "./squibl/squibl-context";
import { SquiblLoader } from "./squibl/page-loader";
import { SquiblHero } from "./squibl/squibl-hero";
import { SquiblVideoReveal } from "./squibl/squibl-video-reveal";
import { SquiblWorkAbout } from "./squibl/squibl-work-about";
import { SquiblTrust } from "./squibl/squibl-trust";
import { SquiblStats } from "./squibl/squibl-stats";
import { SquiblClientConfessions } from "./squibl/squibl-client-confessions";
import { FooterSection } from "@/components/landing/footer-section";
import { SquiblOverlays } from "./squibl/squibl-overlays";
import { WiseEarthSection } from "./squibl/wise-earth-section";

export function LandingExperience() {
  const requestRef = useRef<number>(null);

  useEffect(() => {
    // Adaptive sizing
    document.documentElement.classList.add("is-baseline");

    // Lenis Smooth Scroll
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestRef.current = requestAnimationFrame(raf);
    };
    requestRef.current = requestAnimationFrame(raf);

    return () => {
      document.documentElement.classList.remove("is-baseline");
      lenis.destroy();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <SquiblProvider>
      <main className="baseline-theme baseline-font bg-[var(--background)] text-[var(--foreground)] w-full overflow-x-clip p-[0.5rem] sm:p-[0.75rem] flex flex-col gap-[0.5rem] sm:gap-[0.75rem]">
        <SquiblLoader />
        <SquiblHero />
        <WiseEarthSection />
        <SquiblVideoReveal />
        <SquiblTrust />
        <SquiblWorkAbout />
        <SquiblStats />
        <SquiblClientConfessions />
        <FooterSection />
        <SquiblOverlays />
      </main>
    </SquiblProvider>
  );
}
