"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import {
  DoodleStar,
  DoodleScribble,
  DoodleUnderline,
  DoodleCrown,
  DoodleAnnotation,
  DoodleRays,
} from "@/components/ui/Doodles";
import { RawToCorporate } from "@/components/RawToCorporate";

interface HeroProps {
  onStartTranslating?: () => void;
}

export function Hero({ onStartTranslating }: HeroProps) {
  const [sequenceStarted, setSequenceStarted] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const start = () => setSequenceStarted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      start();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const rawText = "bc ye manager roz nayi requirement de raha hai aur purani wali bhi complete nahi hui";
  const corporateText = "I've noticed that new requirements are being introduced while some of the earlier work is still pending. Could we align on the current priorities and finalize the scope before proceeding further?";

  return (
    <section id="hero" className={`hero-stage relative mx-auto max-w-[1440px] overflow-hidden bg-white px-4 pb-28 pt-32 select-none sm:px-6 sm:pt-40 lg:min-h-[800px] lg:px-10 lg:pb-36 ${sequenceStarted ? "hero-sequence-ready" : ""}`}>
      <div className="relative z-10 lg:min-h-[620px]">
        {/* Left Editorial Headline Column */}
        <div className="relative z-20 space-y-6 text-left lg:w-[51%] lg:pt-12">
          {/* Decorative Doodles Around Headline */}
          <DoodleStar className="doodle-pop w-6 h-6 text-[#2563EB] absolute -top-8 left-0" />
          <DoodleCrown className="w-8 h-8 text-amber-500 absolute -top-10 right-12 hidden sm:block" />
          <DoodleRays className="w-10 h-10 text-yellow-400 absolute -top-4 left-28 hidden sm:block opacity-80" />

          {/* Uppercase Eyebrow */}
          <span className="editorial-label block">
            FOR PEOPLE WHO HAVE THOUGHTS THEY PROBABLY SHOULDN&apos;T SEND
          </span>

          {/* Massive Display Typography */}
          <h1 className="hero-heading font-display text-gray-950">
            SAY WHAT YOU
            <br />
            ACTUALLY MEAN.
            <br />
            <span className="desktop-blue-note text-[#2563EB]">WE&apos;LL MAKE IT</span>
            <br />
            <span className="desktop-blue-note relative inline-block text-[#2563EB]">
              CORPORATE.
              <DoodleUnderline className="doodle-draw absolute -bottom-3 left-0 w-full h-5 text-[#FACC15]" />
            </span>
          </h1>

          {/* Small Scribble Doodle */}
          <DoodleScribble className="w-16 h-4 text-pink-500" />
          <DoodleAnnotation className="hidden sm:block absolute -left-2 -bottom-9 text-[#2563EB]" rotation={-4} size="1.1rem">
            say it how it happened
          </DoodleAnnotation>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed max-w-md">
            Write the message exactly how you&apos;re thinking it.<br />
            Hinglish. Anger. Frustration. Confusion. Whatever.<br />
            <span className="text-gray-950">vent2corp keeps the meaning and fixes the delivery.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/new"
              onClick={onStartTranslating}
              className="cta-primary h-14 px-8 rounded-xl text-gray-950 font-extrabold text-sm flex items-center justify-center gap-2"
            >
              <span>START VENTING</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </Link>

            <button
              type="button"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="cta-secondary h-14 px-6 rounded-xl text-gray-950 font-extrabold text-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-gray-950 text-gray-950" />
              <span>SEE HOW IT WORKS</span>
            </button>
          </div>

          {/* Desktop trust points stay beside the composition; mobile continues the story below it. */}
          <div className="hidden pt-4 lg:flex lg:flex-wrap lg:items-center lg:gap-x-5 lg:gap-y-2 text-xs font-bold text-gray-800 font-sans">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span> HINGLISH FRIENDLY
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span> NO CORPORATE JARGON
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span> MEANING PRESERVED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span> READY TO SEND
            </span>
          </div>
        </div>

        {/* Right Side Visual Collage */}
        <div className="relative pt-16 lg:absolute lg:right-0 lg:top-24 lg:w-[46%] lg:pt-0">
          <RawToCorporate
            variant="hero"
            rawText={rawText}
            corporateText={corporateText}
            tone="meaning preserved"
          />
          <div className="mobile-hero-trust pt-10 text-xs font-bold text-gray-800 font-sans lg:hidden">
            <span><b>✓</b> HINGLISH FRIENDLY</span>
            <span><b>✓</b> MEANING PRESERVED</span>
            <span><b>✓</b> READY TO SEND</span>
          </div>
        </div>
      </div>
    </section>
  );
}
