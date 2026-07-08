"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "./collabsphere-shared";

export function CollabsphereTestimonials() {
  const testimonials = [
    {
      quote: "I added a level to our tech stack in one season. The engineering is detailed and it actually scales.",
      name: "Priya Anand",
      role: "CTO, Orbit"
    },
    {
      quote: "Best systems in the city and a team that treats every product like a top priority.",
      name: "Lukas Brenner",
      role: "Founder, DashQ"
    },
    {
      quote: "Our platform went from MVP to industry leader. Worth every minute of collaboration.",
      name: "Dana Okafor",
      role: "Product VP, Elevate"
    }
  ];

  return (
    <section id="testimonials" className="bg-[var(--background)] px-[1.5rem] py-[5rem] sm:px-[2.5rem] sm:py-[6rem]">
      
      <Eyebrow text="What clients say" tone="dark" />
      <h2 className="mt-[1rem] text-[3rem] font-medium leading-[0.95] tracking-tight text-[var(--ink)]">
        <span className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className="block"
            initial={{ y: "115%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            Loved by
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
            the industry
          </motion.span>
        </span>
      </h2>

      <ul className="mt-[3.5rem] grid grid-cols-1 md:grid-cols-3 gap-[1.25rem]">
        {testimonials.map((test, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 180, damping: 26, delay: i * 0.12 }}
            className="h-full"
          >
            <motion.article 
              className="flex flex-col justify-between h-full rounded-[var(--radius-card)] bg-[var(--surface)] p-[1.75rem]"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <div>
                <div className="text-[2.25rem] text-[var(--brand)] leading-none font-serif">"</div>
                <blockquote className="mt-[1rem] text-[1.125rem] leading-relaxed text-[var(--ink)]">
                  {test.quote}
                </blockquote>
              </div>
              <figcaption className="mt-[1.5rem] pt-[1rem] border-t border-[var(--hairline)]">
                <div className="font-medium text-[var(--ink)]">{test.name}</div>
                <div className="text-[0.875rem] text-[var(--ink-soft)]">{test.role}</div>
              </figcaption>
            </motion.article>
          </motion.li>
        ))}
      </ul>

    </section>
  );
}
