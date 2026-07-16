"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
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

export default function Home() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <main className="relative min-h-screen w-full bg-[#f3efe6] text-[#0a0a0a] flex flex-col items-center justify-between py-8 px-6 sm:px-12 font-sans overflow-hidden select-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 180, 180, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 180, 180, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Gloria+Hallelujah&display=swap');
        .font-ballpoint {
          font-family: 'Caveat Brush', 'Gloria Hallelujah', cursive;
        }
      `}} />

      {/* Top Row Header */}
      <header className="w-full max-w-6xl flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#0a0a0a]/60 uppercase">
        <div>
          COLLABSPHERE <span className="mx-2 text-[#0a0a0a]/30">—</span> BUILDER NETWORK
        </div>
        <div>
          collabsphere.io
        </div>
      </header>

      {/* Center Layout: Under Construction */}
      <div className="flex flex-col items-center justify-center text-center py-20 relative z-10">
        <div className="relative inline-block mb-4">
          {/* Bold Red Handwritten "under" */}
          <span className="font-ballpoint text-7xl sm:text-[95px] font-normal text-[#dc2626] tracking-wide relative inline-block">
            under
          </span>
        </div>

        {/* Spacing gap followed by bold red handwritten "construction" */}
        <div className="mt-2 relative inline-block">
          <span className="font-ballpoint text-6xl sm:text-[80px] font-normal text-[#dc2626] tracking-wide relative inline-block">
            construction
            
            {/* Custom Curved SVG Red Underline at the very bottom */}
            <svg 
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[115%] h-6 text-[#dc2626] overflow-visible pointer-events-none" 
              viewBox="0 0 100 10" 
              preserveAspectRatio="none"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M1 5 Q 50 11, 99 2" 
                stroke="currentColor" 
                strokeWidth="5" 
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Bottom Row Footer */}
      <footer className="w-full max-w-6xl flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#0a0a0a]/60 uppercase">
        {/* Instagram Interactive Icons */}
        <div className="flex items-center gap-4 text-[#0a0a0a]/75 pointer-events-auto">
          <svg className="w-4.5 h-4.5 hover:text-red-500 transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <svg className="w-4.5 h-4.5 hover:text-black transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <svg className="w-4.5 h-4.5 hover:text-black transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
        </div>

        {/* Instagram Link */}
        <div className="pointer-events-auto">
          <a 
            href="https://www.instagram.com/collabsphereofficial_/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-black transition-colors lowercase"
          >
            @collabsphereofficial_
          </a>
        </div>

        {/* Pre-Register waitlist */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <Link href="/pre-register" className="hover:text-black transition-colors flex items-center gap-1">
            PRE-REGISTER
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </Link>
        </div>
      </footer>

      {/* Hide the old landing page for now */}
      <div className="hidden">
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
      </div>
    </main>
  );
}
