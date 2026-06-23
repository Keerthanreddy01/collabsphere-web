"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function TeamsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E5EEFF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A5BFF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3FF] via-[#F4F7FF] to-[#FCFDFF] text-[#1D1E22] antialiased font-sans relative pb-12 lg:pb-16 overflow-x-hidden flex justify-center">
      <div className="flex w-full max-w-[1250px] min-h-screen relative">
        {/* Background patterns */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(#7A5BFF 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-[#7A5BFF]/6 blur-[120px] pointer-events-none z-0" />

        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-1 min-w-0 space-y-6 z-10 p-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between bg-white/70 border border-gray-200 dark:border-white/40 rounded-2xl p-4 shadow-sm backdrop-blur-md lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-white dark:text-black select-none leading-none">*</span>
              <span className="font-bold text-white dark:text-black text-sm">collabsphere</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>

          {/* Coming Soon card */}
          <div className="bg-white/70 border border-gray-200 dark:border-white/60 rounded-[32px] p-12 max-w-xl mx-auto text-center shadow-lg backdrop-blur-xl space-y-6 my-12">
            <div className="w-16 h-16 bg-[#E9E7FF] text-[#7A5BFF] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-black text-white dark:text-black uppercase tracking-tight font-sans">
                TEAMS HUB <span className="text-pink-500">COMING SOON 🔥</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-md mx-auto">
                Collaborative team workspace, shared task checklists, and distributed build logs are currently under construction. Find and connect with builders on the dashboard to start planning your squad!
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/home")}
              className="inline-flex items-center gap-2 bg-[#121315] hover:bg-white dark:bg-black text-[#CDFF3D] text-xs font-black px-6 py-3 rounded-full shadow-md active:scale-95 transition-all"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
