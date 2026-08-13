"use client";

import { Terminal, ShieldCheck, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/80 bg-background/80 backdrop-blur-xl px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-muted-foreground">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm tracking-tight">
              vent<span className="text-emerald-500">2corp</span> <span className="text-[10px] text-muted-foreground font-normal">v2.0</span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Unfiltered thoughts converted into workplace alignment.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>All AI Engines Operational · Gemini 2.5 & Qwen 2.5</span>
        </div>

        {/* Links & Copyright */}
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private & Safe
          </span>
          <span>·</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Code2 className="w-3.5 h-3.5" /> Source
          </a>
        </div>
      </div>
    </footer>
  );
}
