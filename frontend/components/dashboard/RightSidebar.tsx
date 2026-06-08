"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserProjects } from "@/lib/projects";
import { Search, MoreHorizontal } from "lucide-react";

type Builder = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  tagline: string;
};

type Project = {
  id: string;
  name?: string;
  description?: string;
  tech_stack?: string[] | string;
  created_at?: string;
};

export default function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [suggestedUsers, setSuggestedUsers] = useState<Builder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "builder_profiles"), limit(5));
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username || doc.data().email?.split('@')[0] || "user",
          name: doc.data().full_name || "Builder",
          avatar: doc.data().avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + doc.id,
          tagline: doc.data().availability || "Building in public",
        }));
        setSuggestedUsers(users.filter(u => u.id !== user?.uid));
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.uid) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      try {
        const { data } = await getUserProjects(user.uid);
        setProjects((data || []).slice(0, 3) as Project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user]);

  const cardStyle = {
    background: "#16181c",
    borderRadius: "16px",
  };

  return (
    <div className="hidden lg:flex w-[350px] min-w-[350px] flex-col h-full bg-transparent p-4 gap-4 overflow-y-auto no-scrollbar">
      
      {/* Search Bar (X style) */}
      <div className="relative group w-full mb-2">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[44px] pl-12 pr-4 text-[15px] text-white placeholder-[#71767b] bg-[#202327] rounded-full outline-none focus:bg-[#000000] focus:border-[#1d9bf0] focus:border border border-transparent transition-all"
        />
        <Search className="w-5 h-5 text-[#71767b] absolute left-4 top-3" />
      </div>

      {/* Subscribe to Premium Card */}
      <section style={cardStyle} className="p-4 flex flex-col gap-2">
        <h2 className="text-[20px] font-extrabold text-[#e7e9ea] leading-tight">Subscribe to Premium</h2>
        <p className="text-[15px] text-[#e7e9ea] leading-snug">
          Subscribe to unlock new features and if eligible, receive a share of ads revenue.
        </p>
        <button 
          className="bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] font-bold text-[15px] py-2 px-4 rounded-full mt-2 transition-colors w-fit cursor-pointer"
        >
          Subscribe
        </button>
      </section>

      {/* Today's News Card (What's happening) */}
      <section style={cardStyle} className="p-4 flex flex-col gap-3">
        <h2 className="text-[20px] font-extrabold text-[#e7e9ea] leading-tight">What's happening</h2>
        
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 py-2 transition-colors">
            <div>
              <span className="text-[13px] text-[#71767b]">Trending in India</span>
              <div className="text-[15px] font-bold text-[#e7e9ea] mt-0.5">Virat Kohli</div>
              <span className="text-[13px] text-[#71767b]">52.9K posts</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#71767b]" />
          </div>

          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 py-2 transition-colors">
            <div>
              <span className="text-[13px] text-[#71767b]">Technology · Trending</span>
              <div className="text-[15px] font-bold text-[#1d9bf0] mt-0.5">#CollabSphere</div>
              <span className="text-[13px] text-[#71767b]">12.4K posts</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#71767b]" />
          </div>

          <div className="flex justify-between items-start cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 py-2 transition-colors">
            <div>
              <span className="text-[13px] text-[#71767b]">Sports · Trending</span>
              <div className="text-[15px] font-bold text-[#e7e9ea] mt-0.5">India vs Bangladesh</div>
              <span className="text-[13px] text-[#71767b]">130K posts</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#71767b]" />
          </div>
        </div>
      </section>

      {/* Who to Follow / Suggested Builders Card */}
      <section style={cardStyle} className="p-4 flex flex-col gap-3">
        <h2 className="text-[20px] font-extrabold text-[#e7e9ea] leading-tight">Who to follow</h2>
        
        <div className="flex flex-col gap-3 mt-1">
          {loadingUsers ? (
            <div className="text-[14px] text-[#71767b]">Loading suggestions...</div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.slice(0, 3).map((u) => (
              <div key={u.id} className="flex items-center gap-3 justify-between py-1.5 cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={u.avatar} alt={u.username} className="h-10 w-10 rounded-full object-cover bg-neutral-800 flex-shrink-0" />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-[15px] font-bold text-[#e7e9ea] truncate hover:underline leading-tight">{u.name}</span>
                    <span className="text-[13px] text-[#71767b] truncate">@{u.username}</span>
                  </div>
                </div>
                <button 
                  className="bg-white text-black hover:bg-neutral-200 font-bold text-[14px] px-4 py-1.5 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                >
                  Follow
                </button>
              </div>
            ))
          ) : (
            <div className="text-[14px] text-[#71767b]">No suggestions right now.</div>
          )}
        </div>
      </section>

      {/* Footer Links */}
      <div className="px-4 text-[13px] text-[#71767b] flex flex-wrap gap-x-3 gap-y-1 leading-normal select-none">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Cookie Policy</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span className="hover:underline cursor-pointer">Ads info</span>
        <span className="hover:underline cursor-pointer">More ···</span>
        <span>© 2026 CollabSphere Corp.</span>
      </div>

    </div>
  );
}
