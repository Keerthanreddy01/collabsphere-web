import { db } from './firebase'
import { 
  collection, addDoc, getDocs, 
  query, orderBy, where,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore'

export async function createProject(project: object) {
  try {
    const docRef = await addDoc(
      collection(db, 'projects'), 
      {
        ...project,
        created_at: new Date().toISOString(),
      }
    )
    return { data: { id: docRef.id }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getAllProjects() {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'projects'),
        orderBy('created_at', 'desc')
      )
    )
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: projects, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function getUserProjects(userId: string) {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'projects'),
        where('uid', '==', userId),
        orderBy('created_at', 'desc')
      )
    )
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { data: projects, error: null }
  } catch (error) {
    return { data: [], error }
  }
}
