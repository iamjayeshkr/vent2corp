import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/auth/db";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";

function getCookieValue(cookieHeader: string | null, cookieName: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-auth-token");
    const cookieHeader = request.headers.get("cookie");
    const cookieToken = getCookieValue(cookieHeader, "vent2corp_session");
    const headerToken = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : null;
    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // 1. Try Firebase Admin Token Verification
    const firebaseUser = await verifyFirebaseIdToken(token);
    if (firebaseUser) {
      const sessionToken = signToken({
        userId: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.name || "Firebase User",
      });
      const response = NextResponse.json({
        token: sessionToken,
        user: {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.name || "Firebase User",
          createdAt: Date.now(),
        },
      });
      response.cookies.set("vent2corp_session", sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // 2. Fallback to local JWT Token Verification
    const decoded = verifyToken(token);
    if (decoded) {
      const dbUser = getUserById(decoded.userId);
      const user = dbUser || {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        createdAt: Date.now(),
      };

      const response = NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      });
      response.cookies.set("vent2corp_session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
