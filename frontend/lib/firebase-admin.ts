/**
 * lib/firebase-admin.ts
 * Server-side Firebase Admin SDK initialization.
 *
 * This module is for API routes and server components ONLY.
 * Never import this from client-side code.
 *
 * Required environment variables (in .env.local, NEVER committed):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 *
 * Get these from Firebase Console →
 *   Project Settings → Service Accounts → Generate New Private Key
 */

import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Only initialize if credentials are available
  if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
    initializeApp({ credential: cert(serviceAccount) });
  } else {
    console.warn(
      '[firebase-admin] Missing credentials. Server-side Firebase operations will be unavailable.'
    );
  }
}

export const adminDb = getApps().length > 0 ? getFirestore() : null;
