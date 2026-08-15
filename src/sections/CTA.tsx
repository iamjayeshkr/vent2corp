"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DoodleStar, DoodleSparkle, DoodleCurvedArrow, DoodleScribble, DoodleRays, DoodleAnnotation, DoodleHighlight } from "@/components/ui/Doodles";
import { TransformationIllustration } from "@/components/illustrations";
import { RawToCorporate } from "@/components/RawToCorporate";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none bg-white">
      <div className="p-10 sm:p-16 rounded-3xl bg-[#FAF9F6] border-2 border-gray-950 text-center space-y-8 shadow-md relative overflow-hidden">
        {/* Floating Doodles */}
        <DoodleStar className="doodle-pop w-8 h-8 text-[#2563EB] absolute top-6 left-8" />
        <DoodleSparkle className="doodle-pop w-8 h-8 text-yellow-400 absolute bottom-8 right-8" />
        <DoodleRays className="hidden sm:block w-14 h-14 text-[#2563EB] absolute bottom-8 left-10 opacity-80" rotation={8} />
        <DoodleScribble className="hidden sm:block w-20 h-6 text-pink-500 absolute top-12 right-16" rotation={-7} />
        <TransformationIllustration className="absolute -right-8 -bottom-8 hidden h-44 w-64 text-[#2563EB]/20 lg:block" rotation={-6} />

        {/* Yellow Eyebrow */}
        <div className="inline-block px-4 py-1.5 rounded-lg bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono">
          GO ON. WE WON&apos;T JUDGE.
        </div>

        {/* Huge Display Headlines */}
        <div className="space-y-1 max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none tracking-tight">
            YOU&apos;VE GOT <br className="sm:hidden" />THE THOUGHT.
          </h2>
          <h3 className="text-5xl sm:text-7xl lg:text-8xl font-display text-[#2563EB] leading-none tracking-tight">
            WE&apos;VE GOT <br className="sm:hidden" />THE WORDING.
          </h3>
          <DoodleHighlight className="absolute hidden sm:block h-7 w-36 text-yellow-300 -right-4 top-20 -z-10" rotation={-2} />
          <p className="text-xs sm:text-sm text-gray-700 font-sans pt-3">
            Write the message you probably shouldn&apos;t send. We&apos;ll help you turn it into one you can.
          </p>
        </div>

        <RawToCorporate
          compact
          variant="compact"
          accent="yellow"
          tone="anger removed"
          rawText="this deadline is not happening."
          corporateText="Could we agree on a timeline that lets us do this properly?"
          className="mx-auto max-w-3xl text-left"
        />

        {/* Large Yellow CTA Button */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <Link
            href="/new"
            className="cta-primary h-15 px-10 rounded-xl text-gray-950 font-black text-base flex items-center justify-center gap-2.5"
          >
            <span>START VENTING</span>
            <ArrowRight className="w-5 h-5 text-gray-950" />
          </Link>

          {/* Handwritten Annotation */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-base font-bold text-gray-950 font-handwritten -rotate-2">
              go on. we won&apos;t judge.
            </span>
            <DoodleCurvedArrow className="w-5 h-5 text-[#2563EB]" />
          </div>
          <DoodleAnnotation className="hidden sm:block absolute right-14 bottom-10 text-pink-600" rotation={-5} size="1.05rem">same thought. better delivery.</DoodleAnnotation>
        </div>
      </div>
    </section>
  );
}
