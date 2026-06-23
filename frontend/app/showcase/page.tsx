"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Rocket } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { getAllProjects, ProjectData } from "@/lib/projects";
import { useAuth } from "@/hooks/useAuth";

const projects = [
  {
    id: "01",
    name: "CYBER CORE",
    tagline: "Next-gen builder dashboard.",
    stack: ["Rust", "WASM", "React"],
    team: ["AMELIA_W", "MAX_P"],
    status: "SHIPPED",
    highlight: true,
    description: "A fully customisable builder command centre — track projects, team velocity, and ship logs in one interface.",
  },
  {
    id: "02",
    name: "NOVA PROTOCOL",
    tagline: "Cross-chain networking for devs.",
    stack: ["Go", "Solidity", "TypeScript"],
    team: ["S. RIVERS", "LIAM_T"],
    status: "LIVE",
    highlight: false,
    description: "Unified API layer for cross-chain data retrieval. Built in 3 weeks by a 2-person team from Collabsphere.",
  },
  {
    id: "03",
    name: "ORBITAL APP",
    tagline: "Real-time ship tracking protocol.",
    stack: ["Next.js", "WebSockets", "Postgres"],
    team: ["SYNE_K", "MIA_KH"],
    status: "BETA",
    highlight: false,
    description: "Track your shipping milestones in real time. Built in public, 340 GitHub stars in the first week.",
  },
  {
    id: "04",
    name: "SIGNAL MESH",
    tagline: "Encrypted peer-to-peer collab layer.",
    stack: ["Rust", "libp2p", "WASM"],
    team: ["MAX_P", "S. RIVERS"],
    status: "SHIPPED",
    highlight: false,
    description: "End-to-end encrypted collab rooms. No central server, no data leaks.",
  },
  {
    id: "05",
    name: "FORGE UI",
    tagline: "Design system for builder products.",
    stack: ["React", "TypeScript", "CSS"],
    team: ["AMELIA_W", "MIA_KH"],
    status: "OPEN SOURCE",
    highlight: false,
    description: "A minimal, dark-first component library built by designers who code. 180 components and growing.",
  },
  {
    id: "06",
    name: "DEPLOY.ZERO",
    tagline: "Zero-config infra for indie builders.",
    stack: ["Go", "Docker", "K8s"],
    team: ["LIAM_T", "NOVA_R"],
    status: "LIVE",
    highlight: false,
    description: "Ship your stack in under 5 minutes. No DevOps degree required.",
  },
];

const statusColors: Record<string, string> = {
  SHIPPED: "text-[#eca8d6] bg-[#eca8d6]/10",
  LIVE: "text-green-400 bg-green-400/10",
  BETA: "text-yellow-400 bg-yellow-400/10",
  "OPEN SOURCE": "text-blue-400 bg-blue-400/10",
};

