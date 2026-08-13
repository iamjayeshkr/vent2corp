import type { Tone, Recipient, Platform } from "@/types";

export interface RAGExemplar {
  category: string;
  keywords: string[];
  rawVent: string;
  extractedFacts: string[];
  situation: string;
  intent: string;
  emotion: string;
  response: {
    message: string;
    tone: Tone;
    recipient: Recipient;
    platform: Platform;
  };
}

export const WORKPLACE_RAG_EXEMPLARS: RAGExemplar[] = [
  {
    category: "Excessive Interruptions & Scope Creep",
    keywords: ["bula", "nayi requirement", "marad", "biwi", "baap", "call", "bar bar", "har waqt"],
    rawVent: "tera marad hun kya saale jab dekho tab bula leta hai kuch bhi hua jayesh yeh dekhna bc itni toh biwi ko nhi khojta jitna mujhe bulata hai bsdk sudhar ja daily naya requirement yeh nayi woh nhi hua gand mein ghus ja bsdk",
    extractedFacts: [
      "Manager calls/interrupts the user frequently throughout the day",
      "New requirements are introduced daily without scope validation",
      "Current work is interrupted before completion"
    ],
    situation: "Excessive interruptions and daily scope instability",
    intent: "Request boundaries on interruptions and scope freezing",
    emotion: "Furious & Overwhelmed",
    response: {
      message: "I've noticed that I am getting frequent interruptions throughout the day alongside daily requirement changes. This makes it difficult to stay focused on existing tasks and maintain a stable implementation plan. Could we align on our core priorities and establish dedicated focus blocks so I can complete work efficiently?",
      tone: "professional",
      recipient: "manager",
      platform: "slack"
    }
  },
  {
    category: "Requirement Changes & Scope Creep",
    keywords: ["requirement", "change", "scope", "phir se", "badal", "dobara"],
    rawVent: "bhai roz nayi requirement de raha hai aur purani wali abhi complete bhi nahi hui",
    extractedFacts: [
      "New requirements are introduced daily",
      "Previous requirements are still pending completion"
    ],
    situation: "Frequent scope changes before task completion",
    intent: "Freeze scope and finish pending tasks",
    emotion: "Frustrated",
    response: {
      message: "Could we please review and finalize the current requirements before introducing additional scope changes? We are still working through the previous requirements, and the frequent changes make it difficult to maintain a clear delivery timeline.",
      tone: "professional",
      recipient: "manager",
      platform: "slack"
    }
  },
  {
    category: "Client Pressure & Unrealistic Timelines",
    keywords: ["client", "jaldi", "sar pe", "khada", "asap", "fauran"],
    rawVent: "jaldi kar bhai client sar pe khada hai aur dimag kharab kar raha hai fauran chahiye",
    extractedFacts: [
      "Client is urgently demanding immediate status updates",
      "Immediate action needed to manage client expectation"
    ],
    situation: "High client pressure on deliverable timeline",
    intent: "Urgent prioritization request",
    emotion: "Urgent",
    response: {
      message: "Could we please bump this deliverable up our queue? The client is currently awaiting an immediate status update, so expediting this will help us maintain a strong relationship.",
      tone: "professional",
      recipient: "coworker",
      platform: "slack"
    }
  },
  {
    category: "Poor Quality Work & Missing Specs",
    keywords: ["bakwas", "kharab", "kya banaya", "galat", "shoddy"],
    rawVent: "kya bakwas kaam bana ke bheja hai ek bhi spec match nahi kar raha pagal hai kya",
    extractedFacts: [
      "Current deliverable does not match specs",
      "Quality does not meet project standards"
    ],
    situation: "Subpar quality and spec mismatch",
    intent: "Request review and revision based on specs",
    emotion: "Annoyed",
    response: {
      message: "I reviewed the recent submission and noticed several deviations from the agreed specifications. Let's schedule a brief review to walk through the required revisions before we move forward.",
      tone: "professional",
      recipient: "coworker",
      platform: "slack"
    }
  },
  {
    category: "Unrealistic Commitments to Client",
    keywords: ["commit", "client ko bol diya", "puchhi bina", "wada"],
    rawVent: "bhai client ko commitment de diya mere se puchhe bina ki aaj shaam tak ho jayega ab kaise karun",
    extractedFacts: [
      "Deadline was committed to client without consulting engineering",
      "Timeline is unrealistic for current scope"
    ],
    situation: "Unvetted client commitment creating timeline risk",
    intent: "Realign client timeline and establish realistic estimates",
    emotion: "Stressed",
    response: {
      message: "I noticed the client was promised a delivery by this evening. Because the scope requires additional technical validation, committing to today's deadline introduces risk. Could we communicate a revised timeline to the client so we can deliver a reliable solution?",
      tone: "firm",
      recipient: "manager",
      platform: "slack"
    }
  },
  {
    category: "Excessive Follow-ups & Micromanagement",
    keywords: ["puck", "puchta", "hua ki nahi", "ping", "har minute", "micromanage"],
    rawVent: "saala har 5 minute mein message karke puch raha hai hua ki nahi bhai kaam karun ki tera message reply karun",
    extractedFacts: [
      "Excessive status check-ins interrupting active development work",
      "Frequent messaging slowing down task execution"
    ],
    situation: "High-frequency status requests slowing execution",
    intent: "Establish status update schedule and focus time",
    emotion: "Frustrated",
    response: {
      message: "I am actively focused on getting this task completed. Frequent status pings mid-development slow down progress. I will post a comprehensive status update by end of day so I can stay focused on execution.",
      tone: "firm",
      recipient: "coworker",
      platform: "slack"
    }
  },
  {
    category: "Overtime & Meeting Frustration",
    keywords: ["6 baje", "night", "meeting", "der raat", "overtime", "late"],
    rawVent: "din bhar kaam karwa ke 6 baje shaam ko 2 ghante ki meeting rakh deta hai bc dimaag ka dahi ho gaya hai",
    extractedFacts: [
      "Long meetings scheduled late in the workday",
      "Creates fatigue and impacts work-life balance"
    ],
    situation: "Late evening meetings scheduled after full work hours",
    intent: "Request earlier meeting scheduling and clear agendas",
    emotion: "Exhausted",
    response: {
      message: "Scheduling extended meetings late in the evening makes it challenging to maintain focus after a full development day. Could we try scheduling these discussions earlier in the day or sharing an agenda in advance so we can keep them concise?",
      tone: "diplomatic",
      recipient: "manager",
      platform: "slack"
    }
  }
];

export function getRAGExemplars(text: string): RAGExemplar[] {
  const lower = text.toLowerCase();
  const matched = WORKPLACE_RAG_EXEMPLARS.filter((e) =>
    e.keywords.some((k) => lower.includes(k))
  );

  if (matched.length > 0) {
    return matched.slice(0, 3);
  }

  // Default default exemplars
  return WORKPLACE_RAG_EXEMPLARS.slice(0, 2);
}
