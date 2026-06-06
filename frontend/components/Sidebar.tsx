"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Telescope, Rocket, MessageSquare, Bell, PlusCircle, Menu, LogOut, Settings, Activity } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const currentUser = useMemo(() => ({
    imageUrl: profile?.avatar_url || user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=keerthan",
  }), [user, profile]);

  const navItems = [
    { key: "home", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Discover", icon: Telescope, route: "/explore" },
    { key: "showcase", label: "Showcase", icon: Rocket, route: "/showcase" },
    { key: "messages", label: "Discussions", icon: MessageSquare, route: "/messages" },
    { key: "notifications", label: "Alerts", icon: Bell, route: "/notifications" },
    { key: "create", label: "Launch", icon: PlusCircle, route: "/create" },
  ];

  return (
    <>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Instagram-style Narrow Dark Sidebar (Expands on Hover) */}
      <aside className={`group fixed left-0 top-0 bottom-0 z-50 w-[72px] hover:w-[244px] bg-black border-r border-[#262626] flex flex-col py-6 transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-[width] overflow-x-hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Top Logo */}
        <button 
          onClick={() => router.push('/dashboard/home')}
          className="w-[48px] h-[48px] group-hover:w-[220px] mx-auto group-hover:mx-3 flex items-center justify-start px-3 group-hover:px-4 mb-8 hover:bg-[#1A1A1A] rounded-lg transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0"
        >
          <Activity className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
          <span className="ml-4 text-[18px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            CollabSphere
          </span>
        </button>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className="w-[48px] h-[48px] group-hover:w-[220px] mx-auto group-hover:mx-3 flex items-center justify-start px-3 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0"
              >
                <Icon 
                  className={`w-6 h-6 transition-transform group-hover/btn:scale-105 shrink-0 ${isActive ? "text-white fill-white" : "text-white"}`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className={`ml-4 text-[15px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 ${isActive ? "font-bold text-white" : "font-medium text-white"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Profile Icon */}
          <button
            onClick={() => router.push('/profile')}
            className="w-[48px] h-[48px] group-hover:w-[220px] mx-auto group-hover:mx-3 flex items-center justify-start px-3 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden shrink-0"
          >
            <img src={currentUser.imageUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover shrink-0" />
            <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Profile
            </span>
          </button>
        </nav>

        {/* Bottom Menu Icon */}
        <div className="mt-auto w-full px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[48px] h-[48px] group-hover:w-[220px] mx-auto group-hover:mx-3 flex items-center justify-start px-3 group-hover:px-4 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0 outline-none">
                <Menu className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
                <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  More
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              side="top" 
              align="start" 
              className="w-56 bg-[#1A1A1A] border-[#333] text-white p-2 rounded-xl mb-2"
            >
              <DropdownMenuItem 
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-lg p-3 flex items-center"
                onClick={() => router.push('/settings')}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333] my-1" />
              <DropdownMenuItem 
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-lg p-3 flex items-center text-red-500 focus:text-red-500"
                onClick={async () => {
                  await signOut(auth);
                  router.push('/');
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </aside>
    </>
  );
}
