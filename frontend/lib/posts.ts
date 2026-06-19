import { db, auth } from './firebase'
import { 
  collection, addDoc, getDocs,
  query, orderBy, doc, updateDoc,
  increment, getDoc, arrayUnion, arrayRemove
} from 'firebase/firestore'
import { sanitizePost } from './sanitize'

export async function createPost(post: {
  uid: string
  author_name: string
  // author_email intentionally removed — do NOT store email in post documents (PII)
  author_avatar: string
  author_username: string
  content: string
  stack_tags: string[]
  post_type: 'update' | 'looking_for' | 'build_log'
  visibility?: 'public' | 'collabs'
  project?: string | null
}) {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('Must be logged in to post')
    }
    if (!post.content || post.content.trim().length === 0) {
      throw new Error('Post content cannot be empty')
    }
    if (post.content.length > 2000) {
      throw new Error('Post too long')
    }

    // Sanitize all user-provided content before storing
    const safePost = sanitizePost(post as Record<string, unknown>)
    const docRef = await addDoc(
      collection(db, 'posts'),
      {
        ...safePost,
        likes: [],
        comments_count: 0,
        views: 0,
        created_at: new Date().toISOString(),
      }
    )
    return { data: { id: docRef.id }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getAllPosts() {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'posts'),
        orderBy('created_at', 'desc')
      )
    )
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: posts, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function likePost(postId: string, userId: string) {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    if (!postSnap.exists()) {
      return { error: 'Post not found' }
    }
    const data = postSnap.data()
    const likes = Array.isArray(data.likes) ? data.likes : []
    
    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      })
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      })
    }
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function incrementViews(postId: string) {
  try {
    const postRef = doc(db, 'posts', postId)
    await updateDoc(postRef, {
      views_count: increment(1)
    })
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function addComment(postId: string, comment: {
  uid: string
  author_name: string
  author_avatar: string
  author_username: string
  content: string
}) {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments')
    await addDoc(commentsRef, {
      ...comment,
      created_at: new Date().toISOString(),
    })
    await updateDoc(doc(db, 'posts', postId), {
      comments_count: increment(1)
    })
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function getComments(postId: string) {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments')
    const querySnapshot = await getDocs(
      query(commentsRef, orderBy('created_at', 'asc'))
    )
    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: comments, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export function computePostScore(post: any): number {
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const commentsCount = post.comments_count || 0;
  const viewsCount = post.views_count || 0;
  
  let recencyBoost = 0;
  if (post.created_at) {
    const hoursSincePost = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursSincePost < 1) {
      recencyBoost = 50;
    } else if (hoursSincePost < 6) {
      recencyBoost = 30;
    } else if (hoursSincePost < 24) {
      recencyBoost = 10;
    }
  }
  
  return (likesCount * 3) + (commentsCount * 5) + (viewsCount * 0.5) + recencyBoost;
}


