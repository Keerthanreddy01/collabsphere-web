"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

export default function AdminCleanupPage() {
  const [status, setStatus] = useState("Idle");

  const cleanupFakeEntries = async () => {
    setStatus("Cleaning up...");
    try {
      const q = query(
        collection(db, 'app_waitlist'),
        where('position', '>', 4)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setStatus(`Deleted ${snapshot.docs.length} fake entries.`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-10 text-black dark:text-white bg-white dark:bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Cleanup</h1>
      <button 
        onClick={cleanupFakeEntries}
        className="bg-red-600 hover:bg-red-700 text-black dark:text-white px-4 py-2 rounded"
      >
        Run Cleanup Script
      </button>
      <p className="mt-4">{status}</p>
    </div>
  );
}
