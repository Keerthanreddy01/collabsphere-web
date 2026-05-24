"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProfiles } from "@/lib/profiles";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type BuilderProfile = {
  id?: string;
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  stack?: string[] | null;
  availability?: string | null;
  avatar_url?: string | null;
};

const filters = [
  "All",
  "Open to Collab",
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Design",
];

export default function BuildersPage() {
  const router = useRouter();
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBuilders = async () => {
      const { data, error } = await getAllProfiles();

      if (!isMounted) {
        return;
      }

      if (!error && data) {
        const filtered = data
          .filter((p: any) => p.username !== null && p.username !== undefined)
          .sort((a: any, b: any) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
        setBuilders(filtered as BuilderProfile[]);
      }
      setIsLoading(false);
    };

    loadBuilders();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBuilders = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = builders.filter((builder) => {
      if (!query) {
        return true;
      }
      const skills = (builder.skills ?? []).join(" ").toLowerCase();
      const haystack = [
        builder.full_name ?? "",
        builder.username ?? "",
        builder.bio ?? "",
        skills,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    if (activeFilter !== "All") {
      if (activeFilter === "Open to Collab") {
        result = result.filter((builder) =>
          (builder.availability ?? "").toLowerCase().includes("open")
        );
      } else {
        const filterTerm = activeFilter.toLowerCase();
        result = result.filter((builder) =>
          (builder.skills ?? []).some((skill) =>
            skill.toLowerCase().includes(filterTerm)
          )
        );
      }
    }

    return result;
  }, [builders, search, activeFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 relative pb-12 overflow-x-hidden">
      
      {/* Subtle dot grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.5]"
        style={{
          backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-12 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col gap-6 text-left">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">
              FIND YOUR CO-FOUNDERS.
            </h1>
            <p className="text-sm text-gray-500 font-medium">Browse verified builders in Collabsphere.</p>
          </div>
          
          {/* Hero Gradient Bar */}
          <div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-2" />

          {/* Search Wrapper with animated focus rings */}
          <div className="flex flex-col gap-4">
            <div className={`flex items-center gap-3 bg-white border rounded-2xl px-5 py-3.5 shadow-sm transition-all duration-200 ${
              isSearchFocused 
                ? "border-pink-400 ring-2 ring-pink-100" 
                : "border-gray-200"
            }`}>
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search builders by name, username, bio, skills..."
                className="w-full border-none outline-none text-sm bg-transparent placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* Premium Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition-all border ${
                      isActive
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Builder list timeline */}
        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-14 w-14 rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-2/3 rounded bg-gray-200" />
                      <div className="h-3 w-1/3 rounded bg-gray-150" />
                    </div>
                  </div>
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-5 w-12 rounded bg-gray-150" />
                    <div className="h-5 w-16 rounded bg-gray-150" />
                  </div>
                  <div className="h-9 w-full rounded-xl bg-gray-200 mt-2" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredBuilders.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto space-y-4 my-8">
              <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-gray-900">No builders found yet.</h4>
                <p className="text-xs text-gray-500 leading-normal font-medium">Complete your profile onboarding to appear on the founders dashboard!</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/dashboard/home")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1 text-xs"
              >
                <span>Complete Profile</span>
                <span>→</span>
              </button>
            </div>
          )}

          {!isLoading && filteredBuilders.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBuilders.map((builder) => {
                const skills = builder.skills ?? [];
                const stack = builder.stack ?? [];
                const isOpen = (builder.availability ?? "")
                  .toLowerCase()
                  .includes("open");
                const initials = (builder.full_name ?? "Builder")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={builder.id ?? builder.username ?? builder.full_name}
                    className="bg-white rounded-2xl p-6 border border-[#e5e7eb] hover:shadow-lg hover:border-pink-200 hover:-translate-y-[2px] transition-all duration-200 ease-in-out flex flex-col justify-between text-left"
                  >
                    <div>
                      {/* Top profile card header */}
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-full border border-white shadow-sm ring-2 ring-offset-2 ring-pink-500/30 shrink-0">
                          {builder.avatar_url ? (
                            <img
                              src={builder.avatar_url}
                              alt={builder.full_name ?? "Builder"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold bg-gray-100 text-gray-500">
                              {initials}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg font-bold text-gray-900 truncate leading-tight">
                            {builder.full_name ?? "Builder"}
                          </div>
                          <div className="text-sm text-gray-400 mt-0.5 truncate font-medium">
                            @{builder.username ?? "builder"}
                          </div>
                        </div>
                      </div>

                      {/* Availability badge info */}
                      <div className="mt-3.5 flex items-center">
                        {isOpen ? (
                          <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex items-center gap-1.5 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                            <span>Open to Collab</span>
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex items-center gap-1.5 select-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span>Busy</span>
                          </span>
                        )}
                      </div>

                      {/* Builder Bio */}
                      <p 
                        className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-2 h-10 overflow-hidden text-ellipsis font-medium"
                        style={{ minHeight: '40px' }}
                      >
                        {builder.bio ?? "No bio shared yet."}
                      </p>

                      {/* Skills tags */}
                      {skills.length > 0 && (
                        <div className="mt-4 text-left">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2.5 py-0.5 text-xs font-medium select-none"
                              >
                                {skill}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2 py-0.5 text-[10px] font-bold select-none">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stack tags */}
                      {stack.length > 0 && (
                        <div className="mt-3 text-left">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Stack</span>
                          <div className="flex flex-wrap gap-1.5">
                            {stack.slice(0, 3).map((item) => (
                              <span
                                key={item}
                                className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium select-none"
                              >
                                {item}
                              </span>
                            ))}
                            {stack.length > 3 && (
                              <span className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 text-[10px] font-bold select-none">
                                +{stack.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push(`/builders`)}
                      className="mt-6 w-full border-[1.5px] border-[#e5e7eb] text-gray-700 font-semibold rounded-xl py-2.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 text-sm text-center active:scale-95"
                    >
                      View Profile
                    </button>
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
