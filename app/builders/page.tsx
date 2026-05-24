"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProfiles } from "@/lib/profiles";

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
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

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
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-white">
              FIND YOUR CO-FOUNDERS.
            </h1>
            <p className="text-sm text-white/60">Browse verified builders.</p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search builders"
              className="w-full rounded-full border border-white/10 bg-[#0b0b0b] px-5 py-3 text-sm text-white outline-none focus:border-pink-500/70"
            />

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    activeFilter === filter
                      ? "border-pink-500/40 bg-pink-500 text-black"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="h-16 w-16 rounded-full bg-white/10" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
                  <div className="mt-4 h-3 w-full rounded bg-white/10" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
                  <div className="mt-6 h-8 w-24 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredBuilders.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
              No builders found yet. Complete your profile to appear here.
            </div>
          )}

          {!isLoading && filteredBuilders.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        {builder.avatar_url ? (
                          <img
                            src={builder.avatar_url}
                            alt={builder.full_name ?? "Builder"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/70">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {builder.full_name ?? "Builder"}
                        </div>
                        <div className="text-sm text-white/50">
                          @{builder.username ?? "builder"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isOpen ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <span>{isOpen ? "Open to Collab" : "Not Available"}</span>
                    </div>

                    <p className="mt-4 text-sm text-white/70 line-clamp-2">
                      {builder.bio ?? "No bio shared yet."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[11px] text-pink-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[11px] text-pink-200">
                          +{skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {stack.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70"
                        >
                          {item}
                        </span>
                      ))}
                      {stack.length > 3 && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">
                          +{stack.length - 3} more
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-full border border-pink-500/50 px-4 py-2 text-sm text-pink-200 transition hover:bg-pink-500/10"
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
