import type {
  AIProvider,
  TranslationRequest,
  TranslationResult,
} from "@/types";
import { cleanAndFormatMessage } from "./formatter";
import { getRAGExemplars } from "./rag";

export class OllamaAIProvider implements AIProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.model = process.env.OLLAMA_MODEL || "qwen2.5:3b";
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
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

    const systemPrompt = `You are vent2corp, an advanced AI system operating as an EMOTIONAL VENT -> PROFESSIONAL COMMUNICATION ENGINE.

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

Return ONLY a valid JSON object matching the schema:
{
  "message": "the clear, natural, fact-preserved corporate message for ${request.platform}",
  "tone": "${request.tone}",
  "intent": "short 2-4 word summary of primary workplace request",
  "emotion": "detected emotion in raw vent"
}`;

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

    const userPrompt = `Input Vent: "${request.text}"\nTone: ${request.tone}\nRecipient: ${request.recipient}\nPlatform: ${request.platform}${actionInstruction}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12 sec timeout for local LLM

    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: false,
          format: "json",
        }),
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Ollama API error: ${res.status} ${errText}`);
      }

      const data = await res.json();
      const content = data?.message?.content;

      if (!content || typeof content !== "string") {
        throw new Error("Ollama returned an empty response");
      }

      return this.parseResponse(content, request);
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
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

    // Safety check: If output still contains raw profanity or meta chatter, throw to use MockAIService fallback
    const lowerMsg = finalMessage.toLowerCase();
    if (
      /\b(chutiya|bc|mc|gandu|bsdk|madarchod|behenchod)\b/i.test(lowerMsg) ||
      /\b(employee's tone|informal query|here's a more formal)\b/i.test(lowerMsg)
    ) {
      throw new Error("Ollama output contained raw profanity or meta-commentary");
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
