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

