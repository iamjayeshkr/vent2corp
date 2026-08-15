"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Flame, Shield, Smile, Zap, Heart } from "lucide-react";
import type { Tone } from "@/types";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface MobileToneLabScreenProps {
  onSelectTone: (tone: Tone) => void;
}

interface ToneCardItem {
  value: Tone;
  title: string;
  subtext: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  sample: string;
}

const TONE_CARDS: ToneCardItem[] = [
  {
    value: "professional",
    title: "Professional",
    subtext: "Clear. Direct. Respectful.",
    emoji: "💼",
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40",
    borderColor: "border-blue-300 dark:border-blue-800",
    accentColor: "text-blue-600 dark:text-blue-400",
    sample: "I've noticed that new requirements are being added while earlier tasks are still pending. Could we align on priorities?",
  },
  {
    value: "polite",
    title: "Polite",
    subtext: "Courteous. Soft. Considerate.",
    emoji: "🤝",
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40",
    borderColor: "border-purple-300 dark:border-purple-800",
    accentColor: "text-purple-600 dark:text-purple-400",
    sample: "Thank you for sharing the update. Once the current phase is completed, I'd be happy to review the new requirements.",
  },
  {
    value: "friendly",
    title: "Friendly",
    subtext: "Warm. Approachable. Collaborative.",
    emoji: "😊",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40",
    borderColor: "border-emerald-300 dark:border-emerald-800",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    sample: "Hey! Just wanted to check in on the priorities so we don't get overloaded with the recent scope changes.",
  },
  {
    value: "firm",
    title: "Firm",
    subtext: "Strong. Uncompromising. Direct.",
    emoji: "🎯",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
    borderColor: "border-amber-300 dark:border-amber-800",
    accentColor: "text-amber-600 dark:text-amber-400",
    sample: "Adding scope mid-sprint threatens our delivery commitment. I will proceed with initial specifications first.",
  },
  {
    value: "diplomatic",
    title: "Diplomatic",
    subtext: "Tactful. Balanced. Strategic.",
    emoji: "⚖️",
    bgGradient: "from-cyan-50 to-sky-50 dark:from-cyan-950/40 dark:to-sky-950/40",
    borderColor: "border-cyan-300 dark:border-cyan-800",
    accentColor: "text-cyan-600 dark:text-cyan-400",
    sample: "To ensure we deliver maximum value, let me evaluate the impact of these new requirements on the target deadline.",
  },
  {
    value: "passive-aggressive",
    title: "Passive Aggressive 💀",
    subtext: "Sarcastic. Subtly Lethal.",
    emoji: "💀",
    bgGradient: "from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/40",
    borderColor: "border-rose-300 dark:border-rose-800",
    accentColor: "text-rose-600 dark:text-rose-400",
    sample: "Per my previous email, scope stability is key to hitting deadlines. But I'm sure you knew that already.",
  },
];

export function MobileToneLabScreen({ onSelectTone }: MobileToneLabScreenProps) {
  const [selectedTone, setSelectedTone] = useState<Tone>("professional");
  const activeCard = TONE_CARDS.find((c) => c.value === selectedTone) || TONE_CARDS[0];

  const handleUseTone = () => {
    void triggerHaptic("heavy");
    onSelectTone(selectedTone);
  };

  return (
    <div className="space-y-5 pb-6 select-none font-sans">
      {/* Heading */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Tone Lab
          </span>
          <span className="font-handwritten text-sm text-purple-600 dark:text-purple-400 font-bold">
            choose your weapon.
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display text-gray-950 dark:text-white leading-[0.95]">
          ONE THOUGHT. <br />
          SIX WAYS TO SAY IT.
        </h1>
      </div>

      {/* Horizontal Carousel of 6 Distinct Tone Cards */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1">
          {TONE_CARDS.map((card) => {
            const isSelected = card.value === selectedTone;
            return (
              <div
                key={card.value}
                onClick={() => {
                  void triggerHaptic("light");
                  setSelectedTone(card.value);
                }}
                className={`w-44 shrink-0 p-4 rounded-2xl border-2 bg-gradient-to-b ${card.bgGradient} ${card.borderColor} shadow-[3px_3px_0_#18181b] dark:shadow-none space-y-3 cursor-pointer transition-all ${
                  isSelected ? "ring-2 ring-purple-500 scale-105" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{card.emoji}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`text-sm font-display tracking-wide ${card.accentColor}`}>
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-sans font-medium">
                    {card.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Tone Preview Box */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-md space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-gray-500 uppercase">Tone Sample Preview</span>
          <span className={activeCard.accentColor}>{activeCard.title}</span>
        </div>

        {/* Input Raw Box */}
        <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 text-xs text-pink-950 dark:text-pink-100 font-medium">
          "bc ye manager roz nayi requirement de raha hai aur purani wali bhi complete nahi hui 😡"
        </div>

        {/* Output Rephrased Box */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-100 font-medium border-l-2 border-emerald-500">
          "{activeCard.sample}"
        </div>
      </div>

      {/* Primary Use This Tone Button */}
      <button
        type="button"
        onClick={handleUseTone}
        className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 border-2 border-gray-950 shadow-[4px_4px_0_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
      >
        <span>USE THIS TONE</span>
        <ArrowRight className="w-5 h-5 text-yellow-300" />
      </button>
    </div>
  );
}
