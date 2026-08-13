import type {
  AIProvider,
  TranslationRequest,
  TranslationResult,
} from "@/types";
import { cleanAndFormatMessage } from "./formatter";
import { getRAGExemplars } from "./rag";

export class GeminiAIProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    this.apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      "";
  }

  hasKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    if (!this.hasKey()) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const prompt = this.buildPrompt(request);

    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];

    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const result = await this.callGeminiModel(model, prompt, request);
        if (result) return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError || new Error("Gemini API translation failed across all models");
  }

  private async callGeminiModel(
    model: string,
    prompt: string,
    request: TranslationRequest
  ): Promise<TranslationResult | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${model}): ${res.status} ${errText}`);
    }

    const data = await res.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error(`Gemini (${model}) returned an empty response`);
    }

    return this.parseResponse(candidateText, request);
  }

  private buildPrompt(request: TranslationRequest): string {
    let actionInstruction = "";
    if (request.action) {
      switch (request.action) {
        case "shorter":
          actionInstruction = `\nACTION MODIFIER: Make this message significantly more concise and direct (under 1-2 short sentences max), while strictly retaining all core facts.`;
          break;
        case "more-professional":
          actionInstruction = `\nACTION MODIFIER: Make this message executive-ready with elevated corporate vocabulary and flawless structure.`;
          break;
        case "more-direct":
          actionInstruction = `\nACTION MODIFIER: Eliminate any soft phrasing or hesitation. Make the request ultra-direct and boundary-setting.`;
          break;
        case "regenerate":
          actionInstruction = `\nACTION MODIFIER: Provide a fresh, alternative rephrasing of this message.`;
          break;
      }
    }

    const exemplars = getRAGExemplars(request.text);
    const exemplarText = exemplars
      .map(
        (e) => `
EXEMPLAR SCENARIO (${e.category}):
Raw Vent: "${e.rawVent}"
Extracted Workplace Facts:
${e.extractedFacts.map((f) => `- ${f}`).join("\n")}
Target Response (${e.response.tone}, ${e.response.recipient}, ${e.response.platform}):
"${e.response.message}"
`
      )
      .join("\n");

    return `You are vent2corp, an advanced AI system operating as an EMOTIONAL VENT -> PROFESSIONAL COMMUNICATION ENGINE.

You are NOT a simple rewriter, grammar checker, or translator.
Your job is to take raw, messy, highly emotional vents (containing Hindi, Hinglish, English, slang, profanity, insults, sarcasm, and multiple complaints) and transform them into clear, natural, highly professional workplace messages.

CORE TRANSFORMATION PIPELINE:
1. UNDERSTAND THE FULL VENT: The user is allowed to vent completely without judgment.
2. EXTRACT ALL DISTINCT WORKPLACE FACTS: Identify every single underlying complaint (e.g. frequent interruptions, changing scope, missed deadlines, unrealistic client promises). DO NOT reduce multiple complaints into 1 generic sentence!
3. SEPARATE EMOTION FROM FACT: Strip profanity ("chutiya", "bc", "bsdk", "gandu"), insults, and emotional rage, but KEEP the underlying workplace dissatisfaction and urgency.
4. DO NOT INVENT INFORMATION: Never invent non-existent meetings, deadlines, names, or project details.
5. NO ROBOTIC FILLER: Avoid artificial corporate clichés like "I hope this email finds you well", "I would like to kindly request", or "As per my previous email". Make the output sound like a real, experienced employee.
6. TARGET SPECIFICS:
   - Requested Tone: ${request.tone} (Must materially change the phrasing!)
   - Target Recipient: ${request.recipient}
   - Target Platform: ${request.platform}

CURATED FEW-SHOT RAG EXEMPLARS:
${exemplarText}

USER VENT TO TRANSFORM:
Input Vent: "${request.text}"
Tone: ${request.tone}
Recipient: ${request.recipient}
Platform: ${request.platform}${actionInstruction}

Return ONLY a valid JSON object matching the schema:
{
  "message": "the clear, natural, fact-preserved corporate message for ${request.platform}",
  "tone": "${request.tone}",
  "intent": "short 2-4 word summary of primary workplace request",
  "emotion": "detected emotion in raw vent"
}`;
  }

  private parseResponse(
    rawText: string,
    request: TranslationRequest
  ): TranslationResult {
    let finalMessage = rawText.trim();
    let intent = "General communication";
    let emotion = "Neutral";

    try {
      const cleaned = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");

      const parsed = JSON.parse(cleaned);

      if (parsed && typeof parsed.message === "string" && parsed.message.trim().length > 0) {
        finalMessage = parsed.message.trim();
        if (typeof parsed.intent === "string") intent = parsed.intent;
        if (typeof parsed.emotion === "string") emotion = parsed.emotion;
      } else if (parsed && typeof parsed.body === "string") {
        finalMessage = parsed.subject ? `Subject: ${parsed.subject}\n\n${parsed.body}` : parsed.body;
      }
    } catch {
      // Fallback to raw text if JSON parse failed
    }

    // Safety check: If output still contains raw profanity or meta chatter, throw error to fallback
    const lowerMsg = finalMessage.toLowerCase();
    if (
      /\b(chutiya|bc|mc|gandu|bsdk|madarchod|behenchod)\b/i.test(lowerMsg) ||
      /\b(employee's tone|informal query|here's a more formal)\b/i.test(lowerMsg)
    ) {
      throw new Error("Gemini output contained raw profanity or meta-commentary");
    }

    // Clean and format message cleanly using shared formatter
    finalMessage = cleanAndFormatMessage(finalMessage, request.platform, request.recipient, intent);

    return {
      message: finalMessage,
      tone: request.tone,
      intent,
      emotion,
    };
  }
}
