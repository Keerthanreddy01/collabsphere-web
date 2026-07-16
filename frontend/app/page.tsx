"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { CollabsphereSmashSection } from "@/components/landing/collabsphere/collabsphere-smash-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { UniqueEffectsSection } from "@/components/landing/unique-effects-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ScrollingRevealSection } from "@/components/landing/scrolling-reveal-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { useTheme } from "next-themes";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  useEffect(() => {
    if (loading) return; // wait for auth to resolve
    if (!user) return;  // not logged in → show landing page

    // Logged in → check onboarding then redirect
    const redirect = async () => {
      try {
        const snap = await getDoc(doc(db, "builder_profiles", user.uid));
        if (snap.exists() && snap.data().onboarding_completed) {
          router.replace("/dashboard/home");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/dashboard/home");
      }
    };
    redirect();
  }, [user, loading, router]);

  // While checking auth, show a minimal dark loader so there's no flash
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  // Not logged in → show the landing page
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      <Navigation />
      <HeroSection />
      <CollabsphereSmashSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ScrollingRevealSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <UniqueEffectsSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
