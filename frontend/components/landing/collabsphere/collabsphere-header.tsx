"use client";

import { motion } from "framer-motion";
import { TennisMark, scrollToId } from "./collabsphere-shared";

export function CollabsphereHeader() {
  const openModal = () => window.dispatchEvent(new CustomEvent("open-collabsphere-modal"));
  const openMenu = () => window.dispatchEvent(new CustomEvent("open-collabsphere-menu"));

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-[1.5rem] pt-[1.5rem] sm:px-[2.5rem] sm:pt-[2rem] text-[0.75rem] text-white">

      {/* Left Nav */}
      <nav className="hidden lg:flex flex-1 gap-[2rem]">
        <a
          href="#programs"
          onClick={(e) => { e.preventDefault(); scrollToId("programs"); }}
          className="text-white/90 hover:text-white transition-colors"
        >
          Services & Pricing
        </a>
        <a
          href="#facilities"
          onClick={(e) => { e.preventDefault(); scrollToId("facilities"); }}
          className="text-white/90 hover:text-white transition-colors"
        >
          Work & Impact
        </a>
      </nav>

      {/* Center Brand */}
      <div className="flex-1 flex justify-start lg:justify-center">
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollToId("home"); }}
          className="flex items-center gap-[0.5rem] text-[1rem] font-medium uppercase tracking-[0.2em]"
        >
          <TennisMark className="w-[1.25rem] h-[1.25rem]" />
          Collabsphere
        </a>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-end gap-[1rem] sm:gap-[1.25rem]">
        <button
          onClick={openModal}
          className="hidden sm:block uppercase tracking-wide hover:underline underline-offset-4"
        >
          Start a Project
        </button>

        {/* Burger Button */}
        <button
          onClick={openMenu}
          className="w-[2.5rem] h-[2.5rem] flex flex-col items-center justify-center gap-[5px] rounded-[var(--radius-pill)] bg-white/15 backdrop-blur hover:bg-white/25 transition-colors focus-visible:outline focus-visible:outline-[var(--brand-light)]"
        >
          <div className="w-[1rem] h-[1px] bg-white" />
          <div className="w-[1rem] h-[1px] bg-white" />
        </button>
      </div>

    </header>
  );
}

