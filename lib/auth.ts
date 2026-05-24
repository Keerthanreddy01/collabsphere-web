import { auth } from './firebase'
import { 
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  browserPopupRedirectResolver,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth'

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
const githubProvider = new GithubAuthProvider()

export async function signInWithGoogle() {
  try {
    await setPersistence(auth, browserLocalPersistence)
    const result = await signInWithPopup(
      auth, 
      googleProvider,
      browserPopupRedirectResolver
    )
    return { user: result.user, error: null }
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider)
      return { user: null, error: null }
    }
    return { user: null, error }
  }
}

export async function signInWithGithub() {
  try {
    await signInWithRedirect(auth, githubProvider)
    return { user: null, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { data: { user: result.user }, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { data: { user: result.user }, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

export async function getUser() {
  const user = auth.currentUser
  return { user, error: null }
}

export async function getSession() {
  const user = auth.currentUser
  return { session: user ? { user } : null, error: null }
}
