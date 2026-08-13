import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/auth/db";
import { signToken } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateCheck = checkRateLimit(`verify_otp_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please try again in ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, otpCode } = body;

    if (!email || !otpCode || typeof email !== "string" || typeof otpCode !== "string") {
      return NextResponse.json(
        { error: "Email and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      const token = signToken({ userId: user.id, email: user.email, name: user.name });
      return NextResponse.json({
        message: "Email already verified.",
        token,
        user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
      });
    }

    if (!user.otpCode || user.otpCode !== otpCode.trim()) {
      return NextResponse.json(
        { error: "Invalid 6-digit verification code. Please check and try again." },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt && Date.now() > user.otpExpiresAt) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    // Activate user account
    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    updateUser(user);

    // Issue JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      message: "Email verified successfully!",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
