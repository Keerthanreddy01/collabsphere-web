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
export async function joinWaitlist(
  email: string,
  platform: "android" | "ios" | "both",
  referredBy: string | null
): Promise<{ success: boolean; position: number; refCode: string; message: string }> {
  if (!db) {
    return { success: false, position: 248, refCode: "DEV123", message: "Database not configured." };
  }
  try {
    const trimmedEmail = email.trim().toLowerCase();
    const coll = collection(db, "app_waitlist");

    // 1. Check if email already exists
    const q = query(coll, where("email", "==", trimmedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0].data();
      return {
        success: true, // Success is true so the client can display success state details
        position: existingDoc.position || 248,
        refCode: existingDoc.ref_code || "DEV123",
        message: "Already registered!"
      };
    }

    // 2. Get current count to calculate next position
    const currentCount = await getWaitlistCount();
    const position = currentCount + 1;

    // 3. Generate ref_code: random 6 chars (alphanumeric uppercase)
    const refCode = Math.random().toString(36).substring(2, 8).toUpperCase();

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
