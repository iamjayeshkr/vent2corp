"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TONES } from "@/types";
import type { Tone } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

const EXAMPLES = [
  {
    raw: "abe chutiya hai kya?? kuch bhi requiement bhej raha hai soch toh le ek baar",
    outputs: {
      professional:
        "I wanted to suggest that we carefully review and validate the current requirements before proceeding further, as some of the recent updates seem inconsistent with our scope.",
      polite:
        "I hope you don't mind me bringing this up, but I noticed a few discrepancies in the latest requirements. Would it be possible to review them together when you have a moment?",
      friendly:
        "Hey! The requirements have been shifting quite a bit lately and it's getting tricky to keep up. Mind if we jump on a quick sync to lock them in?",
      firm: "The requirements being submitted lack proper vetting and alignment. We need to conduct a formal scope review and freeze requirements before continuing work.",
      diplomatic:
        "I wanted to flag that the recent changes to the brief may introduce some complexity. Perhaps we could align on the core priorities to ensure we're delivering effectively.",
      "passive-aggressive":
        "I noticed another set of requirements was sent over. Just wanted to confirm if these supersedes the previous brief, or if we should expect another update tomorrow?",
    },
  },
  {
    raw: "jaldi kar bhai client sar pe khada hai",
    outputs: {
      professional:
        "Could we please prioritize this deliverable at the earliest? The client is currently awaiting an update on our progress.",
      polite:
        "I hope you're doing well! The client is currently following up on this deliverable, so I kindly wanted to ask if we could expedite it when possible.",
      friendly:
        "Hey! The client is waiting on this one—mind bumping it up the queue? Would really appreciate your quick turnaround!",
      firm: "This deliverable needs immediate prioritization. Client expectations are at risk, and delays will impact our standing.",
      diplomatic:
        "I wanted to surface that the client has requested an immediate status update on this. Bumping this up our list will help maintain a strong working relationship.",
      "passive-aggressive":
        "Just a gentle reminder that the client is still awaiting this update. I'm sure it's at the top of your queue.",
    },
  },
  {
    raw: "kya bakwas kaam bana ke bheja hai",
    outputs: {
      professional:
        "I believe the current deliverable requires additional refinement to meet our quality benchmarks. Let's schedule a review to walk through the necessary adjustments.",
      polite:
        "Thank you for sending this over. I noticed a few areas that could use some polishing to better align with our standards. Could we review them together?",
      friendly:
        "Hey, thanks for putting this together! It needs a quick extra pass to match what we discussed—want to go over it real quick?",
      firm: "The quality of the current output does not meet our agreed standards. Please revise it according to the initial specifications immediately.",
      diplomatic:
        "I wanted to share some feedback on the latest draft. A few targeted improvements will significantly enhance the final output.",
      "passive-aggressive":
        "I reviewed the submission and noticed several deviations from the original brief. I'm assuming this was a rough draft.",
    },
  },
];

export function Examples() {
  const [activeTone, setActiveTone] = useState<Tone>("professional");

  return (
    <section id="examples" className="px-4 py-20 sm:py-28 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Real Transformations
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Same raw thought. Perfect delivery.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Select a tone below to see how raw thoughts adapt seamlessly.
          </p>
        </div>

        {/* Tone Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTone(t.value)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full border transition-all duration-200 ${
                activeTone === t.value
                  ? "bg-foreground text-background border-foreground shadow-md scale-105"
                  : "bg-background/60 backdrop-blur-sm text-muted-foreground border-border/80 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Example Cards */}
        <div className="space-y-6">
          {EXAMPLES.map((example, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-background/70 backdrop-blur-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/60 transition-all hover:border-foreground/20"
            >
              {/* Raw Input Side */}
              <div className="p-6 sm:p-7 flex flex-col justify-between bg-amber-500/[0.02]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                      Raw Thought
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-medium text-foreground leading-snug">
                    &ldquo;{example.raw}&rdquo;
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40 text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <span>Input Language: Hinglish / Slang</span>
                </div>
              </div>

              {/* Corporate Output Side */}
              <div className="p-6 sm:p-7 flex flex-col justify-between bg-emerald-500/[0.02]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                        Corporate Version
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {TONES.find((t) => t.value === activeTone)?.label}
                    </Badge>
                  </div>
                  <p className="text-base sm:text-lg font-normal text-muted-foreground leading-relaxed transition-all">
                    {example.outputs[activeTone]}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border/40 text-[11px] font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5" /> HR Approved & Workplace Ready
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
