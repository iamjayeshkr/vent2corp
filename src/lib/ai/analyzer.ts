export interface ExtractedContext {
  situation: string;
  emotion: string;
  people: string[];
  facts: string[];
  complaints: string[];
  deadlines: string[];
  numbers: string[];
  technicalTerms: string[];
  desiredOutcome: string;
  isContradictory: boolean;
  confidence: number;
}

export function analyzeRawInput(input: string): ExtractedContext {
  const text = input.trim();
  const lower = text.toLowerCase();

  const facts: string[] = [];
  const complaints: string[] = [];
  const deadlines: string[] = [];
  const numbers: string[] = [];
  const technicalTerms: string[] = [];
  const people: string[] = [];

  // Extract Dates & Deadlines (e.g. 25 august, kal, today, 2 hours, 5pm)
  const dateRegex = /\b(\d{1,2}\s*(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)|kal|today|tonight|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d+\s*(?:hours?|hrs?|days?|weeks?|mins?))\b/gi;
  let dateMatch;
  while ((dateMatch = dateRegex.exec(text)) !== null) {
    deadlines.push(dateMatch[0]);
  }

  // Extract Numbers & Currency (e.g. ₹50,000, 50000, 500, 5 times)
  const numRegex = /(?:₹|\$|rs\.?|inr)?\s*\b\d+(?:,\d+)*(?:\.\d+)?\b/gi;
  let numMatch;
  while ((numMatch = numRegex.exec(text)) !== null) {
    if (!deadlines.includes(numMatch[0])) {
      numbers.push(numMatch[0]);
    }
  }

  // Extract Technical Terms (API, HTTP 500, DB, Frontend, Backend, ERP, PR, deployment)
  const techRegex = /\b(api|500|404|http|frontend|backend|database|db|erp|pr|deploy(?:ment)?|server|bug|fallback|endpoint|auth|jwt|git|aws|docker)\b/gi;
  let techMatch;
  while ((techMatch = techRegex.exec(text)) !== null) {
    technicalTerms.push(techMatch[0]);
  }

  // Detect People / Roles (Jayesh, manager, client, biwi, team, lead, HR)
  const peopleRegex = /\b(jayesh|manager|client|lead|boss|coworker|junior|senior|hr|director|vp|team|dev|developer)\b/gi;
  let peopleMatch;
  while ((peopleMatch = peopleRegex.exec(text)) !== null) {
    people.push(peopleMatch[0]);
  }

  // Analyze Complaint Vectors
  if (lower.includes("bula") || lower.includes("call") || lower.includes("interrupt")) {
    complaints.push("frequent status calls and workflow interruptions");
  }
  if (lower.includes("naya requirement") || lower.includes("scope") || lower.includes("change")) {
    complaints.push("frequent and unstable requirement changes");
  }
  if (lower.includes("focus") || lower.includes("gand mein") || lower.includes("dikkat")) {
    complaints.push("difficulty maintaining focus on core deliverables");
  }
  if (lower.includes("priority") || lower.includes("samajh nahi")) {
    complaints.push("lack of clear task prioritization");
  }
  if (lower.includes("client kal") || lower.includes("demo kal") || lower.includes("deadline")) {
    complaints.push("unrealistic timeline or external client commitment pressure");
  }

  // Detect contradiction (e.g., kal tak VS next week)
  const isContradictory = lower.includes("but actually") || (lower.includes("kal") && lower.includes("next week"));

  return {
    situation: complaints.length > 0 ? complaints.join("; ") : "workplace task discussion",
    emotion: lower.includes("bc") || lower.includes("bsdk") || lower.includes("saale") ? "high frustration / anger" : "neutral",
    people: Array.from(new Set(people)),
    facts: facts.length > 0 ? facts : [text],
    complaints: Array.from(new Set(complaints)),
    deadlines: Array.from(new Set(deadlines)),
    numbers: Array.from(new Set(numbers)),
    technicalTerms: Array.from(new Set(technicalTerms)),
    desiredOutcome: "request priority alignment and focused execution blocks",
    isContradictory,
    confidence: 0.92,
  };
}
