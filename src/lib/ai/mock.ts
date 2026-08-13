import type {
  AIProvider,
  TranslationRequest,
  TranslationResult,
  Tone,
} from "@/types";
import { cleanAndFormatMessage } from "./formatter";
import { analyzeRawInput } from "./analyzer";
import { validateMessage } from "./validator";

interface PatternMatch {
  patterns: string[];
  intent: string;
  emotion: string;
  responses: Record<Tone, string>;
}

const PATTERN_MATCHES: PatternMatch[] = [
  {
    patterns: [
      "marad",
      "biwi",
      "baap",
      "jayesh",
      "bula leta hai",
      "bulata hai",
      "daily naya requirement",
      "naya requirement",
    ],
    intent: "Boundary & scope alignment",
    emotion: "Overwhelmed",
    responses: {
      professional:
        "I've noticed that I am getting frequent interruptions throughout the day alongside daily requirement changes. This makes it difficult to stay focused on existing tasks and maintain a stable implementation plan. Could we align on our core priorities and establish dedicated focus blocks so I can complete work efficiently?",
      polite:
        "I wanted to gently bring up that frequent pings and daily scope updates are making it a bit challenging to complete our existing tasks. Would it be possible to lock in our priorities so I can focus on execution?",
      friendly:
        "Hey! The frequent pings and changing requirements are making it a little tricky to stay focused on execution. Mind if we lock in our priorities for the sprint so I can knock these out?",
      firm: "The constant interruptions and daily requirement changes are severely impacting work execution. We need to freeze current requirements and establish clear focus blocks before taking on new requests.",
      diplomatic:
        "I wanted to flag that balancing ongoing interruptions with evolving daily scope is creating some friction. Establishing dedicated focus blocks and a stabilized scope would significantly enhance our delivery.",
      "passive-aggressive":
        "I noticed new requirements and check-ins are coming in regularly throughout the day. Just ensuring we're leaving enough continuous focus time to finish the work already in progress.",
    },
  },
  {
    patterns: [
      "api ka response 500",
      "500 de raha hai",
      "fallback handle",
      "frontend mein fallback",
    ],
    intent: "Technical error handling",
    emotion: "Technical issue",
    responses: {
      professional:
        "The API is currently returning a 500 response, and the frontend does not appear to have a fallback for this scenario. Could we address the error handling before proceeding further?",
      polite:
        "I noticed the API is currently returning a 500 error, and there doesn't seem to be a frontend fallback handled yet. Could we look into adding proper error handling?",
      friendly:
        "Hey! The API is throwing a 500 error right now and the frontend needs fallback handling for it. Mind checking the error handling?",
      firm: "The API is throwing a 500 server error and the frontend lacks fallback handling. This needs immediate resolution before release.",
      diplomatic:
        "I wanted to flag that the API is returning a 500 error while the frontend lacks fallback handling. Resolving this will ensure a resilient user experience.",
      "passive-aggressive":
        "Just noticing the API is returning a 500 error without frontend fallback handling. Should we add error handling or leave it as is?",
    },
  },
];

export class MockAIService implements AIProvider {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

    const lowerText = request.text.toLowerCase();
    const context = analyzeRawInput(request.text);

    // Check pattern matches
    for (const match of PATTERN_MATCHES) {
      if (match.patterns.some((p) => lowerText.includes(p))) {
        let rawMessage = match.responses[request.tone] || match.responses["professional"];

        // Fact preservation enhancement
        if (context.deadlines.length > 0 && !rawMessage.toLowerCase().includes(context.deadlines[0].toLowerCase())) {
          rawMessage += ` (Target deadline: ${context.deadlines[0]}).`;
        }
        if (context.numbers.length > 0 && !rawMessage.includes(context.numbers[0])) {
          rawMessage += ` (Amount/Number: ${context.numbers[0]}).`;
        }

        const formattedMessage = cleanAndFormatMessage(rawMessage, request.platform, request.recipient, match.intent);
        const validation = validateMessage(request.text, formattedMessage, context);

        return {
          message: formattedMessage,
          tone: request.tone,
          intent: match.intent,
          emotion: match.emotion,
          metadata: {
            score: validation.score,
            confidence: context.confidence,
          },
        };
      }
    }

    // Dynamic Context Building
    const genericMessage = this.buildFactPreservedMessage(request, context);
    const formattedMessage = cleanAndFormatMessage(genericMessage, request.platform, request.recipient, "Workplace communication");
    const validation = validateMessage(request.text, formattedMessage, context);

    return {
      message: formattedMessage,
      tone: request.tone,
      intent: "Workplace communication",
      emotion: context.emotion,
      metadata: {
        score: validation.score,
        confidence: context.confidence,
      },
    };
  }

  private buildFactPreservedMessage(request: TranslationRequest, context: ReturnType<typeof analyzeRawInput>): string {
    const { text, tone } = request;
    const lowerText = text.toLowerCase();

    // Preserve dates, numbers, tech terms
    let factDetails = "";
    if (context.deadlines.length > 0) {
      factDetails += ` regarding ${context.deadlines.join(", ")}`;
    }
    if (context.numbers.length > 0) {
      factDetails += ` (${context.numbers.join(", ")})`;
    }
    if (context.technicalTerms.length > 0) {
      factDetails += ` involving ${context.technicalTerms.join(", ")}`;
    }

    let coreTopic = "our current tasks and priorities";
    if (context.complaints.length > 0) {
      coreTopic = context.complaints.join(" and ");
    } else if (lowerText.includes("requirement")) {
      coreTopic = "the project requirements and scope alignment";
    }

    const templates: Record<Tone, string> = {
      professional: `I wanted to discuss ${coreTopic}${factDetails}. Could we align on the appropriate next steps?`,
      polite: `I hope you're doing well. I wanted to gently bring up ${coreTopic}${factDetails}. Could we review this together?`,
      friendly: `Hey! Just wanted to touch base on ${coreTopic}${factDetails}. Let me know when you're free to connect!`,
      firm: `We need to address ${coreTopic}${factDetails} immediately to stay on track.`,
      diplomatic: `I wanted to reach out regarding ${coreTopic}${factDetails}. It would be great to align on priorities.`,
      "passive-aggressive": `I noticed ${coreTopic}${factDetails} hasn't been finalized yet. Following up to ensure we're aligned.`,
    };

    return templates[tone] || templates["professional"];
  }
}
