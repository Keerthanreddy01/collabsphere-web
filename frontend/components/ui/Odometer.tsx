"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, animate, useInView } from "framer-motion";

function DigitColumn({ digit }: { digit: string }) {
  if (isNaN(Number(digit))) {
    return (
      <span className="inline-block tabular-nums opacity-80 bg-gradient-to-b from-white to-[#3b82f6] text-transparent bg-clip-text">
        {digit}
      </span>
    );
  }

  return (
    <div className="relative inline-block overflow-hidden tabular-nums leading-none align-bottom h-[1em] w-[0.65em]">
      <motion.div
        className="absolute top-0 left-0 w-full flex flex-col items-center"
        initial={{ y: "0%" }}
        animate={{ y: `-${Number(digit) * 100}%` }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 1,
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="h-[1em] w-full flex items-center justify-center bg-gradient-to-b from-white to-[#3b82f6] text-transparent bg-clip-text"
          >
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Odometer({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  // Trigger earlier since this is a huge centerpiece
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView && value > 0) {
      animate(0, value, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
    }
  }, [value, isInView]);

  const valueStr = displayValue.toLocaleString();
  const chars = valueStr.split("");

  return (
    <div ref={ref} className="flex items-center justify-center drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">
      {chars.map((char, i) => (
        <DigitColumn key={`${chars.length - i}-${char === "," ? "comma" : "num"}`} digit={char} />
      ))}
    </div>
  );
}
