"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RightSidebar() {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        }));
        // Filter out current user if logged in
        setSuggestedUsers(users.filter(u => u.id !== user?.uid));
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);

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
      <div className="flex flex-col gap-4 mb-8 px-4 min-h-[250px]">
        {loading ? (
          <div className="text-[12px] text-[#A8A8A8] text-center mt-4">Loading suggestions...</div>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.map((u, i) => (
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
          ))
        ) : (
          <div className="text-[12px] text-[#A8A8A8] text-center mt-4">No suggestions right now.</div>
        )}
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
