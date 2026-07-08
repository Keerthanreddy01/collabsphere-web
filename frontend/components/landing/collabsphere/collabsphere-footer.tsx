"use client";

import { motion } from "framer-motion";
import { Eyebrow, PillButton, TennisMark } from "./collabsphere-shared";

export function CollabsphereFooter() {
  const openModal = () => window.dispatchEvent(new CustomEvent("open-collabsphere-modal"));

  return (
    <footer id="contact" className="bg-[var(--brand-deep)] text-white rounded-[var(--radius-card-lg)] mt-[0.75rem] px-[1.5rem] py-[3.5rem] sm:px-[2.5rem] sm:py-[4rem]">
      
      {/* CTA Band */}
      <div className="border-b border-white/15 pb-[3.5rem] flex flex-col sm:flex-row sm:justify-between sm:items-end gap-[2rem]">
        <div>
          <Eyebrow text="Get started" tone="light" />
          <h2 className="mt-[1rem] text-[3.75rem] font-medium leading-[0.92] tracking-tight">
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              >
                Ready to
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              >
                build?
              </motion.span>
            </span>
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.15 }}
        >
          <PillButton variant="light" onClick={openModal}>Start a Project</PillButton>
        </motion.div>
      </div>

      {/* Columns Grid */}
      <div className="py-[3.5rem] grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-[2.5rem]">
        
        {/* Brand */}
        <div className="max-w-[20rem]">
          <div className="flex items-center gap-[0.5rem] text-[1.125rem] font-medium uppercase tracking-[0.2em]">
            <TennisMark className="w-[1.25rem] h-[1.25rem]" />
            Collabsphere
          </div>
          <p className="mt-[1rem] text-[0.875rem] text-white/65">
            A creative engineering studio where focused architecture meets championship products.
          </p>
          <address className="mt-[1.5rem] not-italic text-[0.875rem] text-white/80 flex flex-col gap-1">
            <a href="mailto:hello@collabsphere.com" className="hover:text-white transition-colors">hello@collabsphere.com</a>
            <a href="tel:+12125550148" className="hover:text-white transition-colors">+1 (212) 555-0148</a>
            <span className="text-white/55 mt-1">120 Tech Lane, New York</span>
          </address>
        </div>

        {/* Links 1 */}
        <nav className="flex flex-col gap-[0.75rem]">
          <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/50 mb-[0.25rem]">Services</h3>
          <ul className="text-[0.875rem] text-white/80 space-y-[0.75rem]">
            <li><a href="#programs" className="hover:text-white transition-colors">Product Design</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Engineering</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">QA & Testing</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Consulting</a></li>
          </ul>
        </nav>

        {/* Links 2 */}
        <nav className="flex flex-col gap-[0.75rem]">
          <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/50 mb-[0.25rem]">Work</h3>
          <ul className="text-[0.875rem] text-white/80 space-y-[0.75rem]">
            <li><a href="#facilities" className="hover:text-white transition-colors">Case Studies</a></li>
            <li><a href="#facilities" className="hover:text-white transition-colors">Open Source</a></li>
            <li><a href="#facilities" className="hover:text-white transition-colors">Experiments</a></li>
          </ul>
        </nav>

        {/* Links 3 */}
        <nav className="flex flex-col gap-[0.75rem]">
          <h3 className="text-[0.75rem] font-medium uppercase tracking-[0.2em] text-white/50 mb-[0.25rem]">Company</h3>
          <ul className="text-[0.875rem] text-white/80 space-y-[0.75rem]">
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </nav>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15 pt-[2rem] text-[0.875rem] text-white/60 flex flex-col sm:flex-row justify-between items-center gap-[1.25rem]">
        <div>© 2026 Collabsphere. All rights reserved.</div>
        <div className="flex gap-[1.25rem]">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">X</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
        <div className="flex gap-[1.25rem]">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

    </footer>
  );
}
