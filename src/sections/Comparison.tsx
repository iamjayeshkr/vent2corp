"use client";

import { X, Check } from "lucide-react";
import { DoodleAnnotation, DoodleHandCross, DoodleCurvedArrow, DoodleStar } from "@/components/ui/Doodles";

export function Comparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 select-none bg-white">
      {/* Section 9: NOT ANOTHER AI WRITING TOOL */}
      <div className="space-y-10 text-left">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
            THE VENT2CORP DIFFERENCE
          </div>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none">
            NOT ANOTHER
            <br />
            <span className="desktop-blue-note text-[#2563EB]">&ldquo;MAKE THIS SOUND PROFESSIONAL&rdquo;</span>
            <br />
            BUTTON.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Typical AI writing tools */}
          <div className="p-8 rounded-3xl bg-red-50/70 border-2 border-red-300 shadow-sm space-y-5 relative">
            <DoodleHandCross className="w-6 h-6 text-red-600 absolute top-4 right-4" />
            <h3 className="text-sm font-black text-red-600 font-mono flex items-center gap-2 uppercase tracking-wider">
              <X className="w-5 h-5 text-red-600" /> Typical AI
            </h3>

            <ul className="space-y-3.5 text-xs font-bold text-gray-800 font-sans">
              <li className="flex items-center gap-2">&ldquo;I hope this email finds you well...&rdquo;</li>
              <li className="flex items-center gap-2">&ldquo;Kindly note that...&rdquo;</li>
              <li className="flex items-center gap-2">&ldquo;I would like to request...&rdquo;</li>
              <li className="flex items-center gap-2">&ldquo;As per my previous email...&rdquo;</li>
            </ul>
          </div>
          <div className="comparison-versus md:hidden">VERSUS</div>

          {/* Right Column: vent2corp */}
          <div className="p-8 rounded-3xl bg-blue-50/70 border-2 border-[#2563EB] shadow-md space-y-5 relative">
            <DoodleStar className="w-6 h-6 text-[#2563EB] absolute top-4 right-4" />
            <h3 className="text-sm font-black text-[#2563EB] font-mono flex items-center gap-2 uppercase tracking-wider">
              <Check className="w-5 h-5 text-[#2563EB]" /> vent2corp
            </h3>

            <ul className="space-y-3.5 text-xs font-black text-gray-950 font-sans">
              <li className="flex items-center gap-2">&ldquo;Here&apos;s what&apos;s actually happening.&rdquo;</li>
              <li className="flex items-center gap-2">&ldquo;Here&apos;s what I need.&rdquo;</li>
              <li className="flex items-center gap-2">&ldquo;Here&apos;s what we can do next.&rdquo;</li>
            </ul>
          </div>
          <DoodleAnnotation className="block text-right text-[#2563EB]" rotation={-6} size="1.1rem">finally.</DoodleAnnotation>
        </div>
      </div>

      {/* Section 11: MAKE IT SOUND LIKE YOU */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F6] border-2 border-gray-950 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left relative overflow-hidden">
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
            GRANULAR CONTROLS
          </div>
          <h2 className="text-4xl sm:text-6xl font-display text-gray-950 leading-none">
            MAKE IT
            <br />
            <span className="desktop-blue-note text-[#2563EB]">SOUND LIKE YOU.</span>
          </h2>
          <p className="text-xs text-gray-700 font-sans leading-relaxed">
            Professional doesn&apos;t have to mean robotic. Choose the details that make the message sound like you.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-gray-950 font-handwritten">your voice still matters.</span>
            <DoodleCurvedArrow className="w-5 h-5 text-[#2563EB]" />
          </div>
        </div>

        {/* Miniature UI Representation surrounded by sticky notes & doodles */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border-2 border-gray-950 shadow-xs space-y-4 relative">

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">TONE</span>
              <div className="font-bold text-gray-950">Firm / Polite / Diplomatic</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">RECIPIENT</span>
              <div className="font-bold text-gray-950">Manager / Client / HR</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">PLATFORM</span>
              <div className="font-bold text-gray-950">Slack / Email / Teams</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">LENGTH</span>
              <div className="font-bold text-gray-950">Short / Balanced</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">STYLE</span>
              <div className="font-bold text-gray-950">Casual Facts Preserved</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 font-mono">TEMPLATES</span>
              <div className="font-bold text-gray-950">Saved Favorites</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
