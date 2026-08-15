import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export interface VerifiedFirebaseUser {
  uid: string;
  email?: string;
  name?: string;
  emailVerified?: boolean;
}

if (!getApps().length) {
  try {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vent2corp";

    if (clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      initializeApp({
        projectId,
      });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export const adminAuth = getApps().length ? getAuth() : null;

async function verifyWithFirebaseRest(token: string): Promise<VerifiedFirebaseUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const payload = await response.json() as {
      users?: Array<{ localId?: string; email?: string; displayName?: string; emailVerified?: boolean; disabled?: boolean }>;
    };
    const user = payload.users?.[0];
    if (!user?.localId || user.disabled) return null;

    return {
      uid: user.localId,
      email: user.email,
      name: user.displayName,
      emailVerified: user.emailVerified,
    };
  } catch {
    return null;
  }
}

export async function verifyFirebaseIdToken(token: string): Promise<VerifiedFirebaseUser | null> {
  if (adminAuth) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        emailVerified: decodedToken.email_verified,
      };
    } catch {
      // Local development may not have a Firebase service-account credential.
      // The Firebase Auth REST endpoint still validates the ID token over HTTPS.
    }
  }

  return verifyWithFirebaseRest(token);
}
