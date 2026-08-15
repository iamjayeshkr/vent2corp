"use client";

import React from "react";
import { Crown, Sparkles } from "lucide-react";
import type { MobileTab } from "./MobileBottomNav";

interface MobileHeaderProps {
  activeTab: MobileTab;
  onOpenCheckout?: () => void;
}

export function MobileHeader({ activeTab, onOpenCheckout }: MobileHeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case "home":
        return "Home";
      case "translate":
        return "Translate";
      case "history":
        return "History";
      case "tone_lab":
        return "Tone Lab";
      case "profile":
        return "Profile";
      default:
        return "vent2corp";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 dark:bg-[#09090B]/95 backdrop-blur-md border-b-2 border-gray-950 dark:border-gray-800 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 flex items-center justify-between select-none">
      {/* Left Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-yellow-400 text-gray-950 border-2 border-gray-950 flex items-center justify-center font-display font-bold text-xs shadow-[2px_2px_0_#18181b]">
          v2c
        </div>
        <div>
          <span className="font-display text-lg tracking-wide text-gray-950 dark:text-white leading-none block">
            vent2corp
          </span>
          <span className="text-[9px] font-handwritten text-purple-600 dark:text-purple-400 font-bold block">
            say it raw, send it right.
          </span>
        </div>
      </div>

      {/* Center Title */}
      <div className="text-sm font-mono font-bold text-gray-950 dark:text-white uppercase tracking-wider">
        {getTitle()}
      </div>

      {/* Right Crown Badge */}
      <button
        type="button"
        onClick={onOpenCheckout}
        className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 border-2 border-amber-400 text-amber-600 dark:text-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Upgrade to Pro"
      >
        <Crown className="w-4 h-4 fill-amber-400 text-amber-500" />
      </button>
    </header>
  );
}
