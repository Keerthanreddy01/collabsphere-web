"use client";

import { useEffect } from "react";
import { FooterSection } from "@/components/landing/footer-section";
import { CollabsphereProvider } from "./collabsphere/collabsphere-context";
import { PageLoader } from "./collabsphere/page-loader";
import { CollabsphereHeader } from "./collabsphere/collabsphere-header";
import { CollabsphereHero } from "./collabsphere/collabsphere-hero";
import { CollabsphereAbout } from "./collabsphere/collabsphere-about";
import { CollabsphereBandsAndPortfolio } from "./collabsphere/collabsphere-bands-and-portfolio";
import { CollabsphereServicesAndStats } from "./collabsphere/collabsphere-services-and-stats";
import { CollabsphereOverlays } from "./collabsphere/collabsphere-overlays";

export function LandingExperience() {
  useEffect(() => {
    // Add adaptive scaling
    document.documentElement.classList.add("is-collabsphere");
    return () => {
      document.documentElement.classList.remove("is-collabsphere");
    };
  }, []);

  return (
    <CollabsphereProvider>
      <main className="collabsphere-theme relative bg-[var(--collabsphere-bg)] text-[var(--collabsphere-fg)] min-h-screen w-full selection:bg-[var(--collabsphere-accent)] selection:text-white antialiased font-sans">
        <PageLoader />
        <CollabsphereHeader />
        <CollabsphereHero />
        <CollabsphereAbout />
        <CollabsphereBandsAndPortfolio />
        <CollabsphereServicesAndStats />
        <FooterSection />
        <CollabsphereOverlays />
      </main>
    </CollabsphereProvider>
  );
}
