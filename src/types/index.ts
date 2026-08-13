export type Tone =
  | "professional"
  | "polite"
  | "friendly"
  | "firm"
  | "diplomatic"
  | "passive-aggressive";

export type Recipient =
  | "manager"
  | "client"
  | "coworker"
  | "junior"
  | "hr"
  | "team";

export type Platform =
  | "whatsapp"
  | "slack"
  | "teams"
  | "email"
  | "linkedin";

export type Theme = "light" | "dark" | "system";

export type QuickAction =
  | "shorter"
  | "more-professional"
  | "more-direct"
  | "regenerate";

export interface TranslationResult {
  message: string;
  tone: Tone;
  intent: string;
  emotion: string;
}

export interface TranslationRequest {
  text: string;
  tone: Tone;
  recipient: Recipient;
  platform: Platform;
  action?: QuickAction;
  previousOutput?: string;
}

export interface AIProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}

export interface HistoryItem {
  id: string;
  original: string;
  translated: string;
  tone: Tone;
  recipient: Recipient;
  platform: Platform;
  timestamp: number;
}

export interface UserSettings {
  theme: Theme;
  defaultTone: Tone;
  defaultRecipient: Recipient;
  defaultPlatform: Platform;
}

export const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "polite", label: "Polite" },
  { value: "friendly", label: "Friendly" },
  { value: "firm", label: "Firm" },
  { value: "diplomatic", label: "Diplomatic" },
  { value: "passive-aggressive", label: "Passive Aggressive 💀" },
];

export const RECIPIENTS: { value: Recipient; label: string }[] = [
  { value: "manager", label: "Manager" },
  { value: "client", label: "Client" },
  { value: "coworker", label: "Coworker" },
  { value: "junior", label: "Junior" },
  { value: "hr", label: "HR" },
  { value: "team", label: "Team" },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "slack", label: "Slack" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "email", label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
];
