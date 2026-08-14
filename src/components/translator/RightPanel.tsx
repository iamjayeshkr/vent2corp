"use client";

import { Sparkles, Shield, User, MessageSquare, CornerDownLeft, History, Star } from "lucide-react";
import type { Tone, Recipient, Platform, HistoryItem } from "@/types";

interface RightPanelProps {
  tone: Tone;
  setTone: (t: Tone) => void;
  recipient: Recipient;
  setRecipient: (r: Recipient) => void;
  platform: Platform;
  setPlatform: (p: Platform) => void;
  onTranslate: () => void;
  loading: boolean;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onViewAllHistory?: () => void;
}

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "polite", label: "Polite" },
  { value: "friendly", label: "Friendly" },
  { value: "firm", label: "Firm" },
  { value: "diplomatic", label: "Diplomatic" },
  { value: "passive-aggressive", label: "Passive Aggressive" },
];

const RECIPIENT_OPTIONS: { value: Recipient; label: string }[] = [
  { value: "manager", label: "Manager" },
  { value: "client", label: "Client" },
  { value: "coworker", label: "Coworker" },
  { value: "junior", label: "Junior" },
  { value: "hr", label: "HR Team" },
  { value: "team", label: "Whole Team" },
];

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "slack", label: "Slack" },
  { value: "email", label: "Email" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "linkedin", label: "LinkedIn" },
];

function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RightPanel({
  tone,
  setTone,
  recipient,
  setRecipient,
  platform,
  setPlatform,
  onTranslate,
  loading,
  history,
  onSelectHistoryItem,
  onViewAllHistory,
}: RightPanelProps) {
  return (
    <div className="w-full lg:w-80 space-y-6 select-none">
      {/* Settings & Translation Controls Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-5">
        {/* Handwritten Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground font-handwritten tracking-wide">
            Make it perfect for <span className="text-emerald-500 underline decoration-wavy decoration-emerald-400">~</span>
          </h3>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-500" /> Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-muted/20 text-foreground font-sans text-xs font-medium focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-500" /> Recipient
          </label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as Recipient)}
            className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-muted/20 text-foreground font-sans text-xs font-medium focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            {RECIPIENT_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-muted/20 text-foreground font-sans text-xs font-medium focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Translate Primary Button */}
        <button
          type="button"
          onClick={onTranslate}
          disabled={loading}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Translating...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Translate</span>
              <span className="ml-auto px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-mono flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> Enter
              </span>
            </>
          )}
        </button>

        <p className="text-[11px] text-muted-foreground text-center font-sans">
          💡 <strong>Pro tip:</strong> Shift + Enter for new line
        </p>
      </div>

      {/* Recent History Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-purple-500" />
            Recent history
          </h4>
          {onViewAllHistory && (
            <button
              type="button"
              onClick={onViewAllHistory}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2 text-center">
            No recent translations yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {history.slice(0, 4).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                  idx === 0
                    ? "bg-emerald-500/10 border-emerald-500/30 text-foreground"
                    : "bg-muted/20 border-border/60 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium line-clamp-1 text-foreground">
                    {item.original}
                  </p>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="capitalize font-medium">
                    {item.tone} · {item.recipient} · {item.platform}
                  </span>
                  <span>{getRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
