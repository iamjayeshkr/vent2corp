import { NextResponse } from "next/server";
import { createAIProvider } from "@/lib/ai/provider";
import type { TranslationRequest } from "@/types";

export async function POST(request: Request) {
  try {
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
