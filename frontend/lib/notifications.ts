import { db } from "./firebase";
import { collection, addDoc, query, orderBy, where, onSnapshot, updateDoc, doc } from "firebase/firestore";

export type NotificationType = "like" | "comment" | "follow";

export interface NotificationData {
  userId: string; // The person receiving the notification
  actorId: string; // The person who did the action
  actorName: string;
  actorAvatar: string;
  type: NotificationType;
  targetId?: string; // The ID of the post/project
  content?: string; // e.g., snippet of the comment
  read: boolean;
}

export async function createNotification(data: Omit<NotificationData, "read">) {
  try {
    // Prevent self-notifications
    if (data.userId === data.actorId) return;

    await addDoc(collection(db, "notifications"), {
      ...data,
      read: false,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Failed to create notification:", err);
  }
}

export function subscribeToNotifications(userId: string, callback: (notifications: any[]) => void) {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("created_at", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}

export async function markNotificationAsRead(id: string) {
  try {
    await updateDoc(doc(db, "notifications", id), { read: true });
  } catch (err) {
    // Silent fail
  }
}
