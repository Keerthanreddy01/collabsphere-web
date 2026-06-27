import { initializeApp, getApps } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth'
import { getFirestore, initializeFirestore, setLogLevel } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// If no API key is provided, skip initializing Firebase to avoid runtime errors
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

  // App Check — blocks unauthorized access (e.g., Postman, scripts)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
        ),
        isTokenAutoRefreshEnabled: true,
      })
    } catch (e) {
      // App Check may already be initialized on hot-reload
    }
  }

  auth = getAuth(app)
  // set persistence but guard in case auth initialization fails
  try {
    setPersistence(auth, browserLocalPersistence)
  } catch (e) {
    // ignore persistence errors during local/dev when auth is not fully configured
  }
  try {
    db = initializeFirestore(app, {})
  } catch (e) {
    db = getFirestore(app)
  }
  setLogLevel('error')
  storage = getStorage(app)
}

export { auth, db, storage }
export default app

