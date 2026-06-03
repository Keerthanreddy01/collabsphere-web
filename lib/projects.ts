import { db } from './firebase'
import { 
  collection, addDoc, getDocs, 
  query, orderBy, where,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore'

import { sanitizeShortText, sanitizeBio } from "./sanitize";

export interface ProjectData {
  uid: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  team: string[];
  github_url?: string;
  live_url?: string;
  status: "SHIPPED" | "LIVE" | "BETA" | "OPEN SOURCE";
  author_name?: string;
  author_avatar?: string;
}

export async function createProject(project: ProjectData) {
  try {
    const docRef = await addDoc(
      collection(db, 'projects'), 
      {
        ...project,
        name: sanitizeShortText(project.name),
        tagline: sanitizeShortText(project.tagline),
        description: sanitizeBio(project.description),
        created_at: new Date().toISOString(),
        likes: [],
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
