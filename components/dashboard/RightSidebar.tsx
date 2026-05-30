"use client";

import React from "react";
import { Plus, X, Music, Palette, Utensils, Mountain } from "lucide-react";

export default function RightSidebar() {
  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col gap-6 pl-4 py-6 sticky top-0 h-screen overflow-y-auto no-scrollbar pb-16">
      {/* Stories Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-black tracking-tight">Stories</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {/* Story 1 */}
          <div className="relative w-[110px] h-[160px] rounded-[24px] overflow-hidden shrink-0 group cursor-pointer shadow-sm border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=300&q=80"
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80"
                alt="Anatoly"
                className="w-5 h-5 rounded-full border border-white"
              />
              <span className="text-[10px] font-bold text-white truncate">Anatoly P...</span>
            </div>
          </div>
          {/* Story 2 */}
          <div className="relative w-[110px] h-[160px] rounded-[24px] overflow-hidden shrink-0 group cursor-pointer shadow-sm border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80"
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&h=50&q=80"
                alt="Lolita"
                className="w-5 h-5 rounded-full border border-white"
              />
              <span className="text-[10px] font-bold text-white truncate">Lolita Earns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-black tracking-tight">Suggestions</h3>
        <div className="flex flex-col gap-4 bg-white/40 p-4 rounded-[24px] border border-white shadow-sm backdrop-blur-md">
          {[
            { name: "Nick Shelburne", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" },
            { name: "Brittni Lando", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" },
            { name: "Ivan Shevchenko", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80" },
          ].map((user, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                <span className="text-sm font-bold text-black">{user.name}</span>
              </div>
              <button className="bg-black hover:bg-gray-800 text-white text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors shadow-sm">
                Follow
              </button>
            </div>
          ))}
          <button className="text-xs font-bold text-gray-400 hover:text-black text-left w-max transition-colors">See all</button>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-black tracking-tight">Recommendations</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* UI/UX */}
          <div className="relative w-full aspect-square rounded-full flex flex-col items-center justify-center bg-[#F0F5FF] cursor-pointer hover:scale-105 transition-transform duration-300 shadow-sm border border-white border-dashed">
            <X className="w-6 h-6 text-gray-500 mb-1" />
            <span className="text-xs font-black text-black">UI/UX</span>
          </div>

          {/* Music */}
          <div className="relative w-full aspect-square rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 to-pink-400 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md border-2 border-white">
            <Music className="w-6 h-6 text-black mb-1" />
            <span className="text-xs font-black text-black">Music</span>
          </div>

          {/* Cooking */}
          <div className="relative w-full aspect-square rounded-full flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-sm border-2 border-white">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200&q=80" alt="Cooking" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-black/20" />
            <Utensils className="w-6 h-6 text-white mb-1 relative z-10" />
            <span className="text-xs font-black text-white relative z-10">Cooking</span>
          </div>

          {/* Hiking */}
          <div className="relative w-full aspect-square rounded-[36px] flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 to-purple-400 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md border-2 border-white">
            <Mountain className="w-6 h-6 text-black mb-1" />
            <span className="text-xs font-black text-black">Hiking</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
