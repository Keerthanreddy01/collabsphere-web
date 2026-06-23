"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 dark:border-white/20 border-t-white" />
      </div>
    );
  }

  // Logged in — redirect is in progress, render nothing to avoid flash
  if (user) return null;

  // Not logged in → show the landing page
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white dark:bg-black">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <DevelopersSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
