"use client";

import { Crown, Sparkles, ArrowRight } from "lucide-react";

interface ProBannerProps {
  onUpgrade?: () => void;
}

export function ProBanner({ onUpgrade }: ProBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0B0E14] text-white p-6 sm:p-8 border border-purple-900/40 shadow-2xl select-none">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
            <Crown className="w-6 h-6 fill-amber-400/20" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Go Pro. Unlock your full potential.
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/20" />
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-sans">
              Unlimited translations · Custom tones · Saved templates · Priority support
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
        >
          <span>Upgrade Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
