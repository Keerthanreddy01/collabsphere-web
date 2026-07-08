"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const works = [
  { name: "Tencent", id: "tencent" },
  { name: "Zam", id: "zam" },
  { name: "PBX: Executioners", id: "pbx" },
  { name: "eBill", id: "ebill" }
];

export function CollabsphereWorkAbout() {
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);

  return (
    <section className="relative w-full bg-[#0a0a0a] text-white py-24 sm:py-32 overflow-hidden font-sans">
      
      {/* Top Banner (Motion Designer style) */}
      <div className="w-full border-y border-white/10 py-4 flex items-center overflow-hidden bg-[#121212]">
        <motion.div 
          className="flex gap-16 items-center whitespace-nowrap text-sm uppercase tracking-widest text-white/50"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {Array(8).fill("✦ Collabsphere 📍 New York").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Centerpiece 3D Illustration Mockup */}
      <div className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[600px] mt-16 sm:mt-24 mb-24 flex items-center justify-center">
        {/* Glowing backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
        
        {/* Placeholder image for the floating blue book / asset */}
        <motion.img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop"
          alt="3D abstract centerpiece"
          className="relative z-10 w-[60%] h-auto object-contain drop-shadow-2xl mix-blend-screen opacity-90 rounded-[3rem]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Lists Section */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col gap-32">
        
        {/* Work List */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-24">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter lowercase w-48 shrink-0">work</h2>
          
          <div className="flex-1 flex flex-col border-t border-white/10">
            {works.map((work, idx) => (
              <a
                key={work.id}
                href={`#${work.id}`}
                className="group relative flex items-center justify-between py-6 sm:py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors"
                onMouseEnter={() => setHoveredWork(work.id)}
                onMouseLeave={() => setHoveredWork(null)}
              >
                <span className="text-xl sm:text-2xl font-light tracking-wide">{work.name}</span>
                
                <motion.div
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center overflow-hidden relative bg-[#121212]"
                  initial={false}
                  animate={{ scale: hoveredWork === work.id ? 1.1 : 1, borderColor: hoveredWork === work.id ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                >
                  <ArrowUpRight className="w-5 h-5 absolute transition-transform duration-300 group-hover:translate-x-10 group-hover:-translate-y-10" />
                  <ArrowUpRight className="w-5 h-5 absolute -translate-x-10 translate-y-10 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                </motion.div>
              </a>
            ))}
          </div>
        </div>

        {/* About Hook */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-24 items-start">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tighter lowercase w-48 shrink-0">about</h2>
          <div className="flex-1">
            <p className="text-xl sm:text-3xl font-light text-white/70 leading-relaxed max-w-2xl">
              We are a collective of builders, engineers, and designers obsessed with crafting the next generation of digital products. We don't just build software, we engineer culture.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
