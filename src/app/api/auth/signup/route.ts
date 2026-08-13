import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/auth/db";
import { hashPassword, signToken } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export async function POST(request: Request) {
  try {
    // 1. Rate Limit signup attempts per IP (max 5 per minute)
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateCheck = checkRateLimit(`signup_${ip}`, 5, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    // 2. Input Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    // 3. Check for existing user
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 4. Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = createUser({
      email,
      name,
      passwordHash,
    });

    // 5. Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
