"use client";

import { useEffect, useRef } from "react";
import { Brain, MessageSquare, Shield, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Vent Unfiltered Thoughts",
    description: "Type in Hindi, Hinglish, casual English, or slang. Express your frustration freely without holding back.",
    tag: "Input Phase",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Deconstructs Intent",
    description: "Our dual AI engine decodes core requests, emotion, urgency, and context—removing anger while keeping the point.",
    tag: "Analysis Phase",
  },
  {
    step: "03",
    icon: Shield,
    title: "Generate HR-Safe Text",
    description: "Receive a polished message tailored specifically to your chosen tone, recipient, and messaging platform.",
    tag: "Synthesis Phase",
  },
  {
    step: "04",
    icon: Zap,
    title: "Send & Align Effortlessly",
    description: "1-click copy, refine with quick actions (Shorter, Direct, Professional), and send with complete confidence.",
    tag: "Action Phase",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".step-card",
        { opacity: 0, scale: 0.94, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={containerRef} className="px-4 py-20 sm:py-28 bg-muted/20 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-3 block">
            WORKFLOW PIPELINE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            How raw thoughts become corporate protocol.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Four seamless steps from unfiltered emotion to workplace alignment.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="step-card group relative p-6 rounded-2xl border border-border/70 bg-background/80 backdrop-blur-xl shadow-lg hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Step Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="text-2xl font-mono font-black text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-border bg-muted/40 text-muted-foreground">
                    {step.tag}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-foreground transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
