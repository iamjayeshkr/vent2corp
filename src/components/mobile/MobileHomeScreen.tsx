"use client";

import React from "react";
import { ArrowRight, Check, Sparkles, Flame, Shield, Zap, Heart, Users } from "lucide-react";
import { RawToCorporateCard } from "./RawToCorporateCard";
import { DoodleUnderline, DoodleStar, DoodleSpark } from "@/components/ui/Doodles";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface MobileHomeScreenProps {
  onStartVenting: () => void;
  onSeeHowItWorks: () => void;
}

export function MobileHomeScreen({ onStartVenting, onSeeHowItWorks }: MobileHomeScreenProps) {
  const handleStartVentingClick = () => {
    void triggerHaptic("heavy");
    onStartVenting();
  };

  const handleSeeHowItWorksClick = () => {
    void triggerHaptic("light");
    onSeeHowItWorks();
  };

  return (
    <div className="space-y-6 pb-6 select-none font-sans">
      {/* 1. Hero Badge Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-[4px_4px_0_#18181b] dark:shadow-none space-y-4 relative overflow-hidden">
        {/* Top Tag Sticker */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
          <span>FOR PEOPLE WHO HAVE THOUGHTS THEY PROBABLY SHOULDN'T SEND</span> 😡
        </div>

        {/* Main Heading */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-display text-gray-950 dark:text-white leading-[0.95] tracking-tight">
            SAY WHAT YOU <br />
            ACTUALLY MEAN. <br />
            WE'LL MAKE IT{" "}
            <span className="relative inline-block text-[#2563EB]">
              CORPORATE.
              <DoodleUnderline className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400" />
            </span>
          </h1>
        </div>

        {/* Supporting Copy */}
        <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-sans font-medium">
          Write the message exactly how you're thinking it. Hinglish, Anger, Frustration, Confusion. Whatever. vent2corp keeps the meaning and fixes the delivery.
        </p>

        {/* 4 Feature Pills with Check Icons */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono font-bold text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>HINGLISH FRIENDLY</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>MEANING PRESERVED</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>NO JARGON</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>READY TO SEND</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={handleStartVentingClick}
            className="w-full h-13 rounded-2xl bg-[#FACC15] hover:bg-yellow-400 text-gray-950 font-mono font-bold text-xs flex items-center justify-center gap-2 border-2 border-gray-950 shadow-[3px_3px_0_#18181b] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <span>START VENTING</span>
            <ArrowRight className="w-4 h-4 text-gray-950" />
          </button>

          <button
            type="button"
            onClick={handleSeeHowItWorksClick}
            className="w-full h-12 rounded-2xl bg-white dark:bg-gray-900 hover:bg-gray-100 text-gray-950 dark:text-white font-mono font-bold text-xs flex items-center justify-center border-2 border-gray-950 dark:border-gray-700 transition-colors cursor-pointer"
          >
            SEE HOW IT WORKS
          </button>
        </div>
      </div>

      {/* 2. Interactive Transformation Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Live Preview Example
          </span>
          <span className="font-handwritten text-xs font-bold text-purple-600 dark:text-purple-400">
            see the magic
          </span>
        </div>

        <RawToCorporateCard
          rawText="bc ye manager roz nayi requirement de raha hai aur purani wali bhi complete nahi hui 😡"
          corporateText="I've noticed that new requirements are being added while some of the earlier tasks are still pending. Could we align on the current priorities and finalize the scope before moving forward?"
          tone="professional"
          explanation={{
            emotion: "Overwhelmed & Frustrated",
            situation: "Scope Creep & Unclear Priorities",
            goal: "Align on priority roadmap before taking new tasks",
          }}
        />
      </div>

      {/* 3. Product Highlights Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h4 className="text-xs font-mono font-bold text-gray-950 dark:text-white">Blazing Fast</h4>
          <p className="text-[11px] text-gray-500 font-sans">Instant AI transformations in milliseconds.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-1.5">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h4 className="text-xs font-mono font-bold text-gray-950 dark:text-white">Secure & Private</h4>
          <p className="text-[11px] text-gray-500 font-sans">Your workplace vents are never logged publicly.</p>
        </div>
      </div>
    </div>
  );
}
