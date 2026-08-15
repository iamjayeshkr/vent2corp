"use client";

import React from "react";
import { User, Settings, Crown, LogOut, Shield, Moon, Sun, Monitor, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface MobileProfileScreenProps {
  onOpenCheckout: () => void;
}

export function MobileProfileScreen({ onOpenCheckout }: MobileProfileScreenProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    void triggerHaptic("medium");
    await logout();
  };

  return (
    <div className="space-y-5 pb-6 select-none font-sans">
      {/* 1. User Header & Pro Banner */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-[3px_3px_0_#18181b] dark:shadow-none space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-display font-bold text-lg flex items-center justify-center border-2 border-gray-950 shadow-xs">
            {user ? user.name.slice(0, 2).toUpperCase() : "GU"}
          </div>
          <div>
            <h2 className="text-lg font-display text-gray-950 dark:text-white leading-tight">
              {user ? user.name : "Guest User"}
            </h2>
            <p className="text-xs text-gray-500 font-mono">
              {user ? user.email : "Sign in to save your vents across devices"}
            </p>
          </div>
        </div>

        {/* Pro Upgrade Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 border-2 border-gray-950 text-gray-950 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 fill-gray-950 text-gray-950" /> vent2corp Pro
            </span>
            <span className="text-[10px] font-mono font-extrabold uppercase bg-gray-950 text-yellow-300 px-2 py-0.5 rounded-full">
              ₹499/mo
            </span>
          </div>
          <p className="text-xs font-sans font-medium leading-tight">
            Unlimited daily translations, custom tone presets & saved templates.
          </p>
          <button
            type="button"
            onClick={onOpenCheckout}
            className="w-full py-2.5 rounded-xl bg-gray-950 text-white font-mono font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer"
          >
            Upgrade Now →
          </button>
        </div>
      </div>

      {/* 2. Preferences & App Settings */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-sm space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Preferences & Defaults
        </h3>

        <div className="space-y-2 text-xs font-sans">
          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Default Tone</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400 capitalize">Professional</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Default Recipient</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 capitalize">Manager</span>
          </div>

          <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Default Platform</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 capitalize">Slack</span>
          </div>
        </div>
      </div>

      {/* 3. Security & Account Actions */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-sm space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Privacy & Security
        </h3>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-mono text-emerald-900 dark:text-emerald-200">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vents encrypted & safe on server-side</span>
        </div>

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-mono font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
