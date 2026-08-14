import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/auth/db";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { sendFirebaseVerificationNotice } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "client_ip";
    const rateCheck = checkRateLimit(`resend_otp_${ip}`, 3, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Please wait ${rateCheck.resetInSec}s before requesting another verification email.` },
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

    const notice = await sendFirebaseVerificationNotice({
      toEmail: user.email,
      userName: user.name,
    });

    return NextResponse.json({
      message: notice.message,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Failed to resend verification email." }, { status: 500 });
  }
}
