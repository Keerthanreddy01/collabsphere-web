import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  getCountFromServer, 
  serverTimestamp 
} from "firebase/firestore";

/**
 * Gets the current count of pre-registered builders from Firestore server
 */
export async function getWaitlistCount(): Promise<number> {
  if (!db) return 0; // Fallback default count
  try {
    const coll = collection(db, "app_waitlist");
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return 0;
  }
}

/**
 * Adds a user to the waitlist if their email is not already registered.
 * Returns the position and referral code.
 */
// ── Client-side rate limiter (backup for the server-side /api/waitlist check) ─
let lastSubmitTime = 0;
const MIN_SUBMIT_INTERVAL_MS = 5000; // 5 seconds between attempts

/**
 * Generate a cryptographically stronger random ref code.
 */
function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const arr = new Uint8Array(6);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 6; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr, (b) => chars[b % chars.length]).join('');
}

export async function joinWaitlist(
  email: string,
  platform: "android" | "ios" | "both",
  referredBy: string | null
): Promise<{ success: boolean; position: number; refCode: string; message: string }> {
  if (!db) {
    return { success: false, position: 0, refCode: "", message: "Database not configured." };
  }

  // Client-side rate limit
  const now = Date.now();
  if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL_MS) {
    return { success: false, position: 0, refCode: "", message: "Please wait a few seconds before trying again." };
  }
  lastSubmitTime = now;

  try {
    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format client-side
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, position: 0, refCode: "", message: "Invalid email address." };
    }

    const coll = collection(db, "app_waitlist");

    // 1. Check if email already exists
    const q = query(coll, where("email", "==", trimmedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0].data();
      return {
        success: true,
        position: existingDoc.position || 1,
        refCode: existingDoc.ref_code || "COLLSB",
        message: "Already registered!"
      };
    }

    // 2. Get current count to calculate next position
    const currentCount = await getWaitlistCount();
    const position = currentCount + 1;

    // 3. Generate cryptographically stronger ref_code
    const refCode = generateRefCode();

    // 4. Add the document to Firestore
    await addDoc(coll, {
      email: trimmedEmail,
      platform,
      joined_at: serverTimestamp(),
      position,
      ref_code: refCode,
      referred_by: referredBy || null
    });

    return {
      success: true,
      position,
      refCode,
      message: "Pre-registered successfully!"
    };
  } catch (error: any) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      position: 0,
      refCode: "",
      message: error.message || "An error occurred."
    };
  }
}

/**
 * Gets the last 3 waitlist signups (extract name from email)
 */
export async function getRecentSignups(): Promise<string[]> {
  if (!db) return []; // Fallback defaults
  try {
    const coll = collection(db, "app_waitlist");
    const q = query(coll, orderBy("joined_at", "desc"), limit(3));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => {
      const data = doc.data();
      const email = data.email || "";
      const username = email.split("@")[0] || "Builder";
      const cleanName = username.split(".")[0] || "Builder";
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    });
  } catch (error) {
    console.error("Error getting recent signups:", error);
    return [];
  }
}
