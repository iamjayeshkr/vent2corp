import { NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/provider";
import { verifyToken } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import type { TranslationRequest } from "@/types";

export async function POST(request: Request) {
  try {
    // 1. Authentication Check (Firebase ID Token, Local JWT, or Access Key)
    const authHeader = request.headers.get("authorization") || request.headers.get("x-auth-token") || "";
    const accessKeyHeader = request.headers.get("x-access-key") || "";

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    let userId: string | null = null;

    if (token) {
      const firebaseUser = await verifyFirebaseIdToken(token);
      if (firebaseUser) {
        userId = firebaseUser.uid;
      } else {
        const decodedUser = verifyToken(token);
        if (decodedUser) {
          userId = decodedUser.userId;
        }
      }
    }

    const configuredKey = (process.env.APP_ACCESS_KEY || "corporate2026").trim();
    const isAccessKeyValid = accessKeyHeader.trim() === configuredKey;

    if (!userId && !isAccessKeyValid) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in or sign up to access vent2corp translation APIs." },
        { status: 401 }
      );
    }

    // 2. User & IP Rate Limiting (15 translations / min)
    const rateLimitId = userId ? `usr_${userId}` : `ip_${request.headers.get("x-forwarded-for") || "anonymous"}`;
    const rateCheck = checkRateLimit(rateLimitId, 15, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded (max 15 requests/min). Please try again in ${rateCheck.resetInSec}s.` },
        { status: 429 }
      );
    }

    // 3. Body Validation & Character Cap
    const body = (await request.json()) as TranslationRequest;

    if (!body.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const trimmed = body.text.trim();
    if (trimmed.length === 0) {
      return NextResponse.json(
        { error: "Text cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Text is too long. Maximum 2000 characters allowed." },
        { status: 400 }
      );
    }

    // 4. Execute AI Translation Pipeline
    const provider = createAIProvider();
    const result = await provider.translate({
      text: trimmed,
      tone: body.tone ?? "professional",
      recipient: body.recipient ?? "manager",
      platform: body.platform ?? "slack",
      action: body.action,
      previousOutput: body.previousOutput,
    });

    if (!result.message || result.message.trim().length === 0) {
      return NextResponse.json(
        { error: "Failed to generate a response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Give it another shot." },
      { status: 500 }
    );
  }
}
