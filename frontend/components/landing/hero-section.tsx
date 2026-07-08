"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Animate Text
    tl.fromTo(
      textRef.current?.children as unknown as Element[],
      { y: 50, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.15 },
      0.2
    );

    // Animate Cards
    tl.fromTo(
      cardsRef.current?.children as unknown as Element[],
      { y: 200, opacity: 0, rotation: (i) => [-6, 2, -3, 5][i] * 2 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, rotation: (i) => [-6, 2, -3, 5][i] },
      0.4
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-[#FDF8F0] overflow-hidden flex flex-col font-sans select-none">
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-50">
        <Link href="/" className="font-anton tracking-tight text-3xl text-black uppercase hover:text-neutral-600 transition-colors">
          CollabSphere
        </Link>
        <div className="hidden md:flex items-center gap-8 bg-white rounded-full px-8 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-neutral-100">
          <Link href="#features" className="text-sm font-bold text-neutral-800 hover:text-black">Features</Link>
          <Link href="#projects" className="text-sm font-bold text-neutral-800 hover:text-black">Projects</Link>
          <Link href="#community" className="text-sm font-bold text-neutral-800 hover:text-black">Community</Link>
          <Link href="#about" className="text-sm font-bold text-neutral-800 hover:text-black">About</Link>
        </div>
        <Link href="/pre-register" className="bg-[#F8B4D9] text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-[#f39bc9] transition-colors flex items-center gap-2 shadow-sm">
          Join Waitlist <span className="text-lg">🔥</span>
        </Link>
      </header>

      {/* Hero Content */}
      <div ref={textRef} className="relative z-40 flex flex-col items-start px-6 md:px-12 mt-12 md:mt-16 max-w-5xl pointer-events-none">
        <h1 className="font-sans font-extrabold text-[#111111] leading-[1.05] tracking-tight text-6xl md:text-[6.5rem]">
          Where Builders. <br />
          Connect. <br />
          Ship Faster.
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-neutral-700 font-medium max-w-2xl">
          Tired of building side projects alone? Find your next co-builder and ship incredible products together.
        </p>
      </div>

      {/* Staggered Cards */}
      <div ref={cardsRef} className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[120%] h-[500px] flex items-end justify-center gap-4 md:gap-6 z-20 pointer-events-auto">
        
        {/* Card 1: Blue Stats */}
        <div className="w-[280px] md:w-[320px] h-[350px] bg-[#007BFF] rounded-[40px] flex items-start justify-start p-8 shrink-0 rotate-[-6deg] hover:-translate-y-4 hover:rotate-[-4deg] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer">
          <span className="text-6xl md:text-7xl font-extrabold text-black tracking-tight">10K+</span>
        </div>

        {/* Card 2: Image 1 */}
        <div className="w-[300px] md:w-[360px] h-[400px] bg-neutral-200 rounded-[40px] flex items-start justify-start overflow-hidden shrink-0 rotate-[2deg] hover:-translate-y-4 hover:rotate-[0deg] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer relative">
          <Image src="/poster.jpeg" alt="Builder" fill className="object-cover" />
        </div>

        {/* Card 3: Green Stats */}
        <div className="w-[280px] md:w-[320px] h-[450px] bg-[#20C997] rounded-[40px] flex items-start justify-start p-8 shrink-0 rotate-[-3deg] hover:-translate-y-4 hover:rotate-[-1deg] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer">
          <span className="text-6xl md:text-7xl font-extrabold text-black tracking-tight">500+</span>
        </div>

        {/* Card 4: Image 2 */}
        <div className="w-[340px] md:w-[420px] h-[480px] bg-neutral-800 rounded-[40px] flex items-start justify-start overflow-hidden shrink-0 rotate-[5deg] hover:-translate-y-4 hover:rotate-[3deg] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer relative">
           <Image src="/landing/keyboard.png" alt="Workspace" fill className="object-cover opacity-90" />
        </div>

      </div>

      {/* Floating Action button (Green like in the screenshot) */}
      <a href="#" className="fixed bottom-8 right-8 z-50 group">
         <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] group-hover:scale-110 transition-transform cursor-pointer">
           <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-2.639-1.136-4.331-4.136-4.463-4.312-.132-.177-1.066-1.417-1.066-2.703 0-1.287.673-1.918.918-2.167.245-.25.534-.312.711-.312.178 0 .356.001.511.008.156.007.368-.061.575.437.207.498.711 1.737.775 1.865.064.127.106.275.018.453-.089.178-.133.289-.266.444-.132.155-.279.336-.395.449-.133.129-.272.271-.122.529.15.258.673 1.111 1.444 1.802.996.892 1.848 1.176 2.1 1.299.252.124.398.106.549-.063.151-.168.65-0.751.828-1.009.178-.258.356-.215.589-.129.233.086 1.472.694 1.724.821.252.127.42.189.481.294.062.106.062.613-.082 1.018z"/>
           </svg>
         </div>
      </a>

    </section>
  );
}
