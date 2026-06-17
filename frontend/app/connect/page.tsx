"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { UserPlus, UserCheck, Loader2, Menu, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ConnectPage() {
  const { user } = useAuth();
  const [builders, setBuilders] = useState<any[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        // Fetch current user's profile to get 'following' list
        const meRef = doc(db, "builder_profiles", user.uid);
        const meSnap = await getDoc(meRef);
        const meData = meSnap.data();
        setCurrentUserProfile(meData);
        
        const myFollowing = meData?.following || [];
        const initialMap: Record<string, boolean> = {};
        myFollowing.forEach((id: string) => {
          initialMap[id] = true;
        });
        setFollowingMap(initialMap);

        // Fetch all builders
        const q = query(collection(db, "builder_profiles"));
        const snapshot = await getDocs(q);
        const loadedBuilders = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(b => b.id !== user.uid); // Exclude self
        
        setBuilders(loadedBuilders);
      } catch (error) {
        console.error("Error loading builders:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleToggleFollow = async (targetUserId: string, isFollowing: boolean) => {
    if (!user) return;
    
    // Optimistic UI update
    setFollowingMap(prev => ({
      ...prev,
      [targetUserId]: !isFollowing
    }));

    try {
      const meRef = doc(db, "builder_profiles", user.uid);
      const targetRef = doc(db, "builder_profiles", targetUserId);

      if (isFollowing) {
        // Unfollow
        await updateDoc(meRef, { following: arrayRemove(targetUserId) });
        await updateDoc(targetRef, { followers: arrayRemove(user.uid) });
      } else {
        // Follow
        await updateDoc(meRef, { following: arrayUnion(targetUserId) });
        await updateDoc(targetRef, { followers: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Revert optimistic update on error
      setFollowingMap(prev => ({
        ...prev,
        [targetUserId]: isFollowing
      }));
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#000000] text-white">
      <div className="flex w-full max-w-[1250px] min-h-screen relative">
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 border-x border-white/[0.08] min-h-screen bg-[#000000] relative min-w-0">
          <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 py-4 flex items-center gap-4">
            <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Connect</h1>
              <p className="text-sm text-neutral-500">Discover and follow builders</p>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#00f2fe]" />
              </div>
            ) : builders.length === 0 ? (
              <div className="text-center py-20 text-neutral-500">
                No other builders found in the network yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {builders.map((builder) => {
                  const isFollowing = !!followingMap[builder.id];
                  
                  // Mock stacks fallback if empty
                  const mockStacks = [
                    ["React", "Node.js"],
                    ["Python", "Django"],
                    ["Rust", "WASM"],
                    ["Solidity", "Web3"],
                    ["UI/UX", "Figma"]
                  ];
                  const seedIdx = builder.id.charCodeAt(0) % mockStacks.length;
                  const skills = builder.skills && builder.skills.length > 0 ? builder.skills : mockStacks[seedIdx];

                  return (
                    <div 
                      key={builder.id} 
                      className="group bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 hover:bg-[#0f0f0f] hover:border-white/[0.15] flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <img 
                          src={builder.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${builder.id}`} 
                          alt={builder.full_name || "Builder"} 
                          className="w-14 h-14 rounded-full border border-white/10 object-cover"
                        />
                        <button
                          onClick={() => handleToggleFollow(builder.id, isFollowing)}
                          className={`px-4 py-1.5 rounded-full font-bold text-[13px] transition-all cursor-pointer ${
                            isFollowing 
                              ? "bg-transparent border border-white/20 text-white hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10" 
                              : "bg-white text-black border border-white hover:bg-neutral-200"
                          }`}
                        >
                          {isFollowing ? "Following" : "Connect"}
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="font-bold text-[16px] text-white leading-tight">{builder.full_name || "Anonymous Builder"}</h3>
                        <p className="text-[14px] text-neutral-500">@{builder.username || builder.id.substring(0, 8)}</p>
                      </div>
                      
                      <p className="text-[14px] text-neutral-300 mb-5 line-clamp-2 min-h-[42px] leading-relaxed">
                        {builder.availability || builder.bio || "Building something awesome in secret."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/[0.04]">
                        {(skills || []).map((skill: string) => (
                          <span key={skill} className="text-[12px] font-medium bg-white/[0.04] text-neutral-400 px-3 py-1 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
