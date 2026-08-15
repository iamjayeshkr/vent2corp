"use client";

import React from "react";
import { Home, History, Sparkles, User, Plus } from "lucide-react";
import { triggerHaptic } from "@/lib/mobile/capacitor";

export type MobileTab = "home" | "history" | "translate" | "tone_lab" | "profile";

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const handleSelect = (tab: MobileTab, haptic: "light" | "medium" | "heavy" = "light") => {
    void triggerHaptic(haptic);
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 dark:bg-[#09090B]/95 backdrop-blur-xl border-t-2 border-gray-950 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] select-none">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* 1. Home Tab */}
        <button
          type="button"
          onClick={() => handleSelect("home")}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-all ${
            activeTab === "home"
              ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-tight">Home</span>
        </button>

        {/* 2. History Tab */}
        <button
          type="button"
          onClick={() => handleSelect("history")}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-all ${
            activeTab === "history"
              ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-tight">History</span>
        </button>

        {/* 3. Central Elevated + FAB Action Button */}
        <div className="relative -top-5 flex justify-center w-16">
          <button
            type="button"
            onClick={() => handleSelect("translate", "heavy")}
            className="w-14 h-14 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 border-2 border-gray-950 dark:border-white active:scale-90 transition-transform cursor-pointer"
            aria-label="New Translation"
          >
            <Plus className="w-7 h-7 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Tone Lab Tab */}
        <button
          type="button"
          onClick={() => handleSelect("tone_lab")}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-all ${
            activeTab === "tone_lab"
              ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-tight">Tone Lab</span>
        </button>

        {/* 5. Profile Tab */}
        <button
          type="button"
          onClick={() => handleSelect("profile")}
          className={`flex flex-col items-center justify-center gap-1 w-14 transition-all ${
            activeTab === "profile"
              ? "text-blue-600 dark:text-blue-400 font-bold scale-105"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-mono tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
}
