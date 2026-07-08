"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { CollabsphereProvider } from "./collabsphere/collabsphere-context";
import { CollabsphereLoader } from "./collabsphere/page-loader";
import { CollabsphereHero } from "./collabsphere/collabsphere-hero";
import { CollabsphereTrust } from "./collabsphere/collabsphere-trust";
import { CollabspherePrograms } from "./collabsphere/collabsphere-programs";
import { CollabsphereFacilities } from "./collabsphere/collabsphere-facilities";
import { CollabsphereStats } from "./collabsphere/collabsphere-stats";
import { CollabsphereTestimonials } from "./collabsphere/collabsphere-testimonials";
import { FooterSection } from "@/components/landing/footer-section";
import { CollabsphereOverlays } from "./collabsphere/collabsphere-overlays";

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
    <CollabsphereProvider>
      <main className="baseline-theme baseline-font bg-[var(--background)] text-[var(--foreground)] w-full overflow-x-clip p-[0.5rem] sm:p-[0.75rem]">
        <CollabsphereLoader />
        <CollabsphereHero />
        <CollabsphereTrust />
        <CollabspherePrograms />
        <CollabsphereFacilities />
        <CollabsphereStats />
        <CollabsphereTestimonials />
        <FooterSection />
        <CollabsphereOverlays />
      </main>
    </CollabsphereProvider>
  );
}
