import type { TranslationRequest, TranslationResult } from "@/types";
import { GeminiAIProvider } from "./gemini";
import { OllamaAIProvider } from "./ollama";
import { MockAIService } from "./mock";

export interface AIProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}

export class FallbackAIProvider implements AIProvider {
  private gemini: GeminiAIProvider;
  private ollama: OllamaAIProvider;
  private mock: MockAIService;

  constructor() {
    this.gemini = new GeminiAIProvider();
    this.ollama = new OllamaAIProvider();
    this.mock = new MockAIService();
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    // 1. Primary: Google Gemini API
    if (this.gemini.hasKey()) {
      try {
        return await this.gemini.translate(request);
      } catch (err) {
        console.warn(
          "[AI Provider] Gemini API failed, falling back to Ollama:",
          err instanceof Error ? err.message : err
        );
      }
    }

    // 2. Secondary: Ollama (qwen2.5:3b)
    try {
      return await this.ollama.translate(request);
    } catch (err) {
      console.warn(
        "[AI Provider] Ollama failed, falling back to Smart Mock:",
        err instanceof Error ? err.message : err
      );
    }

    // 3. Tertiary: Smart Mock Engine
    return await this.mock.translate(request);
  }
}

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER;

  switch (provider) {
    case "gemini":
      return new GeminiAIProvider();
    case "ollama":
      return new OllamaAIProvider();
    case "mock":
      return new MockAIService();
    default:
      return new FallbackAIProvider();
  }
}
