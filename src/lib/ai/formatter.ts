import type { Platform, Recipient } from "@/types";

/**
 * Extracts and cleans corporate message text from raw model output,
 * handling nested JSON strings, AI chatter, and platform formatting.
 */
export function cleanAndFormatMessage(
  rawInput: string,
  platform: Platform,
  recipient: Recipient,
  intent?: string
): string {
  let text = rawInput.trim();

  // 1. Try parsing if raw text is itself a nested JSON string or object string
  try {
    const unescaped = text.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    if (unescaped.startsWith("{") && unescaped.endsWith("}")) {
      const parsed = JSON.parse(unescaped);

      // Handle nested structures like { email: { subject: "...", body: "..." } }
      if (parsed.email && typeof parsed.email === "object") {
        const sub = parsed.email.subject || parsed.email.Subject;
        const body = parsed.email.body || parsed.email.Body;
        if (body) {
          text = sub ? `Subject: ${sub}\n\n${body}` : body;
        }
      } else if (parsed.subject || parsed.body) {
        const sub = parsed.subject || parsed.Subject;
        const body = parsed.body || parsed.Body;
        if (body) {
          text = sub ? `Subject: ${sub}\n\n${body}` : body;
        }
      } else if (parsed.message && typeof parsed.message === "string") {
        text = parsed.message;
      }
    }
  } catch {
    // If not JSON, proceed with raw text
  }

  // 2. Remove AI meta-chatter prefix (e.g. "Here is the formal version:", "The employee's tone...")
  text = text
    .replace(/^(Here is|Here's|Below is|The rephrased|To maintain|The provided text|The employee's|A more formal version)[^:\n]*:\s*/i, "")
    .replace(/^(Hi\s*-\s*)+/i, "")
    .replace(/\s*-\s*\*Action:\*\s*.*$/i, "")
    .trim();

  // 3. Remove any leftover JSON syntax wrapper if model output was corrupted
  if (text.startsWith("{") && text.endsWith("}")) {
    text = text.slice(1, -1).trim();
  }

  // 4. Platform-specific formatting (Natural, clean, sendable text without robotic fluff)
  switch (platform) {
    case "email": {
      // Check if message already has a Subject line
      const hasSubject = /^Subject:/i.test(text) || text.includes("Subject:");

      let subject = "";
      let body = text;

      if (hasSubject) {
        // Separate Subject and Body cleanly
        const subjectMatch = text.match(/Subject:\s*([^\n]+)/i);
        if (subjectMatch) {
          subject = subjectMatch[1].trim();
          body = text.replace(/Subject:\s*[^\n]+\n*/i, "").trim();
        }
      } else {
        // Derive subject from intent or default
        const cleanIntent = intent && intent !== "General communication" ? intent : "Workplace Scope & Expectation Alignment";
        subject = cleanIntent;
      }

      // Check if body already has a salutation (Dear / Hi / Hello)
      const hasSalutation = /^(Dear|Hi|Hello|Good morning|Good afternoon)\b/i.test(body);
      if (!hasSalutation) {
        const salutations: Record<Recipient, string> = {
          manager: "Dear Manager",
          client: "Dear Client",
          coworker: "Hi",
          junior: "Hi",
          hr: "Dear HR Team",
          team: "Hi Team",
          lead: "Hi Lead",
        };
        const salutation = salutations[recipient] || "Hi";
        body = `${salutation},\n\n${body}`;
      }

      // Check if body already has a closing (Best regards / Regards / Thanks / Sincerely)
      const hasClosing = /(Best regards|Regards|Kind regards|Thanks|Sincerely),\s*(\[|\n|$)/i.test(body);
      if (!hasClosing) {
        const closings: Record<Recipient, string> = {
          manager: "Best regards,\n[Your Name]",
          client: "Kind regards,\n[Your Name]",
          coworker: "Thanks,\n[Your Name]",
          junior: "Best,\n[Your Name]",
          hr: "Sincerely,\n[Your Name]",
          team: "Thanks,\n[Your Name]",
          lead: "Thanks,\n[Your Name]",
        };
        const closing = closings[recipient] || "Best regards,\n[Your Name]";
        body = `${body}\n\n${closing}`;
      }

      return `Subject: ${subject}\n\n${body}`;
    }

    case "linkedin": {
      const textWithoutTags = text.replace(/#\w+\s*/g, "").trim();
      return `${textWithoutTags}\n\n#WorkplaceCommunication #Productivity #ProjectManagement`;
    }

    case "teams": {
      return text;
    }

    case "slack": {
      return text;
    }

    case "whatsapp": {
      return text;
    }

    default:
      return text;
  }
}
