import { db } from "./firebase";
import { 
  collection, addDoc, doc, updateDoc, query, orderBy, where, 
  onSnapshot, serverTimestamp, runTransaction 
} from "firebase/firestore";
import { sanitizeShortText } from "./sanitize";

export interface MessageData {
  chatId: string;
  senderId: string;
  content: string;
}

/**
 * Creates a new conversation in conversations/{conversationId}
 */
export async function createChat(participants: string[]) {
  try {
    const unreadCount: Record<string, number> = {};
    participants.forEach((p) => {
      unreadCount[p] = 0;
    });
    
    const docRef = await addDoc(collection(db, "conversations"), {
      participants,
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
      unreadCount,
    });
    
    return { data: docRef.id, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

/**
 * Sends a message to a subcollection messages/{conversationId}/messages/{messageId}
 * and updates the parent conversation using a transaction to manage unread counts.
 */
export async function sendMessage(data: MessageData) {
  try {
    const sanitizedText = sanitizeShortText(data.content);
    
    // Subcollection path: messages/{conversationId}/messages/{messageId}
    const messagesCol = collection(db, "messages", data.chatId, "messages");
    const messageDocRef = doc(messagesCol);
    
    const messageData = {
      senderId: data.senderId,
      text: sanitizedText,
      timestamp: serverTimestamp(),
      read: false
    };
    
    const conversationRef = doc(db, "conversations", data.chatId);
    
    await runTransaction(db, async (transaction) => {
      const convSnap = await transaction.get(conversationRef);
      if (!convSnap.exists()) {
        throw new Error("Conversation does not exist");
      }
      
      const convData = convSnap.data();
      const participants = convData.participants || [];
      const recipientId = participants.find((uid: string) => uid !== data.senderId);
      
      const currentUnread = convData.unreadCount || {};
      const newUnread = { ...currentUnread };
      
      if (recipientId) {
        newUnread[recipientId] = (newUnread[recipientId] || 0) + 1;
      }
      newUnread[data.senderId] = 0; // Sender has read their own message
      
      transaction.set(messageDocRef, messageData);
      transaction.update(conversationRef, {
        lastMessage: sanitizedText,
        lastMessageTime: serverTimestamp(),
        unreadCount: newUnread
      });
    });
    
    return { data: messageDocRef.id, error: null };
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { data: null, error: err.message };
  }
}

/**
 * Subscribes to the user's active conversations
 */
export function subscribeToChats(userId: string, callback: (chats: any[]) => void) {
  const q = query(
    collection(db, "conversations"),
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}

/**
 * Subscribes to messages within a conversation subcollection
 */
export function subscribeToMessages(chatId: string, callback: (messages: any[]) => void) {
  const q = query(
    collection(db, "messages", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        // Map the required `text` field to `content` to maintain UI compatibility
        content: docData.text || "", 
      };
    }));
  });
}

/**
 * Resets the unread message count to 0 for a user in a specific conversation
 */
export async function markConversationAsRead(chatId: string, userId: string) {
  try {
    const conversationRef = doc(db, "conversations", chatId);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(conversationRef);
      if (docSnap.exists()) {
        const unreadCount = docSnap.data().unreadCount || {};
        if (unreadCount[userId] !== 0) {
          const newUnread = { ...unreadCount, [userId]: 0 };
          transaction.update(conversationRef, { unreadCount: newUnread });
        }
      }
    });
  } catch (err) {
    console.error("Error marking conversation as read:", err);
  }
}
