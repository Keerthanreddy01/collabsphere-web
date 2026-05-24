"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getAllProjects } from "@/lib/projects";
import { Folder, Search, Plus, ArrowLeft, ExternalLink, Calendar, Code } from "lucide-react";

type Project = {
  id?: string;
  name?: string;
  description?: string;
  tech_stack?: string[] | string;
  uid?: string;
  created_at?: string;
  demo_url?: string;
  github_url?: string;
  author_name?: string;
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await getAllProjects();
        if (!error && data) {
          setProjects(data as Project[]);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      if (!query) return true;
      const tech = Array.isArray(project.tech_stack) 
        ? project.tech_stack.join(" ") 
        : (project.tech_stack ?? "");
      const haystack = [
        project.name ?? "",
        project.description ?? "",
        tech,
        project.author_name ?? ""
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [projects, search]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E5EEFF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A5BFF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3FF] via-[#F4F7FF] to-[#FCFDFF] text-[#1D1E22] antialiased font-sans relative pb-12 overflow-x-hidden">
      {/* Background patterns */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(#7A5BFF 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-[#7A5BFF]/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/home")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="space-y-1 text-left">
              <h1 className="text-3xl font-black text-black tracking-tight font-sans uppercase">
                SHIPPED PROJECTS
              </h1>
              <p className="text-xs font-bold text-gray-500 tracking-wide uppercase">
                Browse innovative products shipped by builders
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard/home")}
            className="inline-flex items-center gap-1.5 bg-[#121315] hover:bg-black text-[#CDFF3D] px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ship Yours</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search projects by name, stack, or builders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200/80 pl-11 pr-5 py-3 rounded-2xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A5BFF]/30 transition-all shadow-sm"
          />
        </div>

        {/* Grid content */}
        <div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-3xl border border-white/50 bg-white/70 p-6 shadow-sm flex flex-col justify-between h-48"
                >
                  <div className="space-y-3">
                    <div className="h-5 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                  </div>
                  <div className="h-6 w-24 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-white/50 bg-white/50 p-12 text-center shadow-sm backdrop-blur-md">
              <Folder className="w-12 h-12 text-[#7A5BFF]/40 mx-auto mb-4" />
              <h3 className="text-base font-black text-black">No projects found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Be the first to share your project with the community! Go to the home page feed and ship your first log.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const stack = Array.isArray(project.tech_stack)
                  ? project.tech_stack
                  : typeof project.tech_stack === "string"
                  ? project.tech_stack.split(",").map((s) => s.trim())
                  : [];
                const formattedDate = project.created_at
                  ? new Date(project.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently";

                return (
                  <div
                    key={project.id}
                    className="group rounded-3xl border border-white/60 bg-white/70 hover:bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_rgba(122,91,255,0.05)] transition-all duration-300 flex flex-col justify-between h-[230px] text-left relative overflow-hidden backdrop-blur-sm hover:scale-[1.01]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-black text-black tracking-tight group-hover:text-[#7A5BFF] transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-[#7A5BFF] transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-3 mt-2 leading-relaxed font-medium">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-100/50 mt-auto">
                      {/* Tech Stack tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#E9E7FF]/60 text-[#7A5BFF] text-[9px] font-bold"
                          >
                            <Code className="w-2 h-2" />
                            {tech}
                          </span>
                        ))}
                        {stack.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500 text-[9px] font-bold">
                            +{stack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-400">
                        <span className="truncate max-w-[65%]">
                          By: {project.author_name || "Anonymous Builder"}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-2.5 h-2.5" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
