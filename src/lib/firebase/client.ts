import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
  type ActionCodeSettings,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD4j-ng0SZ-iQZijXn_5hBwp3OnsmaPVmY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vent2corp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vent2corp",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vent2corp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "906806240079",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:906806240079:web:12276b8e3195fdfbe29b3a",
};

// Initialize Firebase Client App (Singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export async function sendVerifiedFirebaseEmail(user: User): Promise<void> {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const actionCodeSettings: ActionCodeSettings = {
    url: `${origin}/app?verified=true`,
    handleCodeInApp: true,
  };
  return sendEmailVerification(user, actionCodeSettings);
}

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  firebaseSignOut,
  updateProfile,
  type User,
};
