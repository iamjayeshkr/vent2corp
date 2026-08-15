"use client";

import { Shield, Heart, Smile, Flame, Eye, AlertTriangle } from "lucide-react";
import { DoodleCurvedArrow, DoodleStar, DoodleHeart, DoodleLightning, DoodleSmile, DoodleWiggle, DoodleSpiral, DoodleExclamation, DoodleAnnotation } from "@/components/ui/Doodles";
import { ToneIllustration } from "@/components/illustrations";

interface ToneItem {
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  result: string;
  color: string;
}

const SIX_TONES: ToneItem[] = [
  {
    name: "Professional",
    badge: "Blue",
    icon: Shield,
    result: "I may need some additional time to complete this properly.",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    name: "Polite",
    badge: "Purple",
    icon: Heart,
    result: "I may not be able to complete this at the moment.",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    name: "Friendly",
    badge: "Green",
    icon: Smile,
    result: "I don't think I can do this right now. Let's push it a bit?",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    name: "Firm",
    badge: "Orange",
    icon: Flame,
    result: "I won't be able to complete this within the current timeline.",
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
  {
    name: "Diplomatic",
    badge: "Blue",
    icon: Eye,
    result: "It may be worth revisiting the timeline to ensure quality delivery.",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    name: "Passive Aggressive 💀",
    badge: "Pink",
    icon: AlertTriangle,
    result: "Sure, I'll just magically find extra time then. 🙂",
    color: "text-pink-600 bg-pink-50 border-pink-200",
  },
];

export function ToneLabShowcase() {
  const toneDoodles = [DoodleHeart, DoodleWiggle, DoodleSmile, DoodleLightning, DoodleSpiral, DoodleExclamation];
  return (
    <section className="relative overflow-hidden bg-[#f5f8ff] py-[clamp(7rem,11vw,12rem)] px-4 select-none sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1320px] space-y-10 text-left lg:space-y-12">
      <div className="max-w-4xl space-y-3">
        <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
          TONE LAB
        </div>
        <h2 className="tone-lab-title font-display text-gray-950">
          ONE THOUGHT.
          <br />
          SIX WAYS <span className="desktop-blue-note text-[#2563EB]">TO SAY IT.</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-sans">
          Same message. Different energy.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.28fr)] lg:gap-10">
        {/* Left Sticky Input Card */}
        <div className="relative space-y-4 rounded-3xl border-2 border-pink-300 bg-[#fff5f7] p-6 shadow-[4px_5px_0_rgb(236_72_153_/_0.12)] lg:sticky lg:top-28">
          <ToneIllustration className="absolute right-4 top-4 h-12 w-14 text-pink-500/60" rotation={5} />
          <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-bold font-mono uppercase text-pink-700">raw thought</span>
          <p className="max-w-[22rem] pr-6 text-xl font-handwritten font-bold leading-tight text-gray-950">
            &ldquo;ye kaam abhi possible nahi hai&rdquo;
          </p>
          <div className="flex items-center gap-2 border-t border-pink-200 pt-4">
            <DoodleCurvedArrow className="h-7 w-7 text-[#2563EB]" />
            <DoodleAnnotation className="text-[#2563EB]" rotation={-2} size="1rem">choose your delivery.</DoodleAnnotation>
          </div>
        </div>

        {/* Right tone choices: a consistent, scannable card grid. */}
        <div className="tone-card-grid grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SIX_TONES.map((t, idx) => {
            const Icon = t.icon;
            const ToneDoodle = toneDoodles[idx];
            return (
              <div
                key={t.name}
                className="tone-rail-card relative flex min-h-44 flex-col justify-between rounded-2xl border-2 border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                {t.name.includes("Passive") && (
                  <DoodleStar className="w-4 h-4 text-pink-500 absolute -top-2 -right-2" />
                )}
                <ToneDoodle className="absolute bottom-2 right-2 h-4 w-4 text-[#2563EB]/70" rotation={idx % 2 === 0 ? -10 : 8} strokeWidth={2.4} />
                <div className="space-y-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-950 font-sans">{t.name}</h4>
                  <p className="max-w-[28rem] text-sm text-gray-700 font-sans leading-relaxed">
                    {t.result}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
