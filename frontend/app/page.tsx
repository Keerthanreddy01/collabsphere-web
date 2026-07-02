"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { ServicesSection } from "@/components/landing/services-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { InfrastructureSection } from "@/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { CaseStudySection } from "@/components/landing/case-study-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";
import { PodcastSection } from "@/components/landing/podcast-section";

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
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#D4FF26] animate-spin" />
      </div>
    );
  }

  // Logged in — redirect is in progress, render nothing to avoid flash
  if (user) return null;

  // Not logged in → show the landing page
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#030303]">
      <Navigation />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <CaseStudySection />
      <DevelopersSection />
      <TestimonialsSection />
      <PodcastSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
