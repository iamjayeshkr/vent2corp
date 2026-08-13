"use client";

import { useEffect, useRef } from "react";
import { Languages, MessageCircle, ShieldCheck, Smartphone, Sparkles, Cpu, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BENTO_ITEMS = [
  {
    icon: Languages,
    title: "Hinglish & Multilingual Engine",
    description: "Understands Hinglish, casual Hindi, raw English, and workplace slang without needing pre-sanitization.",
    badge: "AI Powered",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Sparkles,
    title: "6 Adaptive Tones",
    description: "Toggle between Professional, Polite, Friendly, Firm, Diplomatic, or Passive-Aggressive.",
    badge: "Context Aware",
    color: "from-amber-500/20 to-amber-500/5",
    border: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-400",
    colSpan: "lg:col-span-1",
  },
  {
    icon: MessageCircle,
    title: "Platform Formatting",
    description: "Output adjusts automatically for Slack, WhatsApp, Teams, Email (with salutation/closings), or LinkedIn.",
    badge: "Smart Layout",
    color: "from-purple-500/20 to-purple-500/5",
    border: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/10 text-purple-400",
    colSpan: "lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Meaning Preservation Guarantee",
    description: "Removes anger, profanity, and toxicity while strictly keeping your core complaint and request intact.",
    badge: "HR Safe",
    color: "from-emerald-500/20 to-blue-500/5",
    border: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Cpu,
    title: "Dual AI Fallback Engine",
    description: "Powered by Google Gemini 2.5 API with instant zero-latency fallback to local Ollama qwen2.5:3b.",
    badge: "Reliable & Fast",
    color: "from-amber-500/20 to-purple-500/5",
    border: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-400",
    colSpan: "lg:col-span-2",
  },
  {
    icon: Smartphone,
    title: "Responsive Developer UI",
    description: "Designed for seamless mobile, tablet, and desktop usage down to 320px screens.",
    badge: "320px+",
    color: "from-blue-500/20 to-emerald-500/5",
    border: "hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-400",
    colSpan: "lg:col-span-1",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="px-4 py-20 sm:py-28 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" /> Built for Modern Teams
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Engineered for workplace clarity.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Everything you need to navigate delicate corporate conversations with confidence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENTO_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`bento-card group relative p-6 sm:p-8 rounded-2xl border border-border/80 bg-background/60 backdrop-blur-xl transition-all duration-300 ${item.border} ${item.colSpan} flex flex-col justify-between overflow-hidden shadow-lg shadow-black/5 hover:-translate-y-1`}
            >
              {/* Background Accent Gradient */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.icon className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border border-border/60 bg-muted/50 text-muted-foreground">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 group-hover:text-foreground transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
