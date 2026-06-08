"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Telescope, Rocket, MessageSquare, Bell, User, Menu, LogOut, Settings, Activity, X, MoreHorizontal } from "lucide-react";
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

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, onMobileCreateClick }: any) {
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
    { key: "home", label: "Home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Explore", icon: Telescope, route: "/explore" },
    { key: "notifications", label: "Notifications", icon: Bell, route: "/notifications" },
    { key: "follow", label: "Follow", icon: Rocket, route: "/showcase" },
    { key: "messages", label: "Chat", icon: MessageSquare, route: "/messages" },
    { key: "profile", label: "Profile", icon: User, route: "/profile" },
    { key: "more", label: "More", icon: Menu, route: "/settings" }
  ];

  const bottomNavItems = [
    { key: "home", label: "Home", icon: LayoutDashboard, route: "/dashboard/home" },
    { key: "explore", label: "Explore", icon: Telescope, route: "/explore" },
    { key: "create", label: "Create", icon: Rocket, route: "/create" },
    { key: "notifications", label: "Alerts", icon: Bell, route: "/notifications" },
    { key: "profile", label: "Profile", icon: "profile", route: "/profile" },
  ];

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#111] rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
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

      {/* Sidebar (X style) */}
      <aside 
        className={`
          group fixed left-0 top-0 bottom-0 z-50 
          w-[72px] md:w-[72px] xl:w-[275px]
          flex flex-col py-6 
          transition-[width,transform] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] 
          will-change-[width] overflow-x-hidden 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: '#000000',
          borderRight: '1px solid #2f3336'
        }}
      >

        {/* Top Logo */}
        <div className="flex items-center justify-between mb-4 px-2 w-full">
          <button
            onClick={() => {
              router.push('/dashboard/home');
              if (setIsSidebarOpen) setIsSidebarOpen(false);
            }}
            className={`
              h-[50px] flex items-center justify-start rounded-full hover:bg-white/10 
              transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-hidden group/btn shrink-0
              w-[50px] mx-3 px-3
              md:w-[50px] md:mx-auto md:px-3
              xl:w-[50px] xl:mx-3 xl:px-3
            `}
          >
            <Activity className="w-[28px] h-[28px] text-white shrink-0" strokeWidth={2.5} />
            <span className="ml-4 text-[18px] font-bold text-white whitespace-nowrap transition-opacity duration-300 delay-100 md:opacity-0 xl:opacity-0 xl:group-hover:opacity-100 opacity-100 block">
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
        <nav className="flex flex-col gap-1 w-full px-2">
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
                    h-[50px] flex items-center justify-start rounded-full hover:bg-white/10 
                    transition-all duration-200 ease-out overflow-hidden group/btn shrink-0
                    my-[2px] w-[50px] mx-auto px-3
                    md:w-[50px] md:mx-auto md:px-3
                    xl:w-fit xl:mx-2 xl:px-4
                  `}
                >
                  <Icon
                    className={`w-[26px] h-[26px] shrink-0 transition-all ${isActive ? "text-white" : "text-white/60 group-hover/btn:text-white"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`
                    ml-4 text-[20px] whitespace-nowrap transition-opacity duration-300 delay-100
                    hidden xl:inline-block
                    ${isActive ? "font-bold text-white" : "font-normal text-white/60 group-hover/btn:text-white"}
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
        </nav>

        {/* Profile Avatar / Post Actions at the bottom */}
        <div className="mt-auto w-full flex flex-col items-center gap-2">
          {/* Post button (X style white compose buttons) */}
          <button 
            onClick={() => {
              if (pathname === "/messages") {
                window.dispatchEvent(new CustomEvent("open-compose"));
              } else {
                router.push("/dashboard/home?compose=true");
              }
            }}
            className="flex xl:hidden w-12 h-12 md:w-14 md:h-14 items-center justify-center transition-all my-2 mx-auto shrink-0 select-none cursor-pointer border-none text-black font-bold hover:bg-neutral-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: '#ffffff',
              borderRadius: '9999px',
            }}
            title="Post"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2.5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>

          <button
            onClick={() => {
              if (pathname === "/messages") {
                window.dispatchEvent(new CustomEvent("open-compose"));
              } else {
                router.push("/dashboard/home?compose=true");
              }
            }}
            className="hidden xl:flex w-[90%] h-[52px] items-center justify-center font-bold text-[17px] transition-all duration-200 my-4 mx-auto shrink-0 border-none select-none cursor-pointer text-black hover:bg-[#e6e6e6] hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#ffffff',
              borderRadius: '9999px',
            }}
          >
            Post
          </button>

          {/* Profile trigger (X style user card) */}
          <div className="relative group/profile w-full px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center justify-between overflow-hidden shrink-0 outline-none w-[50px] mx-auto md:w-[50px] xl:w-[250px] cursor-pointer text-white transition-all p-3 hover:bg-white/10 rounded-full"
                  style={{
                    background: 'transparent',
                    border: 'none',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={currentUser.imageUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover bg-neutral-800 shrink-0" 
                    />
                    <div className="text-left hidden xl:block min-w-0 flex-1">
                      <div className="text-[15px] font-bold text-white truncate leading-tight">{profile?.full_name || user?.displayName || "Builder"}</div>
                      <div className="text-[13px] text-[#71767b] truncate">@{profile?.username || user?.email?.split('@')[0] || "builder"}</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-white hidden xl:block shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-60 bg-[#000000] border border-[#2f3336] text-white p-2 rounded-xl mb-2"
              >
                <DropdownMenuItem
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-lg p-3 flex items-center"
                  onClick={() => router.push('/profile')}
                >
                  Profile Info
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-white/10 focus:bg-white/10 cursor-pointer rounded-lg p-3 flex items-center"
                  onClick={() => router.push('/settings')}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2f3336] my-1" />
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
        </div>

      </aside>

      {/* Bottom Navigation for Mobile */}
      {pathname !== "/messages" && (
        <div className="flex md:hidden lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-[#262626] items-center justify-around px-2 py-3 pb-safe">
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
      )}
    </>
  );
}
