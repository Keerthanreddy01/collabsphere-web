import { db } from './firebase'
import { 
  collection, addDoc, getDocs,
  query, orderBy, doc, updateDoc,
  increment, getDoc, arrayUnion, arrayRemove
} from 'firebase/firestore'

export async function createPost(post: {
  uid: string
  author_name: string
  author_email: string
  author_avatar: string
  author_username: string
  content: string
  stack_tags: string[]
  post_type: 'update' | 'looking_for' | 'build_log'
}) {
  try {
    const docRef = await addDoc(
      collection(db, 'posts'),
      {
        ...post,
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

export function computePostScore(post: any, userStack: string[] = []): number {
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const commentsCount = post.comments_count || 0;
  
  // recency_score = max(0, 100 - hours_since_post * 2)
  let recencyScore = 0;
  if (post.created_at) {
    const hoursSincePost = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
    recencyScore = Math.max(0, 100 - hoursSincePost * 2);
  }
  
  // relevance_score = if post.stack_tags overlaps with user.stack then +20 else 0
  let relevanceScore = 0;
  if (Array.isArray(post.stack_tags) && Array.isArray(userStack) && userStack.length > 0) {
    const hasOverlap = post.stack_tags.some((tag: string) => 
      userStack.some((uTag: string) => uTag.toLowerCase() === tag.toLowerCase())
    );
    if (hasOverlap) {
      relevanceScore = 20;
    }
  }
  
  return (likesCount * 3) + (commentsCount * 2) + recencyScore + relevanceScore;
}


