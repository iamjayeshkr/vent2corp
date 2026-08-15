"use client";

import React, { useState, useCallback } from "react";
import {
  Sparkles,
  Zap,
  Flame,
  RotateCcw,
  Scissors,
  Briefcase,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from "lucide-react";
import type { Tone, Recipient, Platform, Length, TranslationResult } from "@/types";
import { TONES, RECIPIENTS, PLATFORMS, LENGTHS } from "@/types";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { RawToCorporateCard } from "./RawToCorporateCard";
import { DoodleUnderline } from "@/components/ui/Doodles";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface MobileTranslateScreenProps {
  onRequireAuth?: () => void;
  onSaveToHistory?: (item: { original: string; translated: string; tone: Tone; recipient: Recipient; platform: Platform }) => void;
}

const SAMPLE_PROMPTS = [
  "bc ye manager roz nayi requirement de raha hai aur purani wali bhi complete nahi hui 😡",
  "jaldi kar bhai client meeting hai emergency mein code phat gaya",
  "mujhe 3 din ki leave chahiye zaroori kaam hai mera bhai",
  "kitni baar same cheez samjhau inko samajh hi nahi aata",
];

const LOADING_MESSAGES = [
  "understanding the situation...",
  "keeping the meaning...",
  "fixing the delivery...",
];

export function MobileTranslateScreen({
  onRequireAuth,
  onSaveToHistory,
}: MobileTranslateScreenProps) {
  const [input, setInput] = useState(
    "bc ye manager roz nayi requirement de raha hai aur purani wali bhi complete nahi hui 😡"
  );
  const [tone, setTone] = useState<Tone>("professional");
  const [recipient, setRecipient] = useState<Recipient>("manager");
  const [platform, setPlatform] = useState<Platform>("slack");
  const [length, setLength] = useState<Length>("normal");

  const [sheetType, setSheetType] = useState<"tone" | "recipient" | "platform" | "length" | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [result, setResult] = useState<TranslationResult | null>({
    message:
      "I've noticed that new requirements are being added while some of the earlier tasks are still pending. Could we align on the current priorities and finalize the scope before moving forward?",
    tone: "professional",
    intent: "Scope & Priority Alignment",
    emotion: "Frustrated",
  });

  const handleTranslate = useCallback(async (actionOverride?: "shorter" | "more-professional" | "more-direct" | "regenerate") => {
    if (!input.trim()) return;
    void triggerHaptic("heavy");
    setLoading(true);
    setError("");

    // Cycle subtle loading text
    setLoadingTextIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);

    try {
      const jwtToken = localStorage.getItem("vent2corp_token");
      const accessKey = localStorage.getItem("vent2corp-access-key") || "corporate2026";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-access-key": accessKey,
      };
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      const res = await fetch("/api/translate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          text: input,
          tone,
          recipient,
          platform,
          action: actionOverride,
          previousOutput: result?.message,
        }),
      });

      if (res.status === 401) {
        if (onRequireAuth) onRequireAuth();
        throw new Error("Authentication required. Please sign in or create an account.");
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "That one didn't make it through. Try again.");
      }

      const data = (await res.json()) as TranslationResult;
      setResult(data);
      setIsFavorite(false);

      if (onSaveToHistory) {
        onSaveToHistory({
          original: input.trim(),
          translated: data.message,
          tone,
          recipient,
          platform,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Give it another shot.");
    } finally {
      setLoading(false);
    }
  }, [input, tone, recipient, platform, result?.message, onRequireAuth, onSaveToHistory]);

  const handleNativeShare = async () => {
    if (!result?.message) return;
    void triggerHaptic("medium");
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "vent2corp translation",
          text: result.message,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(result.message);
    }
  };

  return (
    <div className="space-y-6 pb-6 select-none font-sans">
      {/* Step 1: What's on your mind? */}
      <div className="p-5 rounded-3xl bg-[#FFF0F3] dark:bg-[#25151B] border-2 border-pink-300/80 dark:border-pink-900/60 shadow-md space-y-3 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-pink-900 dark:text-pink-200 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-pink-600" /> 1. What's on your mind?
          </h2>
          <span className="text-xs font-mono font-bold text-pink-700 dark:text-pink-400">
            {input.length}/2000
          </span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="bhai ye manager roz nayi requirement de raha hai..."
          className="w-full min-h-[140px] bg-transparent text-sm leading-relaxed text-pink-950 dark:text-pink-50 placeholder:text-pink-400/80 focus:outline-none resize-none font-sans font-medium"
          maxLength={2000}
        />

        {/* Horizontal Prompt Chips */}
        <div className="space-y-1 pt-2 border-t border-pink-200/60 dark:border-pink-900/40">
          <span className="text-[10px] font-mono text-pink-700 dark:text-pink-400 uppercase block font-bold">
            Tap a sample rant:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {SAMPLE_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  void triggerHaptic("light");
                  setInput(promptText);
                }}
                className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-black/40 border border-pink-200 dark:border-pink-900 text-[11px] text-pink-900 dark:text-pink-200 shrink-0 hover:bg-white active:scale-95 transition-all"
              >
                {promptText.slice(0, 26)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Customize */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-950 dark:border-gray-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-gray-950 dark:text-white">
            2. Customize
          </h2>
          <span className="font-handwritten text-xs font-bold text-purple-600 dark:text-purple-400">
            you're in control.
          </span>
        </div>

        <div className="space-y-2">
          {/* Tone Selector Row */}
          <button
            type="button"
            onClick={() => setSheetType("tone")}
            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between active:scale-98 transition-all"
          >
            <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400">Tone</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 capitalize">
                {TONES.find((t) => t.value === tone)?.label || tone}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Recipient Selector Row */}
          <button
            type="button"
            onClick={() => setSheetType("recipient")}
            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between active:scale-98 transition-all"
          >
            <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400">Recipient</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                {RECIPIENTS.find((r) => r.value === recipient)?.label || recipient}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Platform Selector Row */}
          <button
            type="button"
            onClick={() => setSheetType("platform")}
            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between active:scale-98 transition-all"
          >
            <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400">Platform</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 capitalize">
                {PLATFORMS.find((p) => p.value === platform)?.label || platform}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {/* Length Selector Row */}
          <button
            type="button"
            onClick={() => setSheetType("length")}
            className="w-full p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between active:scale-98 transition-all"
          >
            <span className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400">Length</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 capitalize">
                {LENGTHS.find((l) => l.value === length)?.label || length}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Step 3: Make it Corporate CTA */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleTranslate()}
          disabled={loading || !input.trim()}
          className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 border-2 border-gray-950 shadow-[4px_4px_0_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>{LOADING_MESSAGES[loadingTextIndex]}</span>
            </div>
          ) : (
            <>
              <span>MAKE IT CORPORATE</span>
              <ArrowRight className="w-5 h-5 text-yellow-300" />
            </>
          )}
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500/80 text-amber-900 dark:text-amber-200 text-center font-sans space-y-2 shadow-xs">
          <p className="text-xs font-mono font-bold">{error}</p>
        </div>
      )}

      {/* Result Card Output */}
      {result && (
        <div className="pt-2">
          <RawToCorporateCard
            rawText={input}
            corporateText={result.message}
            tone={tone}
            recipient={recipient}
            platform={platform}
            onShare={handleNativeShare}
            onFavorite={() => {
              void triggerHaptic("medium");
              setIsFavorite(!isFavorite);
            }}
            isFavorite={isFavorite}
            explanation={{
              emotion: result.emotion || "Frustrated",
              situation: result.intent || "Workplace communication realignment",
              goal: "Convey message respectfully while protecting boundaries",
            }}
          />

          {/* Quick Refinement Action Pills */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleTranslate("shorter")}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Scissors className="w-3.5 h-3.5 text-purple-600" /> Shorter
            </button>

            <button
              type="button"
              onClick={() => handleTranslate("more-professional")}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Formal
            </button>

            <button
              type="button"
              onClick={() => handleTranslate("more-direct")}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Direct
            </button>
          </div>
        </div>
      )}

      {/* Slide-Up Bottom Sheets */}
      <MobileBottomSheet
        open={sheetType === "tone"}
        onClose={() => setSheetType(null)}
        title="Select Tone"
        options={TONES}
        selectedValue={tone}
        onSelect={(v) => setTone(v)}
      />

      <MobileBottomSheet
        open={sheetType === "recipient"}
        onClose={() => setSheetType(null)}
        title="Select Recipient"
        options={RECIPIENTS}
        selectedValue={recipient}
        onSelect={(v) => setRecipient(v)}
      />

      <MobileBottomSheet
        open={sheetType === "platform"}
        onClose={() => setSheetType(null)}
        title="Select Platform"
        options={PLATFORMS}
        selectedValue={platform}
        onSelect={(v) => setPlatform(v)}
      />

      <MobileBottomSheet
        open={sheetType === "length"}
        onClose={() => setSheetType(null)}
        title="Select Output Length"
        options={LENGTHS}
        selectedValue={length}
        onSelect={(v) => setLength(v)}
      />
    </div>
  );
}
