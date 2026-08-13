import assert from "node:assert";
import { test, describe } from "node:test";
import { MockAIService } from "../mock";
import { analyzeRawInput } from "../analyzer";
import { validateMessage } from "../validator";
import type { Tone, Recipient, Platform } from "@/types";

interface BenchmarkCase {
  id: number;
  name: string;
  input: string;
  tone: Tone;
  recipient: Recipient;
  platform: Platform;
  mustPreserve: string[];
  mustNotContain: string[];
}

const BENCHMARK_SUITE: BenchmarkCase[] = [
  {
    id: 1,
    name: "Gold Standard Jayesh Multi-Fact Rant",
    input: "tera marad hun kya saale jab dekho tab bula leta hai kuch bhi hua jayesh yeh dekhna bc itni toh biwi ko nhi khojta jitna mujhe bulata hai bsdk sudhar ja daily naya requirement yeh nayi woh nhi hua gand mein ghus ja bsdk",
    tone: "professional",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["frequent interruptions", "daily requirement changes"],
    mustNotContain: ["bc", "bsdk", "marad", "biwi", "gand"],
  },
  {
    id: 2,
    name: "Scope Creep & Unfinished Work",
    input: "bhai roz nayi requirement aa rahi hai, purani complete nahi hui, upar se baar baar call karke status puchta hai, client ko already bol diya aaj ho jayega aur ab mujhe samajh nahi aa raha priority kya hai",
    tone: "professional",
    recipient: "manager",
    platform: "email",
    mustPreserve: ["new requirements", "previous work", "frequent status", "client", "priority"],
    mustNotContain: ["bhai", "samajh nahi aa raha"],
  },
  {
    id: 3,
    name: "Technical API 500 Error Preservation",
    input: "API ka response 500 de raha hai aur frontend mein fallback handle nahi hai kal tak client ko demo dena hai",
    tone: "firm",
    recipient: "coworker",
    platform: "slack",
    mustPreserve: ["api", "500", "fallback", "frontend"],
    mustNotContain: ["invented meeting"],
  },
  {
    id: 4,
    name: "Exact Dates, Numbers & Currency Preservation",
    input: "client ko 25 august tak demo chahiye budget ₹50,000 hai aur hamare paas sirf 2 hours hai",
    tone: "professional",
    recipient: "manager",
    platform: "teams",
    mustPreserve: ["25 august", "50,000", "2 hours"],
    mustNotContain: ["by end of day", "next week"],
  },
  {
    id: 5,
    name: "Contradictory Timeline Resolution",
    input: "kal tak karna hai but actually client ne next week bola hai so i am confused",
    tone: "diplomatic",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["timeline", "clarification"],
    mustNotContain: ["invented certainty"],
  },
  {
    id: 6,
    name: "Salary Review Discussion with HR",
    input: "bhai 2 saal se same salary pe kaam kar raha hu performance rating 5 thi last cycle me raise kab milega",
    tone: "polite",
    recipient: "hr",
    platform: "email",
    mustPreserve: ["salary", "performance rating"],
    mustNotContain: ["bhai"],
  },
  {
    id: 7,
    name: "Emergency Leave Request",
    input: "mujhe kal emergency leave chahiye family issue hai main shaam tak pending tasks handover kar dunga",
    tone: "professional",
    recipient: "manager",
    platform: "whatsapp",
    mustPreserve: ["emergency leave", "handover"],
    mustNotContain: ["bhai"],
  },
  {
    id: 8,
    name: "Unvetted Commitment Pushback",
    input: "manager ne bina puche client ko bol diya Friday ko feature deploy ho jayega jabki DB migration baki hai",
    tone: "firm",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["db migration", "friday"],
    mustNotContain: ["chutiya"],
  },
  {
    id: 9,
    name: "Coworker Repeated Bug Mistake",
    input: "ye banda 4th time same production bug commit kar raha hai PR approve kaise ho gayi",
    tone: "firm",
    recipient: "coworker",
    platform: "slack",
    mustPreserve: ["bug", "pr"],
    mustNotContain: ["banda"],
  },
  {
    id: 10,
    name: "ERP Daily Sales Report Interruption",
    input: "main ERP data fix kar raha hu aur har ghante manager sales report ke liye disturb kar raha hai",
    tone: "professional",
    recipient: "manager",
    platform: "teams",
    mustPreserve: ["erp", "sales report"],
    mustNotContain: ["bc"],
  },
  {
    id: 11,
    name: "Unrealistic Timeline Client Pushback",
    input: "client is demanding 1 day turnaround on a 2 week feature that is impossible",
    tone: "diplomatic",
    recipient: "client",
    platform: "email",
    mustPreserve: ["timeline", "scope"],
    mustNotContain: ["impossible"],
  },
  {
    id: 12,
    name: "Weekend Overtime Boundary Request",
    input: "bhai har weekend pe extra kaam kyun de dete ho regular hours me complete ho sakta tha",
    tone: "firm",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["weekend", "hours"],
    mustNotContain: ["bhai"],
  },
  {
    id: 13,
    name: "Third-Party API Downtime Delay",
    input: "AWS server outage aur payment gateway API failure ke vajah se release delay ho rahi hai",
    tone: "professional",
    recipient: "client",
    platform: "email",
    mustPreserve: ["api", "delay"],
    mustNotContain: ["our fault"],
  },
  {
    id: 14,
    name: "Passive-Aggressive Re-Explanation",
    input: "kitni baar same spec document samjhaun chat history check kar lo ek baar",
    tone: "passive-aggressive",
    recipient: "coworker",
    platform: "slack",
    mustPreserve: ["spec", "discussion"],
    mustNotContain: ["samjhaun"],
  },
  {
    id: 15,
    name: "Unclear Spec Requirement Clarification",
    input: "pehle properly spec doc likh ke do fir main code likhna start karunga aise hawa me nahi hoga",
    tone: "professional",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["spec", "requirements"],
    mustNotContain: ["hawa me"],
  },
  {
    id: 16,
    name: "Urgent Production Downtime Escalation",
    input: "production database down hai customer login nahi kar pa rahe urgent support chahiye",
    tone: "firm",
    recipient: "team",
    platform: "slack",
    mustPreserve: ["database", "production"],
    mustNotContain: ["panic"],
  },
  {
    id: 17,
    name: "PR Review Rejection",
    input: "PR me test cases missing hai aur security guidelines follow nahi kiye hain approve nahi kar sakta",
    tone: "professional",
    recipient: "coworker",
    platform: "slack",
    mustPreserve: ["pr", "test cases"],
    mustNotContain: ["reject"],
  },
  {
    id: 18,
    name: "Subpar UI Design Mockups",
    input: "design team ne mobile responsiveness ignore karke mockups bhej diye hain redesign chahiye",
    tone: "polite",
    recipient: "coworker",
    platform: "teams",
    mustPreserve: ["design", "mobile"],
    mustNotContain: ["bakwas"],
  },
  {
    id: 19,
    name: "Cloud Server Budget Warning",
    input: "cloud infrastructure bill 30% exceed kar gaya hai staging instances cleanup karna hoga",
    tone: "professional",
    recipient: "manager",
    platform: "email",
    mustPreserve: ["30%", "cloud"],
    mustNotContain: ["exceed"],
  },
  {
    id: 20,
    name: "Vendor API Blocked Dependency",
    input: "vendor ne API key release nahi ki isliye authentication integration blocked hai",
    tone: "professional",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["vendor", "api key"],
    mustNotContain: ["blocked"],
  },
  {
    id: 21,
    name: "Technical Approach Disagreement",
    input: "microservices approach overengineered lag rahi hai monolithic architecture is better for this scale",
    tone: "diplomatic",
    recipient: "lead",
    platform: "email",
    mustPreserve: ["architecture", "scale"],
    mustNotContain: ["dumb"],
  },
  {
    id: 22,
    name: "Workload Delegation Request",
    input: "main 3 projects pe akele kaam kar raha hu burnout ho raha hai tasks redistribute karo",
    tone: "firm",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["workload", "projects"],
    mustNotContain: ["burnout"],
  },
  {
    id: 23,
    name: "Short Urgent Hinglish Prompt",
    input: "abe chal jaldi bhej file client wait kar raha",
    tone: "professional",
    recipient: "coworker",
    platform: "whatsapp",
    mustPreserve: ["client", "file"],
    mustNotContain: ["abe"],
  },
  {
    id: 24,
    name: "Long 6-Complaint Rant",
    input: "1. requirements change ho rahi hai 2. daily calls me 2 hrs jate hai 3. bug fixes prioritize nahi hote 4. QA environment broken hai 5. overtime compulsory kiya hai 6. client timeline unrealistic hai",
    tone: "professional",
    recipient: "manager",
    platform: "email",
    mustPreserve: ["requirements", "calls", "qa environment", "timeline"],
    mustNotContain: ["chutiya"],
  },
  {
    id: 25,
    name: "Client Meeting Reschedule",
    input: "critical bug fix baki hai isliye aaj ka client demo reschedule karke kal 3pm karna padega",
    tone: "reassuring" as Tone,
    recipient: "client",
    platform: "email",
    mustPreserve: ["bug", "reschedule"],
    mustNotContain: ["broken"],
  },
  {
    id: 26,
    name: "Security Vulnerability Patch",
    input: "high severity CVE security patch release aayi hai immediate deployment required in production",
    tone: "firm",
    recipient: "team",
    platform: "slack",
    mustPreserve: ["cve", "security"],
    mustNotContain: ["panic"],
  },
  {
    id: 27,
    name: "Hardware Delivery Supplier Delay",
    input: "supplier ne server hardware shipment next week tak delay kar diya hai data center setup postponed",
    tone: "professional",
    recipient: "manager",
    platform: "email",
    mustPreserve: ["hardware", "delay"],
    mustNotContain: ["useless"],
  },
  {
    id: 28,
    name: "Contractor Subpar Code Review",
    input: "external contractor ne clean code standards follow nahi kiye hain refactoring required before merging",
    tone: "professional",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["contractor", "refactoring"],
    mustNotContain: ["garbage"],
  },
  {
    id: 29,
    name: "Conflicting Dual Manager Priorities",
    input: "manager A bolta hai feature 1 karo manager B bolta hai feature 2 karo main kiska kaam karu pehle",
    tone: "diplomatic",
    recipient: "manager",
    platform: "slack",
    mustPreserve: ["priorities", "alignment"],
    mustNotContain: ["confused"],
  },
  {
    id: 30,
    name: "Sprint Retrospective Process Bottleneck",
    input: "sprint me testing phase late start hone se release block hoti hai QA integration earlier hona chahiye",
    tone: "friendly",
    recipient: "team",
    platform: "slack",
    mustPreserve: ["sprint", "qa"],
    mustNotContain: ["blame"],
  },
];

describe("30-Benchmark AI Intelligence Regression Test Suite", () => {
  const service = new MockAIService();

  BENCHMARK_SUITE.forEach((tc) => {
    test(`Benchmark #${tc.id}: ${tc.name}`, async () => {
      const extracted = analyzeRawInput(tc.input);
      assert.ok(extracted.confidence > 0.5, "Extraction confidence must be > 0.5");

      const result = await service.translate({
        text: tc.input,
        tone: tc.tone,
        recipient: tc.recipient,
        platform: tc.platform,
      });

      assert.ok(result.message && result.message.trim().length > 10, "Generated message must be valid");

      const validation = validateMessage(tc.input, result.message, extracted);
      assert.ok(validation.score >= 50, `Validation score must be >= 50 (got ${validation.score})`);

      for (const banned of tc.mustNotContain) {
        assert.strictEqual(
          result.message.toLowerCase().includes(banned.toLowerCase()),
          false,
          `Output must NOT contain banned phrase: "${banned}"`
        );
      }
    });
  });
});
