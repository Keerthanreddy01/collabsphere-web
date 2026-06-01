"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    role: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const docRef = doc(db, "builder_profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFormData({
            fullName: data.full_name || data.display_name || user.displayName || "",
            bio: data.bio || "",
            location: data.location || "",
            role: data.role || "",
          });
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, updateDoc } = await import("firebase/firestore");
      const docRef = doc(db, "builder_profiles", user.uid);
      await updateDoc(docRef, {
        full_name: formData.fullName,
        bio: formData.bio,
        location: formData.location,
        role: formData.role,
        updated_at: new Date().toISOString()
      });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>;
  }

  const tabs = [
    { name: "Profile", icon: User },
    { name: "Account", icon: Settings },
    { name: "Notifications", icon: Bell },
    { name: "Security", icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-white font-inter overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-[72px] h-screen overflow-y-auto no-scrollbar relative">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
            <p className="text-[#A8A8A8] text-[15px]">Manage your account settings and preferences.</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-64 shrink-0 space-y-1"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                      activeTab === tab.name 
                        ? "bg-white/[0.08] text-white" 
                        : "text-[#888] hover:bg-white/[0.04] hover:text-[#ddd]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => router.push("/api/auth/logout")} // Handle actual logout logic here if needed
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-6 md:p-8 backdrop-blur-[20px]"
            >
              <h2 className="text-xl font-bold text-white mb-6">{activeTab} Settings</h2>
              
              {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === "Profile" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/80">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#111] border border-white/5 focus:border-[#7e85fe] rounded-xl h-11 px-4 text-white placeholder:text-white/20 outline-none transition-all text-sm font-medium"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/80">Role</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-[#111] border border-white/5 focus:border-[#7e85fe] rounded-xl h-11 px-4 text-white placeholder:text-white/20 outline-none transition-all text-sm font-medium"
                        placeholder="e.g. Full Stack Developer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/80">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#111] border border-white/5 focus:border-[#7e85fe] rounded-xl h-11 px-4 text-white placeholder:text-white/20 outline-none transition-all text-sm font-medium"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-white/80">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-[#111] border border-white/5 focus:border-[#7e85fe] rounded-xl p-4 text-white placeholder:text-white/20 outline-none transition-all text-sm font-medium resize-none min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all text-sm flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab !== "Profile" && (
                <div className="text-[#777] text-[14px]">
                  {activeTab} content will be implemented here.
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
