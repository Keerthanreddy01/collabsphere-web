"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function RightSidebar() {
  const { user } = useAuth();

  const suggestedUsers = [
    { username: "keerthan_reddy", name: "Keerthan Reddy", avatar: "https://i.pravatar.cc/150?img=11" },
    { username: "v_naa", name: "V Naa", avatar: "https://i.pravatar.cc/150?img=12" },
    { username: "nagavaram_vrishin", name: "Nagavaram Vrishin", avatar: "https://i.pravatar.cc/150?img=13" },
    { username: "skinny.blxct", name: "Skinny Blxct", avatar: "https://i.pravatar.cc/150?img=14" },
    { username: "l_ram_dayakar", name: "L Ram Dayakar Reddy", avatar: "https://i.pravatar.cc/150?img=15" },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[320px] fixed right-0 top-0 bottom-0 bg-black pt-10 px-4 overflow-y-auto no-scrollbar border-l border-[#262626]">
      
      {/* Current User Switcher */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=krixee"} alt="Profile" className="w-11 h-11 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-white">{user?.email?.split('@')[0] || "krixeee"}</span>
            <span className="text-[14px] text-[#A8A8A8]">{user?.displayName || "Krixeee"}</span>
          </div>
        </div>
        <button className="text-[12px] font-semibold text-[#0095F6] hover:text-white transition-colors">
          Switch
        </button>
      </div>

      {/* Suggested For You Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <span className="text-[14px] font-semibold text-[#A8A8A8]">Suggested for you</span>
        <button className="text-[12px] font-semibold text-white hover:text-[#A8A8A8] transition-colors">
          See all
        </button>
      </div>

      {/* Suggested Users List */}
      <div className="flex flex-col gap-4 mb-8 px-4">
        {suggestedUsers.map((u, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={u.avatar} alt={u.username} className="w-11 h-11 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-white">{u.username}</span>
                <span className="text-[12px] text-[#A8A8A8]">{u.name}</span>
              </div>
            </div>
            <button className="text-[12px] font-semibold text-[#0095F6] hover:text-white transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="px-4 mt-6 text-[12px] text-[#737373] leading-relaxed">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
          <a href="#" className="hover:underline">About</a> ·
          <a href="#" className="hover:underline">Help</a> ·
          <a href="#" className="hover:underline">Press</a> ·
          <a href="#" className="hover:underline">API</a> ·
          <a href="#" className="hover:underline">Jobs</a> ·
          <a href="#" className="hover:underline">Privacy</a> ·
          <a href="#" className="hover:underline">Terms</a> ·
          <a href="#" className="hover:underline">Locations</a> ·
          <a href="#" className="hover:underline">Language</a> ·
          <a href="#" className="hover:underline">Meta Verified</a>
        </nav>
        <span>© 2026 INSTAGRAM FROM META</span>
      </div>

    </aside>
  );
}
