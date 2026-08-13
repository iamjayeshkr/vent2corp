import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/auth/db";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-auth-token");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const user = getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
