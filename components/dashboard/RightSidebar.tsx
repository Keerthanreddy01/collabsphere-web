"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, query, limit, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserProjects } from "@/lib/projects";
import { ChevronRight, Circle, Settings2, SquarePlus, Smartphone, Store, WandSparkles, BookOpen, Rocket, Globe, Terminal, Layout, Cpu } from "lucide-react";

type Builder = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  tagline: string;
};

type Project = {
  id: string;
  name?: string;
  description?: string;
  tech_stack?: string[] | string;
  created_at?: string;
};

function getProjectInitials(name?: string) {
  if (!name) return "PR";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("") || "PR";
}

export default function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [suggestedUsers, setSuggestedUsers] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "builder_profiles"), limit(5));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username || doc.data().email?.split('@')[0] || "user",
          name: doc.data().full_name || "Builder",
          avatar: doc.data().avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + doc.id,
          tagline: doc.data().availability || "Building in public",
        }));
        // Filter out current user if logged in
        setSuggestedUsers(users.filter(u => u.id !== user?.uid));
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.uid) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      try {
        const { data } = await getUserProjects(user.uid);
        setProjects((data || []).slice(0, 3) as Project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <aside className="hidden xl:flex fixed right-4 top-4 bottom-4 w-[284px] flex-col gap-3 rounded-[28px] border border-white/10 bg-black/95 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">

      {/* ── Scrollable upper area ── */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar min-h-0">

        {/* Profile */}
        <section className="rounded-[20px] border border-white/10 bg-white/[0.05] p-3 transition duration-200 hover:border-white/15 hover:bg-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 rounded-full border border-white/10 bg-white/5 p-[2px]">
              <img
                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=krixee"}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold leading-tight text-white">{user?.displayName || user?.email?.split('@')[0] || "Krixeee"}</div>
              <div className="truncate text-[12px] text-[#A8A8A8]">{user?.email?.split('@')[0] || "krixeee"}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <Circle className="size-2 fill-current" />
                Online
              </div>
            </div>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10" title="Profile settings">
              <Settings2 className="size-4" />
            </button>
          </div>
        </section>

        {/* My Projects */}
        <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06] flex-shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold tracking-wide text-[#D5D5D5]">My Projects</h3>
            <span className="text-[11px] text-[#777]">{loadingProjects ? "Loading" : `${projects.length} active`}</span>
          </div>
          {loadingProjects ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-[60px] animate-pulse rounded-[12px] border border-white/8 bg-white/5" />
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-2">
              {projects.slice(0, 2).map((project, index) => (
                <div key={project.id} className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/25 text-[12px] font-black text-white">
                    {getProjectInitials(project.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-white">{project.name || "Untitled Project"}</div>
                    <div className="truncate text-[11px] text-[#A8A8A8]">{project.description || "In progress"}</div>
                  </div>
                  <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    {index === 0 ? "Live" : "Building"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[14px] border border-dashed border-white/10 bg-white/[0.03] p-3 text-left">
              <div className="text-[12px] font-semibold text-white">No active projects</div>
              <div className="text-[11px] text-[#A8A8A8]">Create your first project</div>
              <button
                onClick={() => router.push('/projects')}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-black transition hover:scale-[1.02]"
              >
                <SquarePlus className="size-3" />
                Create Project
              </button>
            </div>
          )}
        </section>

        {/* Suggested Builders */}
        <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06] flex-shrink-0">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold tracking-wide text-[#D5D5D5]">Suggested Builders</h3>
            <button className="text-[11px] font-semibold text-[#A8A8A8] transition hover:text-white">See all</button>
          </div>
          <div>
            {loadingUsers ? (
              <div className="py-2 text-[12px] text-[#A8A8A8]">Loading suggestions...</div>
            ) : suggestedUsers.length > 0 ? (
              suggestedUsers.slice(0, 3).map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-2">
                  <img src={u.avatar} alt={u.username} className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-white">{u.username}</div>
                    <div className="truncate text-[11px] text-[#A8A8A8]">{u.tagline}</div>
                  </div>
                  <button className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-white/[0.09]">
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <div className="py-2 text-[12px] text-[#A8A8A8]">No suggestions right now.</div>
            )}
          </div>
        </section>

      </div>

      {/* ── Premium Poster Card ── */}
      <section className="group relative flex-shrink-0 overflow-hidden rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.4)] border border-white/10 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:border-white/20">
        
        {/* Premium Aurora Background */}
        <div className="absolute inset-0 bg-[#030303]" />
        
        {/* Aurora Gradients */}
        <div className="absolute inset-0 overflow-hidden opacity-50 group-hover:opacity-75 transition-opacity duration-[1500ms] mix-blend-screen">
          <div className="absolute inset-[-60%] bg-[conic-gradient(from_0deg_at_50%_50%,#3b82f6_0deg,#a855f7_120deg,#06b6d4_240deg,#3b82f6_360deg)] blur-[60px] animate-[spin_12s_linear_infinite] opacity-40" />
          <div className="absolute inset-[-60%] bg-[conic-gradient(from_180deg_at_50%_50%,#10b981_0deg,#6366f1_120deg,#ec4899_240deg,#10b981_360deg)] blur-[80px] animate-[spin_18s_linear_infinite_reverse] opacity-30" />
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE5IDE5SDBWMGgxOXYxOXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50" />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start h-full">
          {/* Header/Logo Area */}
          <div className="flex items-center gap-2 mb-6 opacity-80">
            <Globe className="size-4 text-white" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/90">
              CollabSphere
            </span>
          </div>

          {/* Typography */}
          <h4 className="text-[22px] font-bold leading-[1.1] text-white tracking-tight mb-3">
            Build together.<br />
            Ship faster.
          </h4>
          
          <p className="text-[13px] font-medium text-white/60 leading-relaxed mb-6 max-w-[90%]">
            Join builders, developers, designers and creators.
          </p>

          {/* Floating Community Icons (Decorative) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-20 group-hover:opacity-40 transition-opacity duration-700 blur-[1px]">
             <div className="w-6 h-6 rounded-lg bg-white/10 rotate-12 flex items-center justify-center backdrop-blur-md">
               <Terminal className="size-3 text-white" />
             </div>
             <div className="w-5 h-5 rounded-lg bg-white/10 -rotate-6 flex items-center justify-center backdrop-blur-md -ml-3">
               <Layout className="size-2.5 text-white" />
             </div>
             <div className="w-7 h-7 rounded-lg bg-white/10 rotate-6 flex items-center justify-center backdrop-blur-md ml-2">
               <Cpu className="size-3.5 text-white" />
             </div>
          </div>

          {/* CTA Button */}
          <button className="mt-auto relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white h-[40px] px-6 text-[13px] font-bold text-black transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_24px_rgba(255,255,255,0.1)]">
            <Smartphone className="size-4" />
            Download App
          </button>
        </div>
      </section>

    </aside>
  );
}
