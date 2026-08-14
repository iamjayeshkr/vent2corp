import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/auth/db";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-auth-token");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    // 1. Try Firebase Admin Token Verification
    const firebaseUser = await verifyFirebaseIdToken(token);
    if (firebaseUser) {
      return NextResponse.json({
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.name || "Firebase User",
          createdAt: Date.now(),
        },
      });
    }

    // 2. Fallback to local JWT Token Verification
    const decoded = verifyToken(token);
    if (decoded) {
      const user = getUserById(decoded.userId);
      if (user) {
        return NextResponse.json({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
          },
        });
      }
    }

    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
