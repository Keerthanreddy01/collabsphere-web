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

      {/* Get the App Banner */}
      <div className="px-4 mb-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1A1A1A] to-black border border-[#262626] p-4 flex flex-col items-center text-center group">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#0095F6] rounded-full blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          
          <svg className="w-8 h-8 text-white mb-2 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <path d="M12 18h.01"></path>
          </svg>
          
          <h4 className="text-[14px] font-bold text-white mb-1 relative z-10">Get the CollabSphere App</h4>
          <p className="text-[12px] text-[#A8A8A8] mb-4 relative z-10">Connect with builders anywhere.</p>
          
          <div className="flex gap-2 w-full relative z-10">
            <button className="flex-1 bg-white hover:bg-gray-200 text-black text-[11px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.7 3.59-.7 1.58.07 2.81.65 3.61 1.62-3.1 1.83-2.6 5.86.35 7.07-.63 1.61-1.63 3.16-2.63 4.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              App Store
            </button>
            <button className="flex-1 bg-[#262626] hover:bg-[#333333] text-white text-[11px] font-bold py-2 rounded-lg transition-colors border border-[#333333] flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a1.984 1.984 0 01-.61-1.45V3.264c0-.555.225-1.066.609-1.45zm11.233 11.233L19.46 8.42c.873-.485 1.5-1.127 1.5-1.895s-.627-1.41-1.5-1.896L6.598 1.48C5.815 1.045 5.032.903 4.417 1.01l10.425 10.424v1.613zm-9.017 9.943c.615.107 1.398-.035 2.181-.47l12.862-7.148c.873-.486 1.5-1.128 1.5-1.896 0-.768-.627-1.41-1.5-1.895l-4.618-2.565-10.425 10.425z"/></svg>
              Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-4 mt-6 text-[12px] text-[#737373] leading-relaxed pb-8">
        <nav className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
          <a href="#" className="hover:underline">About</a> ·
          <a href="#" className="hover:underline">Help</a> ·
          <a href="#" className="hover:underline">Guidelines</a> ·
          <a href="#" className="hover:underline">Privacy</a> ·
          <a href="#" className="hover:underline">Terms</a> ·
          <a href="#" className="hover:underline">API</a> ·
          <a href="#" className="hover:underline">Status</a>
        </nav>
        <span>© 2026 COLLABSPHERE</span>
      </div>

    </aside>
  );
}
