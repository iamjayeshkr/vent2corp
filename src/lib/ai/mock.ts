import type {
  AIProvider,
  TranslationRequest,
  TranslationResult,
  Tone,
} from "@/types";
import { cleanAndFormatMessage } from "./formatter";

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
      "manager chutiya",
      "manager chutiya hai",
      "manager chutiya hai kya",
      "manager chutiya hai kya?",
      "manager stupid",
      "manager is stupid",
      "boss chutiya",
      "boss stupid",
    ],
    intent: "Requirement clarification",
    emotion: "Frustrated",
    responses: {
      professional:
        "I believe the current requirements may need some further clarification, as they appear to be changing frequently and may not be fully aligned with the original scope. Could we please review and finalize the requirements before proceeding further?",
      polite:
        "I hope you're doing well. I wanted to gently bring up that the requirements seem to be changing quite often, which is making it a bit difficult to maintain consistency. Would it be possible to review and finalize them together?",
      friendly:
        "Hey! The requirements have been changing quite a bit lately, and it's getting a little tricky to keep up. Mind if we sit down and lock them in so we're all on the same page?",
      firm: "The requirements have changed multiple times, and this is impacting our progress. We need to finalize the requirements immediately before any further work is done.",
      diplomatic:
        "I wanted to check in regarding the requirements. I've noticed some changes recently and wanted to ensure we're aligned. Would it be helpful to review them together to establish a stable direction?",
      "passive-aggressive":
        "It appears that some of the previously discussed requirements may not have been reflected in the current implementation. It may be helpful to review the earlier discussion once again.",
    },
  },
  {
    patterns: [
      "samajh nhi aata",
      "samajh nahi aata",
      "samajh nahi aa raha",
      "samajh nahi aa rahi",
      "samajh nahi aa raha hai",
      "samajh nahi aa rahi hai",
      "samajh nhi aa raha",
      "samajh nhi aa rahi",
      "don't understand",
      "not understanding",
      "samajh nahi aaya",
      "samajh nhi aaya",
    ],
    intent: "Clarification request",
    emotion: "Confused",
    responses: {
      professional:
        "I\u2019m having some difficulty understanding the current requirement. Could we clarify the expected outcome and key requirements before I proceed?",
      polite:
        "I hope you don't mind me asking, but I'm having a bit of trouble understanding this requirement. Would you be able to help clarify the expected outcome when you have a moment?",
      friendly:
        "Hey, I'm a little stuck on this one\u2014not fully getting the requirement. Could you walk me through what you're expecting? Would really help!",
      firm: "I need clarification on this requirement before I can proceed. Please provide the expected outcome and key details at the earliest.",
      diplomatic:
        "I wanted to reach out as I'm navigating some ambiguity around this requirement. Would it be possible to walk through the expected outcome together to ensure we're aligned?",
      "passive-aggressive":
        "I wanted to follow up on the requirement, as I may have missed some details in the earlier communication. A quick clarification would be appreciated.",
    },
  },
  {
    patterns: [
      "kitni baar samjhau",
      "kitni baar samjhaun",
      "kitni baar same cheez samjhau",
      "kitni baar same cheez samjhaun",
      "how many times explain",
      "how many times do i have to explain",
      "kitni baar batana padega",
      "kitni baar bataun",
    ],
    intent: "Process reinforcement",
    emotion: "Frustrated",
    responses: {
      professional:
        "I believe we have discussed this point previously. Could you please review the earlier discussion once before we revisit it?",
      polite:
        "I hope you don't mind, but I believe we covered this in a previous discussion. Would you be able to review the earlier notes, and then we can reconnect if anything is still unclear?",
      friendly:
        "Hey, I think we went over this one before! Could you take a quick look at our earlier chat? Happy to hop on a call if anything's still fuzzy.",
      firm: "This has been discussed before. Please review the previous discussion before we proceed further. I expect us to be aligned on this going forward.",
      diplomatic:
        "I wanted to gently remind you that we explored this topic in an earlier conversation. Perhaps revisiting those notes might help us move forward more efficiently.",
      "passive-aggressive":
        "I believe we have discussed this point previously. Just wanted to make sure the earlier conversation wasn't missed.",
    },
  },
  {
    patterns: [
      "jaldi kar",
      "jaldi karo",
      "client sar pe khada hai",
      "client sar pe khada",
      "client is waiting",
      "client waiting",
      "hurry up",
      "do it fast",
      "jaldi bhejo",
      "jaldi bhej",
    ],
    intent: "Urgency escalation",
    emotion: "Urgent",
    responses: {
      professional:
        "Could we please prioritize this? The client is currently awaiting an update, so it would be helpful to have this completed at the earliest.",
      polite:
        "I hope you're not too swamped. The client is currently waiting for an update on this, so I wanted to kindly ask if we could prioritize it when possible.",
      friendly:
        "Hey! The client is waiting on this one\u2014mind bumping it up the list? Would really save the day!",
      firm: "This needs to be prioritized immediately. The client is waiting, and delays here will reflect poorly on us. Please provide an update at the earliest.",
      diplomatic:
        "I wanted to flag that the client is awaiting an update on this. It would be wonderful if we could prioritize it to maintain a positive impression.",
      "passive-aggressive":
        "Just a gentle reminder that the client is still awaiting an update on this. I'm sure it just slipped through the cracks.",
    },
  },
  {
    patterns: [
      "bakwas bana ke bheja",
      "bakwas banake bheja",
      "bakwas banake bheja hai",
      "kya bakwas bheja hai",
      "kya bakwas banaya hai",
      "what nonsense",
      "this is nonsense",
      "rubbish work",
      "poor work",
    ],
    intent: "Quality feedback",
    emotion: "Disappointed",
    responses: {
      professional:
        "I think the current version may need some refinement to better align with the expected outcome. Could we review the key requirements once again?",
      polite:
        "I appreciate the effort here, but I think the current version might need a bit of refinement to match what we were expecting. Would it be possible to review the requirements together?",
      friendly:
        "Hey, I think this needs another pass to match what we discussed. No worries\u2014happens to all of us! Want to quickly go over the requirements again?",
      firm: "The current deliverable does not meet expectations. We need to revisit the requirements and deliver a version that aligns with what was discussed.",
      diplomatic:
        "I wanted to share some feedback on the current version. I think a few refinements could help it align more closely with our shared vision. Would you be open to reviewing the requirements together?",
      "passive-aggressive":
        "I was reviewing the latest version, and I believe there might have been a misalignment with the original requirements. Perhaps revisiting the brief would help.",
    },
  },
  {
    patterns: [
      "requirement baar baar change",
      "requirement bar bar change",
      "requirement change ho rahi",
      "requirement change ho rahi hai",
      "requirement baar baar change kyu",
      "requirements keep changing",
      "requirements changing frequently",
      "why are requirements changing",
    ],
    intent: "Scope stabilization",
    emotion: "Frustrated",
    responses: {
      professional:
        "Could we please finalize the requirements before proceeding further? Frequent changes are making it difficult to maintain a consistent implementation.",
      polite:
        "I completely understand that priorities can shift, but the frequent changes to requirements are making it a bit challenging to stay consistent. Would it be possible to finalize them before we move ahead?",
      friendly:
        "Hey, the requirements have been changing a lot lately and it's getting hard to keep up. Can we lock them in so we don't keep going back and forth?",
      firm: "The requirements cannot keep changing. We need to finalize them now before any further development. This back-and-forth is impacting timelines significantly.",
      diplomatic:
        "I wanted to flag that the shifting requirements are creating some challenges on our end. I think stabilizing the scope would help us deliver more effectively.",
      "passive-aggressive":
        "I noticed the requirements have changed again. Just want to make sure I didn't miss the final version\u2014could you point me to the latest approved set?",
    },
  },
  {
    patterns: [
      "tere samajh nhi aata",
      "tere samajh nahi aata",
      "tujhe samajh nahi aata",
      "tujhe samajh nhi aata",
      "tujhe samajh nahi aa raha",
      "tujhe samajh nhi aa raha",
      "you don't understand",
      "u don't understand",
    ],
    intent: "Misalignment resolution",
    emotion: "Frustrated",
    responses: {
      professional:
        "I believe there may still be some misunderstanding regarding this. Could we please go over it once again?",
      polite:
        "I hope I'm not being unclear. It seems like there might still be some confusion on this topic. Would you mind if we walked through it one more time together?",
      friendly:
        "Hey, I think we're not quite on the same page here. Let's go over it once more\u2014I'm sure we'll get it sorted!",
      firm: "There seems to be a misunderstanding that needs to be resolved. Let's go over this again to ensure we're aligned before proceeding.",
      diplomatic:
        "I wanted to check in, as it seems we may not be fully aligned on this yet. Would it be helpful to revisit the details together?",
      "passive-aggressive":
        "I believe there may still be some misunderstanding regarding this. Just wanted to make sure my earlier explanation was clear enough.",
    },
  },
  {
    patterns: [
      "kaam galat bana diya",
      "kaam galat banaya",
      "kaam galat banaya hai",
      "galat kaam banaya",
      "galat kaam bheja",
      "work is wrong",
      "wrong work",
      "incorrect implementation",
    ],
    intent: "Correction request",
    emotion: "Concerned",
    responses: {
      professional:
        "I believe there are a few issues with the current implementation. Could we review them once?",
      polite:
        "I hope you don't mind me pointing this out, but I noticed a few issues with the current implementation. Would it be okay to review them together when you have time?",
      friendly:
        "Hey, I spotted a few issues in the current implementation. Nothing major, but let's quickly review so we can fix them together!",
      firm: "There are several issues with the current implementation that need to be addressed before we proceed further.",
      diplomatic:
        "I noticed a few areas that may benefit from refinement. Could we review them together?",
      "passive-aggressive":
        "I was reviewing the implementation and noticed a few areas that don't seem to match the requirements we discussed. Perhaps worth another look?",
    },
  },
  {
    patterns: [
      "deadline nahi milega",
      "deadline nahi milegi",
      "deadline miss ho jayega",
      "deadline miss ho jayegi",
      "nahi hoga time pe",
      "time pe nahi hoga",
      "time nahi hai",
      "no time",
      "not enough time",
      "won't meet deadline",
      "can't meet deadline",
    ],
    intent: "Timeline escalation",
    emotion: "Concerned",
    responses: {
      professional:
        "I wanted to flag a potential risk to the current timeline. Given the scope and remaining work, we may need to revisit the deadline or adjust priorities to ensure a quality delivery.",
      polite:
        "I hope you're doing well. I wanted to give you a heads-up that we might face some challenges meeting the current deadline. Would it be possible to discuss adjustments?",
      friendly:
        "Hey, just a heads up\u2014I'm not sure we'll hit the current deadline with everything as planned. Can we chat about adjusting timelines or priorities?",
      firm: "The current timeline is not feasible with the remaining scope. We need to either extend the deadline or cut scope to ensure quality delivery.",
      diplomatic:
        "I wanted to surface a potential timeline concern. It may be worth revisiting our priorities to ensure we can deliver something we're all proud of.",
      "passive-aggressive":
        "I was reviewing the timeline and realized the deadline might be at risk. I'm sure this was just an oversight in planning.",
    },
  },
  {
    patterns: [
      "leave chahiye",
      "leave chahiye mujhe",
      "mujhe leave chahiye",
      "mujhe chhutti chahiye",
      "chhutti chahiye",
      "i need leave",
      "i want leave",
      "need a day off",
      "want a day off",
    ],
    intent: "Leave request",
    emotion: "Neutral",
    responses: {
      professional:
        "I would like to request leave for [date]. I will ensure all pending tasks are completed or handed over before my absence. Please let me know if any additional information is needed.",
      polite:
        "I hope you're doing well. I wanted to request leave for [date] if possible. I'll make sure everything is wrapped up before then. Please let me know if this works.",
      friendly:
        "Hey! I'm planning to take [date] off. I'll get everything sorted before then\u2014just wanted to give you a heads up! Let me know if that's cool.",
      firm: "I am requesting leave for [date]. I will complete all pending tasks prior to my absence. Please confirm at the earliest.",
      diplomatic:
        "I wanted to request leave for [date]. I'll ensure a smooth handover of my responsibilities. Please let me know if this is feasible.",
      "passive-aggressive":
        "I wanted to formally request leave for [date]. I'm assuming the process is still the same as discussed previously.",
    },
  },
];

