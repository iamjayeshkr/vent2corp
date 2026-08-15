import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth/db";
import { verifyPassword, signToken } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { sendFirebaseVerificationNotice } from "@/lib/email";

export async function POST(request: Request) {
  try {
    // 1. Brute Force Protection (max 5 login attempts per IP per 5 minutes)
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Locked out for security. Try again in ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // 2. Input Validation
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 3. User Lookup
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Password Verification
    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 5. Check Email Verification
    if (!user.emailVerified) {
      const notice = await sendFirebaseVerificationNotice({
        toEmail: user.email,
        userName: user.name,
      });

      return NextResponse.json(
        {
          requiresVerification: true,
          email: user.email,
          message: notice.message,
        },
        { status: 403 }
      );
    }

    // 6. Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

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
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate. Please try again." },
      { status: 500 }
    );
  }
}
