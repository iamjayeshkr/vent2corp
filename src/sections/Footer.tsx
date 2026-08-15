"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { DoodleCurvedArrow, DoodleSparkle } from "@/components/ui/Doodles";
import type { AuthUser } from "@/components/AuthModal";

interface FooterProps {
  user?: AuthUser | null;
  onOpenAuth?: () => void;
}

export function Footer({ user = null, onOpenAuth }: FooterProps) {
  const requireAuthForModule = (event: MouseEvent<HTMLAnchorElement>) => {
    if (user) return;
    event.preventDefault();
    onOpenAuth?.();
  };

  return (
    <footer className="relative border-t-2 border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-white text-gray-950 select-none">
      <div className="mx-auto mb-9 flex max-w-7xl items-center justify-center gap-2 border-b border-yellow-300 pb-6 sm:justify-end">
        <DoodleSparkle className="h-5 w-5 text-[#FACC15]" />
        <span className="font-handwritten text-lg font-bold text-gray-950">for surviving corporate life, one message at a time.</span>
        <DoodleCurvedArrow className="h-5 w-5 text-[#2563EB]" rotation={15} />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center md:items-start gap-0.5">
          <Link href="/" className="text-2xl font-black font-sans tracking-tight text-gray-950">
            vent<span className="text-[#2563EB]">2</span>corp
          </Link>
          <p className="text-xs text-gray-500 font-sans">
            say it raw, send it right.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-800 font-sans">
          <a href="#features" className="hover:text-[#2563EB] transition-colors">Features</a>
          <Link href="/examples" onClick={requireAuthForModule} className="hover:text-[#2563EB] transition-colors">Examples</Link>
          <Link href="/tone-lab" onClick={requireAuthForModule} className="hover:text-[#2563EB] transition-colors">Tone Lab</Link>
          <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-[#2563EB] transition-colors">Pricing</a>
          <Link href="/settings" className="hover:text-[#2563EB] transition-colors">Privacy</Link>
          <Link href="/settings" className="hover:text-[#2563EB] transition-colors">Terms</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 font-mono">
          © {new Date().getFullYear()} vent2corp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
