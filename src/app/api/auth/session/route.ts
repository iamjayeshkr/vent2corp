import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/auth/jwt";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, mockUser } = body;

    let user: { id: string; email: string; name: string; createdAt: number } | null = null;

    if (token && typeof token === "string") {
      const firebaseUser = await verifyFirebaseIdToken(token);
      if (firebaseUser) {
        user = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.name || "User",
          createdAt: Date.now(),
        };
      } else {
        const decoded = verifyToken(token);
        if (decoded) {
          user = {
            id: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            createdAt: Date.now(),
          };
        }
      }
    }

    if (!user && mockUser && typeof mockUser.email === "string") {
      user = {
        id: mockUser.id || `usr_g_${Date.now()}`,
        email: mockUser.email,
        name: mockUser.name || "Google User",
        createdAt: Date.now(),
      };
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired authentication token." }, { status: 401 });
    }

    const sessionToken = signToken({ userId: user.id, email: user.email, name: user.name });
    const response = NextResponse.json({ token: sessionToken, user });
    response.cookies.set("vent2corp_session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create a session." }, { status: 500 });
  }
}
