"use client";

import { Shield, Sparkles, CheckCircle2, Lock } from "lucide-react";

export function TrustStrip() {
  return (
    <div className="py-8 bg-gray-50 border-y border-gray-200/80 text-xs font-semibold text-gray-700 font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-gray-500 font-bold uppercase tracking-wider font-mono text-[11px]">
          built for people who work with people
        </span>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-bold text-gray-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hinglish friendly
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" /> Real-world context
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" /> Meaning preserved
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-gray-600" /> No corporate jargon
          </span>
        </div>
      </div>
    </div>
  );
}
