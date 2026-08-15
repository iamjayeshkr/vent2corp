"use client";

import { DoodleSparkle, DoodleStraightArrow, DoodleCheckMark, DoodleConnector, DoodleAnnotation, DoodleAngryFace, DoodleUnderline } from "@/components/ui/Doodles";

export function ContextIntelligence() {
  return (
    <section className="bg-white py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1380px] space-y-14 text-left">
      <div className="space-y-2">
        <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase">
          NOT JUST A SPELL CHECKER
        </div>
        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none">
          YOUR ANGER
          <br />
          <span className="desktop-blue-note text-[#2563EB]">HAS CONTEXT.</span>
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-gray-700 font-sans">We don&apos;t just delete the swear words. We figure out what happened, then help you say it properly.</p>
      </div>

      {/* 3-Stage Infographic Card */}
      <div className="relative grid grid-cols-1 items-center gap-8 overflow-hidden border-y-2 border-gray-950 bg-[#FAF9F6] px-6 py-14 shadow-md md:grid-cols-12 lg:rounded-[3rem] lg:px-12">
        <DoodleAnnotation className="absolute hidden md:block -mt-28 ml-[31%] text-[#2563EB]" rotation={-5} size="1rem">the actual problem matters</DoodleAnnotation>
        {/* Stage 1: RAW */}
        <div className="relative space-y-3 border border-pink-300 bg-[#FFF5F7] p-7 shadow-sm md:col-span-5 md:-rotate-2 rounded-3xl">
          <DoodleAngryFace className="absolute right-5 top-5 h-7 w-7 text-pink-500" rotation={7} />
          <span className="text-[10px] font-bold font-mono text-pink-700 uppercase">01 / RAW INPUT</span>
          <p className="pr-10 text-sm font-sans font-bold text-gray-950 leading-relaxed">
            &ldquo;manager keeps adding work&rdquo;
          </p>
          </div>
          <DoodleStraightArrow className="mobile-stage-arrow h-14 w-12 text-[#2563EB] md:hidden" rotation={90} />

        <DoodleConnector className="hidden md:block absolute h-12 w-20 text-[#2563EB] opacity-80" style={{ left: "29%" }} />

        {/* Stage 2: WHAT VENT2CORP UNDERSTANDS */}
        <div className="relative space-y-4 border border-gray-300 bg-white p-5 shadow-2xs md:col-span-2 md:translate-y-10 rounded-3xl">
          <h4 className="text-xs font-bold font-mono text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
            <DoodleSparkle className="w-4 h-4 text-yellow-400" />
            02 / UNDERSTANDS
          </h4>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex items-center gap-3">
              <DoodleCheckMark className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-mono font-bold">EMOTION</span>
                <span className="font-bold text-gray-950">Changing priorities</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DoodleCheckMark className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-mono font-bold">SITUATION</span>
                <span className="font-bold text-gray-950">Current workload</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DoodleCheckMark className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-mono font-bold">INTENT</span>
                <span className="font-bold text-gray-950">Need for clearer scope</span>
              </div>
            </div>
          </div>
          </div>
          <DoodleStraightArrow className="mobile-stage-arrow h-14 w-12 text-[#2563EB] md:hidden" rotation={90} />

        <DoodleStraightArrow className="hidden md:block absolute h-8 w-14 text-[#2563EB] opacity-80" style={{ left: "62%" }} rotation={-4} />

        {/* Stage 3: WHAT YOU CAN SEND */}
        <div className="space-y-3 border border-emerald-300 bg-[#F0FDF4] p-7 shadow-md md:col-span-5 md:rotate-2 rounded-3xl">
          <span className="text-[10px] font-bold font-mono text-emerald-700 uppercase">03 / CORPORATE</span>
          <p className="text-xs sm:text-sm font-sans font-medium text-gray-950 leading-relaxed">
            A message that actually addresses the problem.
          </p>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-600 font-handwritten">
              clear, human, sendable ✓
            </span>
            <DoodleUnderline className="ml-auto h-3 w-28 text-emerald-500" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
