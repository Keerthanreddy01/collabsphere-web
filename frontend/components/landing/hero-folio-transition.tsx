"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** A single, compositor-only bridge between the hero and the first story section. */
export function HeroFolioTransition() {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector<HTMLElement>("#landing-hero");
    const folio = document.querySelector<HTMLElement>(".builder-folio");
    const book = document.querySelector<HTMLElement>(".builder-folio__book");
    const nav = document.querySelector<HTMLElement>(".builder-folio__nav");
    if (!hero || !folio || !book || !nav) return;

    gsap.set([book, nav], { willChange: "transform,opacity" });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: folio,
        start: "top 92%",
        end: "top 32%",
        scrub: 0.65,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .fromTo(nav, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: "none" }, 0)
      .fromTo(book, { autoAlpha: 0, y: 88, scale: 0.975 }, { autoAlpha: 1, y: 0, scale: 1, ease: "none" }, 0)
      .to(hero, { autoAlpha: 0.18, scale: 0.985, transformOrigin: "50% 100%", ease: "none" }, 0);

    return () => {
      gsap.set([book, nav], { clearProps: "willChange" });
    };
  });

  return null;
}
