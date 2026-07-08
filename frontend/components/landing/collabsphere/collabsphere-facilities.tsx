"use client";

import { motion } from "framer-motion";

export function CollabsphereFacilities() {
  const bodyText = "Explore our selected case studies — engineered for performance, designed for conversion, and built to scale with your ambition.".split(" ");

  const cards = [
    {
      img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/1.webp",
      title: "Orbit Platform",
      desc: "A social platform tuned for heavy real-time traffic.",
      theme: "bg-[#0f2f63]/40" // navy tint
    },
    {
      img: "https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/4.webp",
      title: "Elevate Identity",
      desc: "A brand refresh that drives startup momentum.",
      theme: "bg-[#0b6e97]/55", // teal tint
      mb: true
    }
  ];

  return (
    <section 
      id="facilities" 
      className="bg-[var(--background)] rounded-[var(--radius-card-lg)] -mt-[2.5rem] px-[1.5rem] pt-[4rem] pb-[5rem] sm:px-[2.5rem] sm:pt-[4rem] sm:pb-[5rem] relative z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-[2.5rem]">
        
        {/* Intro Column */}
        <div className="max-w-[24rem]">
          <motion.img 
            src="https://api.getlayers.ai/storage/v1/object/public/public/assets/baseline-88535e4000/3.webp"
            alt=""
            className="w-[4rem] h-[4rem] rounded-[var(--radius-card)] object-cover"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
          />

          <h2 className="mt-[1.5rem] text-[3rem] font-medium leading-[0.95] tracking-tight text-[var(--ink)]">
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              >
                Tour Our
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
                Selected
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span
                className="block"
                initial={{ y: "115%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
              >
                Work
              </motion.span>
            </span>
          </h2>

          <p className="mt-[1.5rem] max-w-[20rem] text-[0.875rem] text-[var(--ink-soft)] flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]">
            {bodyText.map((word, i) => (
              <span key={i} className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: 18, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, ease: [0.165, 0.84, 0.44, 1], delay: 0.25 + (i * 0.028) }} // easeOutQuart
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </div>

        {/* Cards */}
        <div className="flex items-end gap-[1.25rem]">
          {cards.map((card, i) => (
            <motion.figure
              key={i}
              className={`flex-1 relative aspect-[3/4] rounded-[var(--radius-card)] bg-[var(--surface)] overflow-hidden cursor-pointer ${card.mb ? 'mb-[2rem]' : ''}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 180, damping: 26, delay: i * 0.14 }}
              whileHover="hover"
            >
              <motion.img 
                src={card.img} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover"
                variants={{ hover: { scale: 1.03 } }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              />
              <div className={`absolute inset-x-3 bottom-3 rounded-[var(--radius-xl)] ${card.theme} backdrop-blur p-[0.75rem] px-[1rem] text-white`}>
                <div className="text-[0.875rem] font-medium">{card.title}</div>
                <div className="text-[0.65rem] opacity-85 mt-1">{card.desc}</div>
              </div>
            </motion.figure>
          ))}
        </div>

      </div>
    </section>
  );
}
