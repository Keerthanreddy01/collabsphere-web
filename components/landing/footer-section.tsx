"use client";

import { motion } from "framer-motion";
import {
  Code,
  PenTool,
  Lightbulb,
  Cpu,
  Box,
  Twitter,
  Instagram,
  DiscIcon as Discord,
  Linkedin,
  Github,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const footerLinks = {
  Ecosystem: [
    { name: "Featured Builders", href: "#", internal: false },
    { name: "Community", href: "#", internal: false },
    { name: "Showcase", href: "#", internal: false },
    { name: "Licenses", href: "#", internal: false },
    { name: "Open Projects", href: "#", internal: false },
    { name: "Builder Rankings", href: "#", internal: false },
  ],
  Resources: [
    { name: "Documentation", href: "#", internal: false },
    { name: "Guides", href: "#", internal: false },
    { name: "Case Studies", href: "#", internal: false },
    { name: "Support", href: "#", internal: false },
    { name: "Blog", href: "#", internal: false },
    { name: "API Access", href: "#", internal: false },
  ],
  Company: [
    { name: "About Us", href: "#", internal: false },
    { name: "Careers", href: "#", internal: false },
    { name: "Contact", href: "#", internal: false },
    { name: "Privacy Policy", href: "#", internal: false },
    { name: "Terms", href: "#", internal: false },
    { name: "Security", href: "#", internal: false },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Discord", icon: Discord, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
];

function BuilderTree() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-end justify-center overflow-visible">
      {/* Central Glowing Core */}
      <div className="absolute bottom-0 w-32 h-32 bg-pink-500/20 rounded-full blur-[60px]" />

      {/* SVG Tree Structure */}
      <svg
        className="absolute bottom-0 w-full h-[400px] overflow-visible"
        viewBox="0 0 1000 400"
        fill="none"
      >
        {/* Branch 1: Left far (Developers) */}
        <motion.path
          d="M500 400 Q480 250 200 150"
          stroke="url(#branch-gradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Branch 2: Left near (Designers) */}
        <motion.path
          d="M500 400 Q490 300 350 100"
          stroke="url(#branch-gradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Branch 3: Center (Founders) */}
        <motion.path
          d="M500 400 Q500 200 500 80"
          stroke="url(#branch-gradient)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        />
        {/* Branch 4: Right near (AI Engineers) */}
        <motion.path
          d="M500 400 Q510 300 650 100"
          stroke="url(#branch-gradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
        />
        {/* Branch 5: Right far (Product Builders) */}
        <motion.path
          d="M500 400 Q520 250 800 150"
          stroke="url(#branch-gradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Energy Particles flowing along paths */}
        <motion.circle
          r="4"
          fill="#EC4899"
          style={{ filter: "drop-shadow(0 0 8px #EC4899)" }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 0,
          }}
          // We use style with motion to animate along path, but simpler approach:
          // A standard Framer Motion way to animate along a path requires SVG Path definitions.
        />

        <defs>
          <linearGradient id="branch-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7A5BFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Nodes (Icons) at the end of branches */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Developers */}
        <motion.div
          className="absolute left-[20%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            <Code className="w-6 h-6 text-pink-400" />
          </div>
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Developers</span>
        </motion.div>

        {/* Designers */}
        <motion.div
          className="absolute left-[35%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(122,91,255,0.3)]">
            <PenTool className="w-6 h-6 text-[#7A5BFF]" />
          </div>
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Designers</span>
        </motion.div>

        {/* Founders */}
        <motion.div
          className="absolute left-[50%] top-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(255,157,66,0.4)]">
            <Lightbulb className="w-7 h-7 text-[#FF9D42]" />
          </div>
          <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">Founders</span>
        </motion.div>

        {/* AI Engineers */}
        <motion.div
          className="absolute left-[65%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(66,239,255,0.3)]">
            <Cpu className="w-6 h-6 text-[#42EFFF]" />
          </div>
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">AI Engineers</span>
        </motion.div>

        {/* Product Builders */}
        <motion.div
          className="absolute left-[80%] top-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(205,255,61,0.3)]">
            <Box className="w-6 h-6 text-[#CDFF3D]" />
          </div>
          <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Product Builders</span>
        </motion.div>
      </div>
      
      {/* Floating Ambient Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-pink-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function FooterSection() {
  return (
    <footer className="relative bg-[#09090b] pt-32 pb-6 overflow-hidden border-t border-white/5">
      {/* Background Gradients & Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-gradient-to-t from-pink-900/20 via-purple-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_100%)] opacity-80" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col gap-24">
        
        {/* Centerpiece Visual: Builder Tree */}
        <BuilderTree />

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-t border-white/10 pt-16">
          
          {/* Column 1: Brand (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-3xl font-black tracking-tighter text-white">COLLABSPHERE<span className="text-pink-500">™</span></span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
              Find the perfect team for your business goals. No noise, just verified production history.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-5">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Ecosystem</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Ecosystem.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-medium transition-all duration-300 inline-block hover:-translate-y-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Resources</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-medium transition-all duration-300 inline-block hover:-translate-y-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-white font-bold tracking-wide uppercase text-sm">Company</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-medium transition-all duration-300 inline-block hover:-translate-y-0.5">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 mt-12 gap-6 relative">
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold">
            <span>© 2026 COLLABSPHERE™</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mx-1" />
            <span>Built by builders, for builders.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2 text-white/40 hover:text-white cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>

      {/* Giant Typography Section */}
      <div className="relative w-full overflow-hidden mt-12 flex justify-center pointer-events-none select-none">
        <h1 
          className="font-black text-[15vw] leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/0"
          style={{ 
            WebkitTextStroke: "1px rgba(255,255,255,0.03)",
            marginBottom: "-4vw" // Make it overflow out of the bottom for impact
          }}
        >
          COLLABSPHERE
        </h1>
      </div>
    </footer>
  );
}
