import { db } from "./firebase";
import { auth } from "./firebase";
import { 
  collection, addDoc, doc, updateDoc, query, orderBy, where, 
  onSnapshot, serverTimestamp, runTransaction 
} from "firebase/firestore";
import { sanitizeText } from "./sanitize";

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
  // Auth guard: only authenticated users can send messages
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== data.senderId) {
    return { data: null, error: 'Unauthorized: sender mismatch' };
  }

  try {
    // Sanitize and enforce message length (max 2000 chars)
    const sanitizedText = sanitizeText(data.content, 2000);
    if (!sanitizedText) {
      return { data: null, error: 'Message cannot be empty' };
    }
    
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

      // Verify the sender is actually a participant in this conversation
      if (!participants.includes(data.senderId)) {
        throw new Error('Forbidden: you are not a participant in this conversation');
      }

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
    where("participants", "array-contains", userId)
  );
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    list.sort((a: any, b: any) => {
      const timeA = a.lastMessageTime?.toDate 
        ? a.lastMessageTime.toDate().getTime() 
        : new Date(a.lastMessageTime || 0).getTime();
      const timeB = b.lastMessageTime?.toDate 
        ? b.lastMessageTime.toDate().getTime() 
        : new Date(b.lastMessageTime || 0).getTime();
      return timeB - timeA;
    });
    callback(list);
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

/**
 * Toggles a message reaction in Firestore
 */
export async function toggleMessageReaction(chatId: string, messageId: string, emoji: string, userId: string, currentReactions: any) {
  try {
    const messageRef = doc(db, "messages", chatId, "messages", messageId);
    const reactions = currentReactions ? { ...currentReactions } : {};
    const users = reactions[emoji] ? [...reactions[emoji]] : [];
    
    if (users.includes(userId)) {
      reactions[emoji] = users.filter((uid: string) => uid !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    } else {
      reactions[emoji] = [...users, userId];
    }
    
    await updateDoc(messageRef, { reactions });
  } catch (err) {
    console.error("Error toggling reaction:", err);
  }
}
