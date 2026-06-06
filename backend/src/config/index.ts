import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",

  // CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Firebase client config (for reference / forwarding)
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
  },

  // Firebase Admin SDK (server-only — never expose to client)
  firebaseAdmin: {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "",
    privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
  },
};
