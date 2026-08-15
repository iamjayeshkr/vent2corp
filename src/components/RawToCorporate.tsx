"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { DoodleAnnotation, DoodleArrow, DoodleCheckMark, DoodleSparkle } from "@/components/ui/Doodles";

type RawToCorporateProps = {
  rawText: string;
  corporateText: string;
  tone?: string;
  rotation?: number;
  accent?: "blue" | "yellow";
  compact?: boolean;
  variant?: "hero" | "inline" | "compact";
  className?: string;
};

/** The recurring vent2corp signature: feeling, translation, then a message safe to send. */
export function RawToCorporate({
  rawText,
  corporateText,
  tone = "professional",
  rotation = 0,
  accent = "blue",
  compact = false,
  variant = "inline",
  className = "",
}: RawToCorporateProps) {
  const [copied, setCopied] = useState(false);
  const isHero = variant === "hero";
  const padding = compact ? "p-4" : "p-5";
  const arrowColor = accent === "yellow" ? "text-[#FACC15]" : "text-[#2563EB]";
  const rawSequenceClass = isHero ? "hero-raw" : "";
  const transformSequenceClass = isHero ? "hero-transform" : "";
  const corporateSequenceClass = isHero ? "hero-corporate" : "";
  const copyMessage = async () => {
    await navigator.clipboard?.writeText(corporateText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={`raw-to-corporate grid grid-cols-1 items-center gap-4 sm:grid-cols-12 ${isHero ? "hero-diagonal-flow" : ""} relative ${className}`}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      <div className="absolute -top-9 left-2 z-20 hidden -rotate-2 flex-col items-center sm:flex">
        <DoodleAnnotation className="text-gray-950" rotation={-2} size="1rem">say it raw.</DoodleAnnotation>
        <DoodleArrow className={`h-5 w-8 ${arrowColor} -rotate-12`} />
      </div>
      <div className="absolute -top-9 right-2 z-20 hidden rotate-2 flex-col items-center sm:flex">
        <DoodleAnnotation className="text-emerald-700" rotation={2} size="1rem">send it right.</DoodleAnnotation>
        <DoodleArrow className={`h-5 w-8 ${arrowColor} rotate-180`} />
      </div>

      <article className={`${rawSequenceClass} hero-diagonal-raw paper-object relative ${padding} -rotate-2 rounded-3xl border-2 border-pink-300 bg-[#FFF5F7] sm:col-span-5`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold font-mono uppercase text-pink-700">raw thought</span>
          <DoodleSparkle className="h-5 w-5 text-pink-500" />
        </div>
        <p className={`font-sans font-medium leading-relaxed text-gray-950 ${compact ? "py-2 text-xs" : "py-4 text-xs sm:text-sm"}`}>&ldquo;{rawText}&rdquo;</p>
        <DoodleAnnotation className="text-pink-600" rotation={-3} size="0.9rem">yeah... maybe don&apos;t send that.</DoodleAnnotation>
      </article>

      <div className={`${transformSequenceClass} raw-to-corporate-arrow hero-diagonal-arrow relative flex items-center justify-center sm:col-span-2`}>
        <DoodleArrow className="raw-to-corporate-vertical-arrow doodle-arrow-draw hidden h-28 w-12 rotate-90 text-[#2563EB] sm:hidden" />
        <div className="raw-to-corporate-mobile-labels sm:hidden">
          <span>RAW</span><span>VENT2CORP</span><span>CORPORATE</span>
        </div>
        {isHero ? (
          <DoodleArrow className="doodle-arrow-draw h-14 w-20 text-[#2563EB]" rotation={-32} strokeWidth={3.2} />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FACC15] bg-gray-950 shadow-[3px_3px_0_#facc15]">
            <DoodleArrow className="doodle-arrow-draw h-5 w-7 text-white sm:rotate-0 rotate-90" />
          </div>
        )}
      </div>

      <article className={`${corporateSequenceClass} hero-diagonal-corporate paper-object relative ${padding} rotate-1 rounded-3xl border-2 border-emerald-300 bg-[#F0FDF4] sm:col-span-5`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold font-mono uppercase text-emerald-700">vent2corp</span>
          <DoodleCheckMark className="h-5 w-5 text-emerald-600" />
        </div>
        <p className={`font-sans font-medium leading-relaxed text-gray-950 ${compact ? "py-2 text-xs" : "py-3 text-xs"}`}>{corporateText}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-700">{tone}</span>
          <div className="flex items-center gap-2">
            <DoodleAnnotation className="text-emerald-600" rotation={2} size="0.95rem">ready to send ✓</DoodleAnnotation>
            <button type="button" onClick={copyMessage} className="raw-copy-button" aria-label="Copy corporate message">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </article>

      {isHero && <DoodleAnnotation className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 text-[#2563EB] sm:block" rotation={-2} size="1.1rem">same problem. better delivery.</DoodleAnnotation>}
    </div>
  );
}
