"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Telescope, Rocket, MessageSquare, Bell, PlusCircle, Menu, LogOut, Settings, Activity, X } from "lucide-react";
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

export default function LeftSidebar({ isSidebarOpen, setIsSidebarOpen, onMobileCreateClick }: any) {
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

  const bottomNavItems = [
    { key: "home", label: "Home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Explore", icon: Telescope, route: "/explore" },
    { key: "create", label: "Create", icon: PlusCircle, route: "/create" },
    { key: "notifications", label: "Alerts", icon: Bell, route: "/notifications" },
    { key: "profile", label: "Profile", icon: "profile", route: "/profile" },
  ];

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#111] rounded-lg border border-white/20 shadow-md text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        group fixed left-0 top-0 bottom-0 z-50 
        w-[244px] md:w-[72px] lg:w-[72px] lg:hover:w-[244px]
        bg-black border-r border-[#262626] flex flex-col py-6 
        transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
        will-change-[width] overflow-x-hidden 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* Top Logo */}
        <div className="flex items-center justify-between mb-8 px-2 w-full">
          <button 
            onClick={() => {
              router.push('/dashboard/home');
              if (setIsSidebarOpen) setIsSidebarOpen(false);
            }}
            className={`
              h-[48px] flex items-center justify-start rounded-lg hover:bg-[#1A1A1A] 
              transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0
              w-[220px] mx-3 px-4
              md:w-[48px] md:mx-auto md:px-3
              lg:w-[48px] lg:mx-auto lg:px-3 lg:group-hover:w-[220px] lg:group-hover:mx-3 lg:group-hover:px-4
            `}
          >
            <Activity className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
            <span className="ml-4 text-[18px] font-bold text-white whitespace-nowrap transition-opacity duration-300 delay-100 md:opacity-0 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 block">
              CollabSphere
            </span>
          </button>
          
          {/* Close button inside sidebar on mobile */}
          <button 
            className="md:hidden text-white/50 hover:text-white shrink-0 mr-3"
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);

            return (
              <div key={item.key} className="relative group/tooltip">
                <button
                  onClick={() => {
                    router.push(item.route);
                    if (setIsSidebarOpen) setIsSidebarOpen(false);
                  }}
                  className={`
                    h-[48px] flex items-center justify-start rounded-lg hover:bg-[#1A1A1A] 
                    transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0
                    w-[220px] mx-auto px-4
                    md:w-[48px] md:mx-auto md:px-3
                    lg:w-[48px] lg:mx-auto lg:px-3 lg:group-hover:w-[220px] lg:group-hover:mx-3 lg:group-hover:px-4
                  `}
                >
                  <Icon 
                    className={`w-6 h-6 transition-transform group-hover/btn:scale-105 shrink-0 ${isActive ? "text-white fill-white" : "text-white"}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    fill={isActive ? "currentColor" : "none"}
                  />
                  <span className={`
                    ml-4 text-[15px] whitespace-nowrap transition-opacity duration-300 delay-100
                    md:opacity-0 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 block
                    ${isActive ? "font-bold text-white" : "font-medium text-white"}
                  `}>
                    {item.label}
                  </span>
                </button>
                {/* Tooltip for Tablet */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-white text-black text-xs font-bold rounded-md opacity-0 pointer-events-none md:group-hover/tooltip:opacity-100 lg:hidden top-1/2 -translate-y-1/2 z-50 whitespace-nowrap transition-opacity">
                  {item.label}
                </div>
              </div>
            );
          })}

          {/* Profile Icon */}
          <div className="relative group/tooltip mt-2">
            <button
              onClick={() => {
                router.push('/profile');
                if (setIsSidebarOpen) setIsSidebarOpen(false);
              }}
              className={`
                h-[48px] flex items-center justify-start rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden shrink-0
                w-[220px] mx-auto px-4
                md:w-[48px] md:mx-auto md:px-3
                lg:w-[48px] lg:mx-auto lg:px-3 lg:group-hover:w-[220px] lg:group-hover:mx-3 lg:group-hover:px-4
              `}
            >
              <img src={currentUser.imageUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover shrink-0" />
              <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap md:opacity-0 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 block transition-opacity duration-300 delay-100">
                Profile
              </span>
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-white text-black text-xs font-bold rounded-md opacity-0 pointer-events-none md:group-hover/tooltip:opacity-100 lg:hidden top-1/2 -translate-y-1/2 z-50 whitespace-nowrap transition-opacity">
              Profile
            </div>
          </div>
        </nav>

        {/* Bottom Menu Icon */}
        <div className="mt-auto w-full px-2 relative group/tooltip">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`
                h-[48px] flex items-center justify-start rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0 outline-none
                w-[220px] mx-auto px-4
                md:w-[48px] md:mx-auto md:px-3
                lg:w-[48px] lg:mx-auto lg:px-3 lg:group-hover:w-[220px] lg:group-hover:mx-3 lg:group-hover:px-4
              `}>
                <Menu className="w-6 h-6 text-white group-hover/btn:scale-105 transition-transform shrink-0" strokeWidth={2} />
                <span className="ml-4 text-[15px] font-medium text-white whitespace-nowrap md:opacity-0 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 block transition-opacity duration-300 delay-100">
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
                onClick={() => {
                  router.push('/settings');
                  if (setIsSidebarOpen) setIsSidebarOpen(false);
                }}
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
          <div className="absolute left-full ml-2 px-2 py-1 bg-white text-black text-xs font-bold rounded-md opacity-0 pointer-events-none md:group-hover/tooltip:opacity-100 lg:hidden top-1/2 -translate-y-1/2 z-50 whitespace-nowrap transition-opacity">
            More
          </div>
        </div>

      </aside>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-[#262626] flex items-center justify-around px-2 h-16 pb-safe">
        {bottomNavItems.map((item) => {
          const isActive = item.key === "home" ? pathname === "/dashboard/home" : pathname.startsWith(item.route);
          
          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === "create") {
                  if (onMobileCreateClick) {
                    onMobileCreateClick();
                  } else {
                    if (typeof window !== 'undefined') sessionStorage.setItem('openCompose', 'true');
                    router.push('/dashboard/home');
                  }
                } else {
                  router.push(item.route);
                }
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors w-[60px]"
            >
              {item.key === "profile" ? (
                <img 
                  src={currentUser.imageUrl} 
                  alt="Profile" 
                  className={`w-6 h-6 rounded-full object-cover mb-1 transition-all ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-80"}`} 
                />
              ) : (
                React.createElement(item.icon as any, {
                  className: `w-6 h-6 mb-1 transition-all ${isActive ? "text-white" : "text-white/50"}`,
                  strokeWidth: isActive ? 2.5 : 2,
                  fill: isActive ? "currentColor" : "none"
                })
              )}
              <span className={`text-[10px] ${isActive ? "text-white font-bold" : "text-white/50 font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
