"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  MessageSquare,
  Globe2,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { signOut } from "@/lib/auth";

interface SidebarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const navItems = [
    { key: "home", label: "Dashboard", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages", badge: "3" },
    { key: "communities", label: "Communities", icon: Globe2, route: "/forums" },
    { key: "friends", label: "Friends", icon: Users, route: "/friends", badge: "12" },
    { key: "media", label: "Media", icon: ImageIcon, route: "/media" },
    { key: "settings", label: "Settings", icon: Settings, route: "/settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      <aside
        className={`fixed left-4 top-4 bottom-4 z-50 bg-[#0A0A0A] rounded-[36px] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden group flex flex-col py-6
          ${isSidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-[150%] w-[72px] lg:translate-x-0 lg:hover:w-[260px]"}
        `}
      >
        {/* Top Logo / Active Indicator */}
        <div className="px-3 flex items-center mb-8 shrink-0 cursor-pointer" onClick={() => router.push('/dashboard/home')}>
          <div className="w-[48px] h-[48px] bg-[#EA580C] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(234,88,12,0.5)]">
            <Home className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className={`ml-4 text-[16px] font-black text-white whitespace-nowrap tracking-tight transition-opacity duration-300
            ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100 delay-100"}
          `}>
            collabsphere
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-3 px-3 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Hardcoding active state for feed/home for this view
            const isActive = item.key === "home" || pathname === item.route;

            return (
              <button
                key={item.key}
                onClick={() => {
                  router.push(item.route);
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
                className={`relative flex items-center w-full h-[48px] rounded-full transition-all duration-300 group/item ${
                  isActive ? "" : "hover:bg-white/10"
                }`}
              >
                {/* Active Border matching screenshot */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full border border-[#EA580C] bg-[#EA580C]/10"></div>
                )}

                <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center relative z-10">
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-300 ${
                      isActive ? "text-[#EA580C]" : "text-[#A1A1AA] group-hover/item:text-white"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                <span className={`ml-3 text-[14px] font-bold whitespace-nowrap relative z-10 transition-opacity duration-300
                  ${isActive ? "text-white" : "text-[#A1A1AA] group-hover/item:text-white"}
                  ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100 delay-100"}
                `}>
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`ml-auto mr-4 bg-[#EA580C] text-white text-[10px] font-black px-2 py-0.5 rounded-full transition-opacity duration-300
                    ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100 delay-100"}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="px-3 shrink-0 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full h-[48px] rounded-full hover:bg-white/10 transition-all duration-300 group/logout"
          >
            <div className="w-[48px] h-[48px] shrink-0 flex items-center justify-center">
              <LogOut className="w-[22px] h-[22px] text-[#A1A1AA] group-hover/logout:text-white transition-colors duration-300" />
            </div>
            <span className={`ml-3 text-[14px] font-bold text-[#A1A1AA] group-hover/logout:text-white whitespace-nowrap transition-opacity duration-300
              ${isSidebarOpen ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100 delay-100"}
            `}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
