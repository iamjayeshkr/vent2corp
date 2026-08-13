"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Terminal } from "lucide-react";

export function CTA() {
  const scrollToTranslator = () => {
    document.getElementById("translator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="px-4 py-20 sm:py-28 relative overflow-hidden">
      {/* Background Glow Aura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[350px] bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-purple-600/20 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 p-8 sm:p-14 rounded-3xl border border-border/80 bg-background/80 backdrop-blur-2xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-6">
          <Terminal className="w-3.5 h-3.5" /> Ready for Immediate Usage
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5">
          Ready to speak corporate with zero friction?
        </h2>
        <p className="text-muted-foreground text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Say what you actually mean without getting called into HR meetings.
        </p>

        <Button
          size="lg"
          onClick={scrollToTranslator}
          className="rounded-full px-9 h-14 text-base font-semibold bg-foreground text-background hover:scale-105 transition-all shadow-xl shadow-foreground/10"
        >
          <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
          Start Translating Now
        </Button>
      </div>
    </section>
  );
}
