"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  FolderOpen,
  MessageSquare,
  Users,
  Calendar,
  PieChart,
  Settings,
  Mic,
  Play,
  Paperclip,
  Smile,
  Mic2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "builder_profiles", user.uid), (docSnap) => {
      if (docSnap.exists()) setProfile(docSnap.data());
    });
    return () => unsubscribe();
  }, [user]);

  const navItems = [
    { key: "home", label: "Home", icon: Home, route: "/dashboard/home" },
    { key: "projects", label: "Projects", icon: FolderOpen, route: "/projects" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages" },
    { key: "team", label: "Team", icon: Users, route: "/friends" },
    { key: "analytics", label: "Analytics", icon: PieChart, route: "/analytics" },
    { key: "calendar", label: "Calendar", icon: Calendar, route: "/events" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Flat Light Gray Sidebar matching TaskLab reference */}
      <aside className={`fixed left-0 top-0 bottom-0 z-50 w-[270px] bg-[#F4F5F7] overflow-y-auto no-scrollbar flex flex-col px-5 py-8 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Top Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => router.push('/dashboard/home')}>
          <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center transform rotate-45">
            <div className="w-3 h-3 bg-white rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-[19px] font-black tracking-tight text-black">CollabSphere</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 mb-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Force "Team" or "Home" active for demo based on route, but let's make it dynamic
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[24px] text-[15px] font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-[#111111] text-white shadow-lg shadow-black/10" 
                    : "text-[#5A5C60] hover:text-black hover:bg-black/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#5A5C60]"}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Chat Widget Replica */}
        <div className="mt-auto bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3">
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white" fill="white" />
              </div>
              <span className="font-bold text-[14px]">Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-300 to-blue-300 border-2 border-white"></div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-medium flex items-center justify-between">
            <span>Lukas is typing...</span>
            <div className="flex -space-x-1">
              <img src="https://i.pravatar.cc/100?img=1" className="w-4 h-4 rounded-full border border-white" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-4 h-4 rounded-full border border-white" />
            </div>
          </div>

          {/* Messages Mock */}
          <div className="flex flex-col gap-3">
            
            {/* Audio Message 1 */}
            <div className="flex items-end gap-2">
              <img src="https://i.pravatar.cc/100?img=3" className="w-6 h-6 rounded-full mb-1" />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-300 ml-1">Lukas</span>
                <div className="bg-[#F4F5F7] rounded-full px-3 py-1.5 flex items-center gap-2">
                  <Play className="w-3 h-3 text-gray-500" fill="currentColor" />
                  <div className="flex items-center gap-0.5 h-3">
                    <div className="w-0.5 h-full bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-1/2 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-3/4 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-1/3 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">0:11</span>
                </div>
              </div>
            </div>

            {/* Audio Message 2 (You) */}
            <div className="flex items-end gap-2 self-end flex-row-reverse">
              <img src="https://i.pravatar.cc/100?img=4" className="w-6 h-6 rounded-full mb-1" />
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] text-gray-300 mr-1">12:14 · You</span>
                <div className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-green-300 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm">
                  <div className="flex items-center gap-0.5 h-3">
                    <div className="w-0.5 h-1/2 bg-white rounded-full"></div>
                    <div className="w-0.5 h-full bg-white rounded-full"></div>
                    <div className="w-0.5 h-3/4 bg-white rounded-full"></div>
                    <div className="w-0.5 h-1/3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-[9px] text-black/70 font-bold">0:14</span>
                  <div className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                    <Mic className="w-2.5 h-2.5 text-black" />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Message 3 */}
            <div className="flex items-end gap-2">
              <img src="https://i.pravatar.cc/100?img=5" className="w-6 h-6 rounded-full mb-1" />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-300 ml-1">Kelly · 12:15</span>
                <div className="bg-[#F4F5F7] rounded-full px-3 py-1.5 flex items-center gap-2">
                  <Play className="w-3 h-3 text-gray-500" fill="currentColor" />
                  <div className="flex items-center gap-0.5 h-3">
                    <div className="w-0.5 h-2/3 bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-400 rounded-full"></div>
                    <div className="w-0.5 h-1/2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium">0:08</span>
                </div>
              </div>
            </div>

            {/* Text Message (You) */}
            <div className="flex items-end gap-2 self-end flex-row-reverse">
              <img src="https://i.pravatar.cc/100?img=4" className="w-6 h-6 rounded-full mb-1" />
              <div className="flex flex-col items-end gap-1">
                <span className="text-[9px] text-gray-300 mr-1">12:16 · You</span>
                <div className="bg-gradient-to-r from-cyan-300 to-green-300 rounded-[12px] rounded-br-sm px-3 py-1.5 shadow-sm">
                  <span className="text-[11px] font-bold text-gray-800">Great job guys, keep it up!</span>
                </div>
              </div>
            </div>

          </div>

          {/* Input Box */}
          <div className="mt-2 bg-[#F4F5F7] rounded-full px-3 py-2 flex items-center gap-2">
            <Paperclip className="w-3 h-3 text-gray-400" />
            <input type="text" placeholder="Message..." className="bg-transparent text-[11px] flex-1 outline-none text-gray-700 placeholder:text-gray-400" />
            <Smile className="w-3 h-3 text-gray-400" />
            <Mic2 className="w-3 h-3 text-gray-400" />
          </div>

        </div>

      </aside>
    </>
  );
}
