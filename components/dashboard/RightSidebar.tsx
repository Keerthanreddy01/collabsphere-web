"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, query, limit, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserProjects } from "@/lib/projects";
import { ChevronRight, Circle, Settings2, SquarePlus, Smartphone, Store, WandSparkles } from "lucide-react";

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
    <aside className="hidden xl:flex fixed right-4 top-4 bottom-4 w-[284px] flex-col gap-6 overflow-y-auto rounded-[28px] border border-white/10 bg-black/95 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] no-scrollbar">
      <section className="rounded-[20px] border border-white/10 bg-white/[0.05] p-3 transition duration-200 hover:border-white/15 hover:bg-white/[0.07]">
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

      <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold tracking-wide text-[#D5D5D5]">My Projects</h3>
          <span className="text-[11px] text-[#777]">{loadingProjects ? "Loading" : `${projects.length} active`}</span>
        </div>

        {loadingProjects ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-[88px] animate-pulse rounded-[12px] border border-white/8 bg-white/5" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-3">
            {projects.slice(0, 3).map((project, index) => (
              <div
                key={project.id}
                className="group flex items-center gap-3 rounded-[12px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-3 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/25 text-[13px] font-black text-white shadow-inner">
                  {getProjectInitials(project.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-white">{project.name || "Untitled Project"}</div>
                      <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#A8A8A8]">
                        {project.description || "A project in progress."}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                      {index === 0 ? "Live" : index === 1 ? "Building" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-white/10 bg-white/[0.03] p-4 text-left">
            <div className="text-[13px] font-semibold text-white">No active projects</div>
            <div className="mt-1 text-[12px] leading-snug text-[#A8A8A8]">Create your first project</div>
            <button
              onClick={() => router.push('/projects')}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:scale-[1.02]"
            >
              <SquarePlus className="size-4" />
              Create Project
            </button>
          </div>
        )}
      </section>

      <section className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-white/15 hover:bg-white/[0.06]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold tracking-wide text-[#D5D5D5]">Suggested Builders</h3>
          <button className="text-[11px] font-semibold text-[#A8A8A8] transition hover:text-white">See all</button>
        </div>

        <div className="space-y-0">
          {loadingUsers ? (
            <div className="py-3 text-[12px] text-[#A8A8A8]">Loading suggestions...</div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-3">
                <img src={u.avatar} alt={u.username} className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-white">{u.username}</div>
                  <div className="truncate text-[11px] text-[#A8A8A8]">{u.tagline}</div>
                </div>
                <button className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/[0.09]">
                  Follow
                </button>
              </div>
            ))
          ) : (
            <div className="py-3 text-[12px] text-[#A8A8A8]">No suggestions right now.</div>
          )}
        </div>
      </section>

      <section className="mt-auto rounded-[18px] border border-violet-400/20 bg-gradient-to-br from-[#1e0a3c] to-[#0f172a] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-400/20">
            <Smartphone className="size-4 text-violet-300" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white leading-tight">Get the CollabSphere App</div>
            <div className="text-[11px] text-white/50 leading-tight">Collaborate anywhere</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11px] font-bold text-black transition hover:bg-gray-100">
            <Store className="size-3" />
            App Store
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-white/20">
            <WandSparkles className="size-3" />
            Google Play
          </button>
        </div>
      </section>

      <div className="pb-1 pt-1 text-[11px] leading-relaxed text-[#737373]">
        <span>© 2026 COLLABSPHERE</span>
      </div>

    </aside>
  );
}