export default function ShowcasePage() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fetchedProjects, setFetchedProjects] = useState<any[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await getAllProjects();
      if (data && data.length > 0) {
        setFetchedProjects(data);
      }
    }
    loadProjects();
  }, []);

  const displayProjects = fetchedProjects.length > 0 ? fetchedProjects : projects;

  return (
    <div className="flex justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden selection:bg-white/30 relative">
      <div className="flex w-full max-w-[1250px] min-h-screen relative">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 min-h-screen overflow-y-visible relative min-w-0">
          <div className="w-full max-w-[900px] mx-auto border-r border-l border-gray-200 dark:border-white/[0.06] bg-white dark:bg-black min-h-screen">
        {/* Nav */}
        <nav className="sticky top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-white dark:bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Rocket className="w-5 h-5 text-black dark:text-white" />
            </button>
            <span className="text-sm font-mono">COLLABSPHERE™</span>
          </div>
          <span className="text-xs font-mono text-black dark:text-white/30 tracking-widest">PROJECT SHOWCASE</span>
        </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-3 text-sm font-mono text-black dark:text-white/40 mb-8">
            <span className="w-12 h-px bg-black/20 dark:bg-white/20" />
            PRODUCING IMPACT.
          </span>
          <h1 className="text-7xl md:text-[10rem] lg:text-[160px] font-display tracking-tight leading-[0.85] mb-8">
            BUILT
            <br />
            <span className="text-black dark:text-white/20">HERE.</span>
          </h1>
          <p className="text-xl text-black dark:text-white/50 max-w-lg leading-relaxed">
            Real projects. Real teams. Real impact. Every project here was built by a team that found each other on Collabsphere.
          </p>
        </div>
      </section>

      {/* Featured project */}
      <section className="px-6 lg:px-12 pb-12 max-w-[1400px] mx-auto">
        <div
          className={`relative p-12 lg:p-16 border border-gray-200 dark:border-white/20 bg-white/[0.03] overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Background number */}
          <span className="absolute right-8 top-8 text-[200px] font-display text-black dark:text-white/[0.03] leading-none select-none pointer-events-none">
            01
          </span>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 ${statusColors[projects[0].status]} mb-4 inline-block`}>
                  {projects[0].status}
                </span>
                <h2 className="text-5xl lg:text-7xl font-display mt-4">{projects[0].name}</h2>
                <p className="text-xl text-black dark:text-white/50 mt-2">{projects[0].tagline}</p>
              </div>
              <div className="w-12 h-12 border border-gray-200 dark:border-white/20 flex items-center justify-center hover:border-black/20 dark:border-white hover:bg-white hover:text-white dark:text-black transition-all duration-300 cursor-pointer">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-black dark:text-white/60 max-w-2xl leading-relaxed mb-10 text-lg">{displayProjects[0].description}</p>
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-wrap gap-2">
                {(displayProjects[0].stack || []).map((s: string) => (
                  <span key={s} className="text-xs font-mono px-3 py-1.5 border border-gray-200 dark:border-white/10 text-black dark:text-white/40">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-black dark:text-white/40 font-mono">
                <span>BUILT BY</span>
                {(displayProjects[0].team || []).map((t: string) => (
                  <span key={t} className="text-black dark:text-white/70">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of projects */}
      <section className="px-6 lg:px-12 pb-40 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.slice(1).map((project: any, i: number) => (
            <div
              key={project.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative p-8 border overflow-hidden transition-all duration-500 cursor-default ${
                hovered === i ? "border-gray-200 dark:border-white/30 bg-white/[0.04]" : "border-gray-200 dark:border-white/10"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 80 + 300}ms` }}
            >
              <span className="absolute right-4 top-4 text-[80px] font-display text-black dark:text-white/[0.04] leading-none select-none">
                {project.id}
              </span>
              <div className="relative z-10">
                <span className={`text-[10px] font-mono px-2 py-0.5 ${statusColors[project.status]} mb-4 inline-block`}>
                  {project.status}
                </span>
                <h3 className="text-3xl font-display mt-2 mb-1">{project.name}</h3>
                <p className="text-sm text-black dark:text-white/40 mb-4">{project.tagline}</p>
                <p className="text-sm text-black dark:text-white/50 leading-relaxed mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.stack || []).map((s: string) => (
                    <span key={s} className="text-[10px] font-mono px-2 py-0.5 border border-gray-200 dark:border-white/10 text-black dark:text-white/30">{s}</span>
                  ))}
                </div>
                <div className="text-xs text-black dark:text-white/30 font-mono pt-4 border-t border-gray-200 dark:border-white/10">
                  {(project.team || []).join(" × ")}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-white transition-transform duration-500 origin-left ${
                hovered === i ? "scale-x-100" : "scale-x-0"
              }`} />
            </div>
          ))}
        </div>

        <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-black dark:text-white/30 text-sm font-mono mb-6">180+ projects shipped and counting</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-3 px-8 py-4 border border-gray-200 dark:border-white/20 text-sm font-mono hover:border-black/20 dark:border-white hover:bg-white hover:text-white dark:text-black transition-all duration-300 group"
          >
            START YOUR PROJECT
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>
          </div>
        </main>
      </div>
    </div>
  );
}
