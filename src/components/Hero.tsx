"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface HeroProps {
  onStartTranslating?: () => void;
}

export function Hero({ onStartTranslating }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleStart = () => {
    if (onStartTranslating) {
      onStartTranslating();
    } else {
      document.getElementById("translator")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 sm:pt-44 sm:pb-28 overflow-hidden z-10"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-emerald-500/20 via-amber-500/20 to-purple-600/20 blur-[120px] rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Status Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md mb-8 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          AI Workplace Translation 2.0 · Powered by Gemini & Qwen 2.5
        </div>

        {/* Hero Title */}
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
        >
          Say what you <span className="underline decoration-emerald-400/60 decoration-wavy decoration-2">actually mean.</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
            We&apos;ll make it corporate.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Turn your unfiltered thoughts, Hinglish vents, and raw frustration into
          polished workplace messages without losing your true intent.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-semibold bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/10 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
            Start Translating
          </Button>
          <button
            onClick={() => document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto px-6 h-14 rounded-full border border-border bg-background/50 backdrop-blur-sm text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            See Live Examples
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> HR Approved
          </span>
          <span>·</span>
          <span>Zero Corporate Jargon Bloat</span>
          <span>·</span>
          <span>Platform Specific Rules</span>
        </div>
      </div>

      {/* Down Scroll Trigger */}
      <button
        onClick={handleStart}
        className="mt-16 sm:mt-20 animate-bounce text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full border border-border/50 bg-background/40 backdrop-blur-sm"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  );
}
