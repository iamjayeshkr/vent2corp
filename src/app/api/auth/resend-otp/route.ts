import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/auth/db";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateCheck = checkRateLimit(`resend_otp_${ip}`, 3, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateCheck.resetInSec}s before requesting another verification code.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email is already verified." });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = newOtp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    updateUser(user);

    console.log(`[EMAIL OTP RESENT] Email: ${user.email} | New OTP Code: ${user.otpCode}`);

    return NextResponse.json({
      message: `A new 6-digit verification code has been sent to ${user.email}.`,
      otpDebugCode: process.env.NODE_ENV !== "production" ? user.otpCode : undefined,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend code." }, { status: 500 });
  }
}
