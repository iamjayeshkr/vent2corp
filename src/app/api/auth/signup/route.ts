import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/auth/db";
import { hashPassword } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { sendVerificationEmail } from "@/lib/email";

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

    // 3. Check for existing verified user
    const existing = getUserByEmail(email);
    if (existing && existing.emailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 4. Generate 6-digit OTP code & 10-min expiration
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;
    const passwordHash = await hashPassword(password);

    let user;
    if (existing && !existing.emailVerified) {
      existing.passwordHash = passwordHash;
      existing.name = name.trim();
      existing.otpCode = otpCode;
      existing.otpExpiresAt = otpExpiresAt;
      const { updateUser } = await import("@/lib/auth/db");
      user = updateUser(existing);
    } else {
      user = createUser({
        email,
        name,
        passwordHash,
        emailVerified: false,
        otpCode,
        otpExpiresAt,
      });
    }

    // 5. Dispatch Real SMTP Email
    await sendVerificationEmail({
      toEmail: user.email,
      userName: user.name,
      otpCode: user.otpCode!,
    });

    return NextResponse.json({
      requiresVerification: true,
      email: user.email,
      message: `A 6-digit verification code has been sent to ${user.email}. Check your inbox.`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
