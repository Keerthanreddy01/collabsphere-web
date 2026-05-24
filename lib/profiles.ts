import { db } from './firebase'
import { 
  doc, getDoc, setDoc, updateDoc, 
  collection, getDocs, query, 
  where, orderBy, addDoc, getCountFromServer
} from 'firebase/firestore'

export async function getProfile(userId: string) {
  try {
    const docRef = doc(db, 'builder_profiles', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null }
    }
    return { data: null, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function createProfile(profile: {
  uid: string
  full_name?: string
  avatar_url?: string
  email?: string
  username?: string
  stack?: string[]
}) {
  try {
    await setDoc(doc(db, 'builder_profiles', profile.uid), {
      availability: 'open',
      onboarding_completed: false,
      stack: [],
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return { data: profile, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateProfile(
  userId: string,
  updates: object
) {
  try {
    const docRef = doc(db, 'builder_profiles', userId)
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    })
    return { data: updates, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getAllProfiles() {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'builder_profiles')
    )
    const profiles = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: profiles, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function connectToBuilder(followerId: string, followingId: string) {
  try {
    const connId = `${followerId}_${followingId}`
    const docRef = doc(db, 'connections', connId)
    await setDoc(docRef, {
      follower_id: followerId,
      following_id: followingId,
      created_at: new Date().toISOString()
    })
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function getUserStats(userId: string) {
  try {
    const postsQuery = query(collection(db, 'posts'), where('uid', '==', userId))
    const projectsQuery = query(collection(db, 'projects'), where('uid', '==', userId))
    const connectionsQuery = query(collection(db, 'connections'), where('follower_id', '==', userId))

    const [postsSnap, projectsSnap, connectionsSnap] = await Promise.all([
      getCountFromServer(postsQuery),
      getCountFromServer(projectsQuery),
      getCountFromServer(connectionsQuery)
    ])

    return {
      data: {
        posts: postsSnap.data().count,
        projects: projectsSnap.data().count,
        builders: connectionsSnap.data().count
      },
      error: null
    }
  } catch (error) {
    return { data: { posts: 0, projects: 0, builders: 0 }, error }
  }
}

export async function getUserSpaces(userId: string) {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'spaces'),
        where('created_by', '==', userId),
        orderBy('created_at', 'desc')
      )
    )
    const spaces = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: spaces, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function createSpace(userId: string, space: { label: string, dotColor: string }) {
  try {
    const docRef = await addDoc(collection(db, 'spaces'), {
      ...space,
      created_by: userId,
      created_at: new Date().toISOString()
    })
    return { data: { id: docRef.id, ...space }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

