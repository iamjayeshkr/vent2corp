"use client";

import { MessageSquare, Shield, CheckCircle } from "lucide-react";
import { DoodleAnnotation, DoodleStraightArrow, DoodleAngryFace, DoodleConfused, DoodleCheckMark } from "@/components/ui/Doodles";

const STEPS = [
  {
    num: "01",
    title: "VENT",
    desc: "Write it exactly how you feel it.",
    icon: MessageSquare,
  },
  {
    num: "02",
    title: "UNDERSTAND",
    desc: "We figure out the situation, intent and important context.",
    icon: Shield,
  },
  {
    num: "03",
    title: "SEND",
    desc: "You get something you can actually send.",
    icon: CheckCircle,
  },
];

export function StepFlow() {
  return (
    <section className="relative overflow-hidden bg-[#fffbed] py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1320px] space-y-16 text-left">
      <div className="space-y-2 text-center">
        <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
          HOW IT WORKS
        </div>
        <h2 className="step-flow-heading font-display text-gray-950">
          VENT. UNDERSTAND. SEND.
        </h2>
        <DoodleAnnotation className="text-[#2563EB]" rotation={-3} size="1.1rem">that&apos;s it.</DoodleAnnotation>
      </div>

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const StepDoodle = [DoodleAngryFace, DoodleConfused, DoodleCheckMark][idx];
          return (
            <div
              key={s.num}
              className="step-flow-card relative flex min-h-[19rem] flex-col justify-between overflow-visible rounded-3xl border-2 border-gray-950 bg-white p-7 shadow-[5px_6px_0_rgb(24_24_27_/_0.12)] transition-all hover:-translate-y-1 hover:shadow-[7px_9px_0_rgb(24_24_27_/_0.16)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-display text-[#2563EB]">{s.num}</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="step-flow-card-title font-display text-gray-950">{s.title}</h3>

                <p className="max-w-[15rem] text-sm text-gray-700 font-sans leading-relaxed">{s.desc}</p>
              </div>

              <StepDoodle className="absolute bottom-5 right-5 h-16 w-16 text-[#2563EB]/75" rotation={idx === 0 ? -8 : idx === 1 ? 6 : -4} strokeWidth={2.5} />

              {idx < 2 && (
                <>
                  <DoodleStraightArrow className="absolute -right-11 top-1/2 z-20 hidden h-11 w-16 -translate-y-1/2 text-[#2563EB] md:block" />
                  <DoodleStraightArrow className="mobile-step-arrow h-14 w-12 text-[#2563EB] md:hidden" rotation={90} />
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