export class MockAIService implements AIProvider {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const lowerText = request.text.toLowerCase();

    for (const match of PATTERN_MATCHES) {
      if (match.patterns.some((p) => lowerText.includes(p))) {
        let message = match.responses[request.tone];
        if (!message) {
          message = match.responses["professional"];
        }

        message = cleanAndFormatMessage(message, request.platform, request.recipient, match.intent);

        return {
          message,
          tone: request.tone,
          intent: match.intent,
          emotion: match.emotion,
        };
      }
    }

    const generic = this.buildGenericResponse(request);
    return {
      message: cleanAndFormatMessage(generic, request.platform, request.recipient, "General communication"),
      tone: request.tone,
      intent: "General communication",
      emotion: this.detectEmotion(lowerText),
    };
  }

  private buildGenericResponse(request: TranslationRequest): string {
    const { text, tone } = request;
    const lowerText = text.toLowerCase();

    let topic = "our current progress and priorities";

    if (/\b(requriement|requirement|requirements|scope|change)\b/i.test(lowerText)) {
      topic = "the current requirements and project scope";
    } else if (/\b(deadline|time|jaldi|asap|urgent|fast|delay)\b/i.test(lowerText)) {
      topic = "the timeline and task priorities";
    } else if (/\b(client|customer)\b/i.test(lowerText)) {
      topic = "the latest updates requested by the client";
    } else if (/\b(manager|boss|lead|supervisor)\b/i.test(lowerText)) {
      topic = "the guidance and expectations for this deliverable";
    } else if (/\b(bug|error|issue|problem|kharab|galat)\b/i.test(lowerText)) {
      topic = "a few points requiring technical review";
    }

    const toneTemplates: Record<Tone, string> = {
      professional: `I wanted to discuss ${topic}. Could we please align on the next steps?`,
      polite: `I hope you're doing well. I wanted to kindly bring up ${topic} when you have a moment. Would it be possible to review this together?`,
      friendly: `Hey! Just wanted to touch base regarding ${topic}. Let me know when you get a chance to chat!`,
      firm: `We need to address ${topic} immediately. Please let me know how we should proceed.`,
      diplomatic: `I wanted to reach out regarding ${topic}. Perhaps we could explore this together at your earliest convenience.`,
      "passive-aggressive": `I noticed ${topic} hasn't been fully finalized yet. Just following up in case it was overlooked.`,
    };

    let baseResponse = toneTemplates[tone] ?? toneTemplates["professional"];

    if (request.action) {
      switch (request.action) {
        case "shorter":
          baseResponse = baseResponse.split(". ")[0] + ".";
          break;
        case "more-professional":
          baseResponse = `I would like to formally request that we review ${topic} to maintain operational alignment.`;
          break;
        case "more-direct":
          baseResponse = `Please review ${topic} immediately so we can move forward.`;
          break;
      }
    }

    return baseResponse;
  }

  private detectEmotion(text: string): string {
    if (/\b(bc\b|mc\b|bsdk\b|chutiya\b|madarchod\b|behenchod\b)/.test(text))
      return "Angry";
    if (/\b(angry\b|pissed\b|furious\b)/.test(text)) return "Angry";
    if (/\b(sad\b|upset\b|disappointed\b)/.test(text)) return "Disappointed";
    if (/\b(confused\b|samajh nahi\b|don't understand)/.test(text))
      return "Confused";
    if (/\b(worried\b|concerned\b|anxious\b)/.test(text)) return "Concerned";
    if (/\b(urgent\b|jaldi\b|asap\b|immediately\b)/.test(text)) return "Urgent";
    if (/\b(happy\b|excited\b|great\b)/.test(text)) return "Positive";
    return "Neutral";
  }
}
