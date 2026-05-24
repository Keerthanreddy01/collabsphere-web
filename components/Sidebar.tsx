"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Compass,
  Folder,
  FileText,
  Users,
  Trophy,
  MessageSquare,
  Bell,
  Bookmark,
  Plus,
  Search,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { signOut } from "@/lib/auth";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  showCreateSpaceModal?: boolean;
  setShowCreateSpaceModal?: (show: boolean) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  searchQuery = "",
  setSearchQuery,
  showCreateSpaceModal,
  setShowCreateSpaceModal,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, builders: 0, projects: 0 });

  // Listen to profile updates
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "builder_profiles", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Listen to spaces
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "spaces"), where("created_by", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      setSpaces(list);
    });
    return () => unsubscribe();
  }, [user]);

  // Listen to counts for real-time stats
  useEffect(() => {
    if (!user) return;

    const postsQuery = query(collection(db, "posts"), where("uid", "==", user.uid));
    const unsubPosts = onSnapshot(postsQuery, (snap) => {
      setStats((prev) => ({ ...prev, posts: snap.size }));
    });

    const projectsQuery = query(collection(db, "projects"), where("uid", "==", user.uid));
    const unsubProjects = onSnapshot(projectsQuery, (snap) => {
      setStats((prev) => ({ ...prev, projects: snap.size }));
    });

    const connectionsQuery = query(collection(db, "connections"), where("follower_id", "==", user.uid));
    const unsubConnections = onSnapshot(connectionsQuery, (snap) => {
      setStats((prev) => ({ ...prev, builders: snap.size }));
    });

    return () => {
      unsubPosts();
      unsubProjects();
      unsubConnections();
    };
  }, [user]);

  const currentUser = useMemo(() => {
    return {
      fullName: profile?.full_name || user?.displayName || user?.email || "Builder",
      username: profile?.username || user?.email?.split("@")[0] || "builder",
      email: profile?.email || user?.email || "",
      imageUrl:
        profile?.avatar_url ||
        user?.photoURL ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    };
  }, [user, profile]);

  const spacesList = useMemo(() => {
    const defaultSpaces = [
      { label: "AI Side Project", dotColor: "bg-[#CDFF3D]" },
      { label: "SaaS Founders", dotColor: "bg-[#B69DFF]" },
      { label: "Indie Hackers", dotColor: "bg-[#FF9D42]" },
      { label: "Web3 Creators", dotColor: "bg-[#42EFFF]" },
    ];
    return spaces.length > 0 ? spaces : defaultSpaces;
  }, [spaces]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const navItems = [
    { key: "home", label: "Home", icon: Home, route: "/dashboard/home" },
    { key: "builders", label: "Discover Builders", icon: Compass, route: "/builders" },
    { key: "projects", label: "Projects", icon: Folder, route: "/projects" },
    { key: "logs", label: "Build Log", icon: FileText, route: "/dashboard/home?tab=logs" },
    { key: "teams", label: "Teams", icon: Users, route: "/teams" },
    { key: "hackathons", label: "Hackathons", icon: Trophy, route: "/hackathons" },
    { key: "messages", label: "Messages", icon: MessageSquare, route: "/messages", badge: "12" },
    { key: "notifications", label: "Notifications", icon: Bell, route: "/notifications", badge: "8" },
    { key: "bookmarks", label: "Bookmarks", icon: Bookmark, route: "/bookmarks" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[280px] transform overflow-y-auto bg-white/80 p-6 backdrop-blur-2xl transition-transform duration-300 border-r border-white/50 lg:inset-y-6 lg:left-6 lg:z-auto lg:h-[calc(100vh-48px)] lg:max-h-[calc(100vh-48px)] lg:translate-x-0 lg:overflow-hidden lg:border-none lg:bg-transparent lg:p-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-between h-full bg-white/70 border border-white/50 rounded-[32px] p-5 shadow-[0_12px_40px_rgba(31,38,135,0.02)] backdrop-blur-xl">
        <div className="flex flex-col min-h-0 overflow-y-auto pr-1">
          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-6 group cursor-pointer"
            onClick={() => {
              if (setActiveTab) setActiveTab("for-you");
              router.push("/dashboard/home");
            }}
          >
            <div className="flex items-center justify-center w-5.5 h-5.5 rounded-[7px] bg-[#121315] text-[#F3F7FF] font-black text-xs select-none transition-transform group-hover:rotate-[30deg]">
              <span className="leading-none select-none font-bold text-sm">*</span>
            </div>
            <span className="text-base font-black tracking-tight text-[#121315] font-sans">collabsphere</span>
          </div>

          {/* Search bar */}
          <div className="relative mb-5 shrink-0">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                if (setSearchQuery) {
                  setSearchQuery(e.target.value);
                } else {
                  // Fallback for subpages: go to home and search
                  router.push(`/dashboard/home?search=${encodeURIComponent(e.target.value)}`);
                }
              }}
              className="w-full bg-[#EAEBF4]/40 hover:bg-[#EAEBF4]/60 focus:bg-white focus:ring-2 focus:ring-[#7A5BFF]/30 border border-transparent focus:border-[#7A5BFF]/40 pl-9 pr-4 py-2.5 rounded-2xl text-xs placeholder-gray-400 outline-none transition-all"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 mb-6 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              // Determine active state
              let isActive = false;
              if (item.key === "logs") {
                isActive = pathname === "/dashboard/home" && activeTab === "logs";
              } else if (item.key === "home") {
                isActive = pathname === "/dashboard/home" && activeTab !== "logs";
              } else {
                isActive = pathname === item.route;
              }

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === "logs") {
                      if (setActiveTab && pathname === "/dashboard/home") {
                        setActiveTab("logs");
                      } else {
                        router.push("/dashboard/home?tab=logs");
                      }
                    } else if (item.key === "home") {
                      if (setActiveTab && pathname === "/dashboard/home") {
                        setActiveTab("for-you");
                      } else {
                        router.push("/dashboard/home");
                      }
                    } else {
                      router.push(item.route);
                    }
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-[#7A5BFF] to-[#EC4899] text-white shadow-[0_4px_15px_rgba(122,91,255,0.25)]"
                      : "text-[#62636C] hover:bg-[#E9E7FF]/40 hover:text-black"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : "text-[#7B7C85]"
                      }`}
                    />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isActive ? "bg-white text-[#7A5BFF]" : "bg-[#E9E7FF] text-[#7A5BFF]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Your Spaces */}
          <div className="space-y-3 pb-4">
            <span className="text-[10px] font-extrabold text-[#9EA0A8] tracking-widest uppercase block pl-3 text-left">
              Your Spaces
            </span>
            <div className="space-y-1">
              {spacesList.map((space, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#62636C] hover:bg-[#E9E7FF]/40 hover:text-black transition-all"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${space.dotColor || "bg-[#CDFF3D]"} shadow-sm shrink-0`} />
                    <span className="truncate">{space.label}</span>
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold bg-white/85 border border-white/80 px-1.5 py-0.5 rounded-md shadow-sm">
                    85%
                  </span>
                </button>
              ))}
              
              <button
                type="button"
                onClick={() => {
                  if (setShowCreateSpaceModal) {
                    setShowCreateSpaceModal(true);
                  } else {
                    router.push("/dashboard/home?createSpace=true");
                  }
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-[#7A5BFF] hover:bg-[#E9E7FF]/40 transition-all text-left"
              >
                <Plus className="w-3.5 h-3.5 text-[#7A5BFF]" />
                <span>Create New Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Card & Logout bottom panel */}
        <div className="pt-3 border-t border-gray-100 space-y-3 shrink-0 bg-white/10">
          {/* Real stats indicator */}
          <div className="grid grid-cols-3 gap-1 px-1 py-1.5 bg-gray-50/50 border border-gray-100/50 rounded-xl text-center select-none shadow-inner">
            <div>
              <span className="text-[8px] font-bold text-gray-400 block uppercase">Posts</span>
              <span className="text-xs font-black text-black">{stats.posts}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-gray-400 block uppercase">Builders</span>
              <span className="text-xs font-black text-black">{stats.builders}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-gray-400 block uppercase">Projects</span>
              <span className="text-xs font-black text-black">{stats.projects}</span>
            </div>
          </div>

          {/* User profile details and Logout button */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-gray-50/30 border border-gray-100/30">
              <img
                src={currentUser.imageUrl}
                alt={currentUser.fullName}
                className="w-8.5 h-8.5 rounded-full object-cover border border-white/80 shadow-sm"
              />
              <div className="text-left min-w-0 flex-1">
                <p className="text-xs font-extrabold truncate text-black leading-none">{currentUser.fullName}</p>
                <p className="text-[9px] text-[#8A8B94] truncate mt-0.5">@{currentUser.username}</p>
                <p className="text-[8px] text-[#8A8B94]/80 truncate mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 hover:text-red-700 text-xs font-extrabold transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
