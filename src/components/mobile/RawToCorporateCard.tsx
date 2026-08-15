"use client";

import React, { useState } from "react";
import { Copy, Check, Share2, Star, Sparkles, Flame, CheckCircle2 } from "lucide-react";
import type { Tone, Recipient, Platform } from "@/types";
import { DoodleArrow } from "@/components/ui/Doodles";

interface RawToCorporateCardProps {
  rawText: string;
  corporateText: string;
  tone?: Tone;
  recipient?: Recipient;
  platform?: Platform;
  onCopy?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  explanation?: {
    emotion?: string;
    situation?: string;
    goal?: string;
  };
}

export function RawToCorporateCard({
  rawText,
  corporateText,
  tone = "professional",
  onCopy,
  onShare,
  onFavorite,
  isFavorite = false,
  explanation,
}: RawToCorporateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleLocalCopy = async () => {
    if (onCopy) {
      onCopy();
    } else {
      await navigator.clipboard.writeText(corporateText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 font-sans select-none">
      {/* 1. RAW Input Card (Pastel Pink) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF0F3] dark:bg-[#25151B] border-2 border-pink-300/80 dark:border-pink-900/60 shadow-xs relative transform -rotate-0.5 transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-pink-200/60 dark:border-pink-900/40">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-pink-600" /> RAW (you said)
          </span>
          <span className="text-base">😡</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-pink-950 dark:text-pink-100">
          {rawText}
        </p>
      </div>

      {/* 2. Transformation Arrow with Handwritten Doodle */}
      <div className="flex flex-col items-center justify-center my-1 py-1">
        <div className="flex items-center gap-2">
          <span className="font-handwritten text-xs text-purple-600 dark:text-purple-400 font-bold">
            rephrased cleanly
          </span>
          <DoodleArrow className="w-5 h-5 text-purple-600 dark:text-purple-400 rotate-90" />
        </div>
      </div>

      {/* 3. CORPORATE Output Card (Pastel Mint Green) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] dark:bg-[#0E2218] border-2 border-emerald-300/80 dark:border-emerald-900/60 shadow-md relative transition-all">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              vent2corp ({tone})
            </span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>

        <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-emerald-950 dark:text-emerald-50 border-l-2 border-emerald-500 pl-3">
          {corporateText}
        </p>

        {/* Action Button Row */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-emerald-200/60 dark:border-emerald-900/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLocalCopy}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-black/30 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 font-mono font-bold text-xs border border-emerald-300/80 dark:border-emerald-800 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> COPY
                </>
              )}
            </button>

            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-black/30 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 font-mono font-bold text-xs border border-emerald-300/80 dark:border-emerald-800 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" /> SHARE
              </button>
            )}
          </div>

          {onFavorite && (
            <button
              type="button"
              onClick={onFavorite}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-600"
                  : "bg-white dark:bg-black/30 border-emerald-200 dark:border-emerald-800 text-gray-400 hover:text-amber-500"
              }`}
              title={isFavorite ? "Favorited" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`} />
            </button>
          )}
        </div>

        {/* WHY THIS WORKS Section */}
        {explanation && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-900/40 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-[10px]">
                WHY THIS WORKS
              </span>
              <span className="font-handwritten text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                better delivery 😃
              </span>
            </div>
            <p className="text-[11px] text-emerald-900/90 dark:text-emerald-200/90 font-sans leading-normal">
              {explanation.situation || explanation.goal || "It communicates the issue, shows impact, and asks for clarity without the frustration."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
