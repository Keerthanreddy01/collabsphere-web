import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, getDocs, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { sanitizeShortText } from "./sanitize";

export interface MessageData {
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
}

export async function createChat(participants: string[]) {
  try {
    const docRef = await addDoc(collection(db, "chats"), {
      participants,
      updated_at: new Date().toISOString(),
      lastMessage: "",
    });
    return { data: docRef.id, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function sendMessage(data: MessageData) {
  try {
    const sanitizedContent = sanitizeShortText(data.content);
    const msgRef = await addDoc(collection(db, "messages"), {
      ...data,
      content: sanitizedContent,
      created_at: new Date().toISOString(),
    });
    
    // Update the parent chat
    await updateDoc(doc(db, "chats", data.chatId), {
      lastMessage: sanitizedContent,
      updated_at: new Date().toISOString(),
    });

    return { data: msgRef.id, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export function subscribeToChats(userId: string, callback: (chats: any[]) => void) {
  const q = query(collection(db, "chats"), where("participants", "array-contains", userId), orderBy("updated_at", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}

export function subscribeToMessages(chatId: string, callback: (messages: any[]) => void) {
  const q = query(collection(db, "messages"), where("chatId", "==", chatId), orderBy("created_at", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}
