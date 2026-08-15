"use client";

import {
  DoodleCurvedArrow,
  DoodleAngryFace,
  DoodleUnderline,
  DoodleHeart,
  DoodleQuestion,
  DoodleChaos,
  DoodleStar,
  DoodleAnnotation,
  DoodleScribble,
} from "@/components/ui/Doodles";
import { RawToCorporate } from "@/components/RawToCorporate";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="space-y-28 bg-white py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      {/* Section 2: BETTER ENGLISH vs BETTER DELIVERY */}
      <div className="relative mx-auto grid max-w-[1320px] items-end gap-10 space-y-0 text-left lg:grid-cols-12">
        <div className="lg:col-span-7">
        <div className="inline-block px-4 py-1.5 rounded-lg bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono uppercase tracking-wider">
          THE PROBLEM
        </div>

        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-[0.92] tracking-tight">
          BETTER ENGLISH.
          <br />
          YOU NEED <span className="desktop-blue-note text-[#2563EB] relative inline-block">BETTER DELIVERY.</span>
        </h2>

        <p className="max-w-xl text-sm leading-relaxed text-gray-700 font-sans">
          Because sometimes you know exactly what you want to say. You just know that sending it exactly like that is probably a career-limiting decision.
        </p>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-800 font-handwritten">exactly.</span>
          <DoodleCurvedArrow className="w-6 h-6 text-[#2563EB] rotate-45" />
        </div>
        <DoodleHeart className="absolute left-[17%] top-20 hidden w-7 h-7 text-pink-500 md:block" rotation={-12} />
        <DoodleScribble className="absolute right-[16%] top-24 hidden w-16 h-5 text-[#2563EB] md:block" rotation={4} />

        </div>
        {/* Visual Raw → Professional Transformation Paper Cards */}
        <div className="grid grid-cols-1 items-center gap-6 pt-4 md:grid-cols-12 lg:col-span-5 lg:-mb-10">
          {/* Yellow Sticky Note Graphic */}
          <div className="md:col-span-4 p-5 rounded-2xl bg-[#FEF08A] text-gray-950 border-2 border-yellow-300 shadow-md relative transform -rotate-3 hover:rotate-0 transition-transform">
            <div className="pt-2 text-left space-y-2">
              <span className="text-base font-bold font-handwritten leading-snug block text-gray-950">
                it&apos;s not about what you know, it&apos;s about how you say it.
              </span>
              <div className="text-right text-xs">♡</div>
            </div>
          </div>

          <RawToCorporate
            compact
            variant="inline"
            tone="context kept"
            rawText="bhai ye kaam aaj kaise hoga"
            corporateText="I don&apos;t think I&apos;ll be able to complete this today. Could we discuss a revised timeline?"
            className="md:col-span-8 rounded-3xl border-2 border-gray-950 bg-white p-6"
          />
        </div>
      </div>

      {/* Section 3: LET IT OUT - Asymmetrical Chaotic Speech Bubbles */}
      <div className="relative grid grid-cols-1 items-center gap-8 overflow-hidden border-y-2 border-yellow-300 bg-[#FEF9C3]/70 px-6 py-16 shadow-sm sm:px-12 lg:grid-cols-12 lg:rounded-[3rem]">
        <DoodleChaos className="absolute -right-2 top-5 h-16 w-20 text-pink-500 opacity-80" rotation={-8} />
        <DoodleQuestion className="absolute right-28 bottom-6 hidden h-10 w-7 text-[#2563EB] sm:block" rotation={12} />
        <DoodleStar className="absolute left-5 bottom-6 h-7 w-7 text-yellow-500" rotation={-14} />
        {/* Left Headline Column */}
        <div className="lg:col-span-4 text-left space-y-3">
          <div className="inline-block px-3 py-1 rounded-md bg-[#FACC15] text-gray-950 font-extrabold text-xs font-mono">
            LET IT OUT
          </div>

          <h3 className="text-4xl sm:text-5xl font-display text-gray-950 leading-none">
            WE CLEAN UP THE
            <br />
            DELIVERY,
            <br />
            <span className="relative inline-block text-gray-950">
              NOT THE MEANING.
              <DoodleUnderline className="absolute -bottom-2 left-0 w-full h-4 text-pink-500" />
            </span>
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-gray-700 font-sans">You can rant here. We&apos;ll figure out what you&apos;re actually trying to communicate.</p>
          <DoodleAnnotation className="text-pink-600" rotation={3} size="1.05rem">yes. all of it.</DoodleAnnotation>
        </div>

        {/* A structured thought pile: readable handwriting, intentional rhythm. */}
        <div className="rant-notes-grid relative z-10 text-left lg:col-span-8">
          <div className="rant-note rant-note-primary relative sm:col-span-2">
            <span className="rant-note-label">RAW NOTE 01</span>
            <DoodleAngryFace className="absolute right-4 top-3 h-7 w-7 text-pink-500" rotation={8} />
            <span className="relative z-10 mt-3 block pr-10 font-handwritten text-xl font-bold leading-[1.05] text-gray-950">
              bhai, ye requirement phir change ho gayi.
            </span>
          </div>

          <div className="rant-note rant-note-tilt-right">
            <span className="rant-note-label">RAW NOTE 02</span>
            <span className="mt-3 block font-handwritten text-lg font-bold leading-[1.08] text-gray-950">
              kitni baar same cheez samjhau?
            </span>
          </div>

          <div className="rant-note rant-note-tilt-left">
            <span className="rant-note-label">RAW NOTE 03</span>
            <span className="mt-3 block font-handwritten text-lg font-bold leading-[1.08] text-gray-950">
              ye kaam aaj kaise hoga?
            </span>
          </div>

          <div className="rant-note rant-note-tilt-left">
            <span className="rant-note-label">RAW NOTE 04</span>
            <span className="mt-3 block font-handwritten text-lg font-bold leading-[1.08] text-gray-950">
              client sar pe khada hai.
            </span>
          </div>

          <div className="rant-note rant-note-tilt-right relative">
            <span className="rant-note-label">RAW NOTE 05</span>
            <span className="mt-3 block pr-6 font-handwritten text-lg font-bold leading-[1.08] text-gray-950">
              manager ko kya problem hai?
            </span>
            <span className="absolute bottom-3 right-4 text-lg" aria-hidden="true">😤</span>
          </div>
        </div>
      </div>
    </section>
  );
}
