import type { ExtractedContext } from "./analyzer";

export interface QualityValidationResult {
  passed: boolean;
  score: number;
  missingPoints: string[];
  hallucinatedPoints: string[];
  reasons: string[];
}

const ROBOTIC_FILLERS = [
  "i hope this email finds you well",
  "i hope this message finds you well",
  "i would like to kindly request",
  "as per my previous email",
  "at your earliest convenience",
  "please do the needful",
  "kindly look into the same",
];

const PROFANITY_WORDS = [
  "bc",
  "bsdk",
  "saale",
  "chutiya",
  "gand",
  "gandu",
  "fuck",
  "shit",
  "bitch",
  "bastard",
];

export function validateMessage(
  originalInput: string,
  generatedMessage: string,
  extractedContext: ExtractedContext
): QualityValidationResult {
  const genLower = generatedMessage.toLowerCase();
  const missingPoints: string[] = [];
  const hallucinatedPoints: string[] = [];
  const reasons: string[] = [];
  let score = 100;

  // 1. Check for Robotic Fillers
  for (const filler of ROBOTIC_FILLERS) {
    if (genLower.includes(filler)) {
      score -= 20;
      reasons.push(`Contains robotic cliché filler: "${filler}"`);
    }
  }

  // 2. Check for Profanity Removal
  for (const word of PROFANITY_WORDS) {
    if (genLower.includes(word)) {
      score -= 30;
      reasons.push(`Contains unstripped profanity: "${word}"`);
    }
  }

  // 3. Fact Preservation Check: Numbers
  for (const num of extractedContext.numbers) {
    if (!generatedMessage.includes(num)) {
      score -= 15;
      missingPoints.push(`Number "${num}" missing from output`);
      reasons.push(`Failed to preserve exact number: ${num}`);
    }
  }

  // 4. Fact Preservation Check: Deadlines / Dates
  for (const deadline of extractedContext.deadlines) {
    if (!genLower.includes(deadline.toLowerCase())) {
      score -= 15;
      missingPoints.push(`Deadline "${deadline}" missing from output`);
      reasons.push(`Failed to preserve deadline/date: ${deadline}`);
    }
  }

  // 5. Fact Preservation Check: Technical Terms
  for (const tech of extractedContext.technicalTerms) {
    if (!genLower.includes(tech.toLowerCase())) {
      score -= 15;
      missingPoints.push(`Technical term "${tech}" missing from output`);
      reasons.push(`Failed to preserve technical term: ${tech}`);
    }
  }

  // 6. Hallucination Check: Non-existent names or meetings
  if (!originalInput.toLowerCase().includes("client") && genLower.includes("client")) {
    score -= 15;
    hallucinatedPoints.push("Invented non-existent 'client'");
    reasons.push("Hallucinated 'client' when not present in input");
  }

  if (!originalInput.toLowerCase().includes("meeting") && genLower.includes("meeting")) {
    score -= 10;
    hallucinatedPoints.push("Invented non-existent 'meeting'");
    reasons.push("Hallucinated 'meeting' when not present in input");
  }

  return {
    passed: score >= 75 && missingPoints.length === 0,
    score: Math.max(0, score),
    missingPoints,
    hallucinatedPoints,
    reasons,
  };
}
