"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, ArrowLeft } from "lucide-react";

export default function BookmarksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-[#EEF3FF] via-[#F4F7FF] to-[#FCFDFF] text-[#1D1E22] antialiased font-sans relative flex items-center justify-center p-6 text-center overflow-hidden">
      {/* Background patterns */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(#7A5BFF 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute bottom-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-[#7A5BFF]/5 blur-[120px] pointer-events-none z-0 animate-pulse" />

      <div className="relative z-10 bg-white/70 border border-white/60 rounded-[32px] p-8 max-w-md w-full shadow-lg backdrop-blur-xl space-y-6">
        <div className="w-16 h-16 bg-[#E9E7FF] text-[#7A5BFF] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-sans">
            BOOKMARKS
          </h1>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Personal bookmarking space for saving interesting logs and builder profiles is currently under construction. Check back soon!
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/home")}
          className="inline-flex items-center gap-2 bg-[#121315] hover:bg-black text-[#CDFF3D] text-xs font-black px-6 py-3 rounded-full shadow-md active:scale-95 transition-all mx-auto"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
