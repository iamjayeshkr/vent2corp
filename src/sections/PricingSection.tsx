"use client";

import Link from "next/link";
import { ArrowRight, Lock, Check } from "lucide-react";
import { DoodleCheckMark } from "@/components/ui/Doodles";

export function PricingSection() {
  return (
    <section id="pricing" className="space-y-28 bg-white py-[clamp(7rem,12vw,13rem)] px-4 select-none sm:px-6 lg:px-10">
      {/* Section 12: Privacy - YOUR MESSAGES STAY YOURS */}
      <div className="mx-auto max-w-[1320px] space-y-6 border-y-2 border-gray-950 bg-[#FAF9F6] p-8 text-left shadow-sm lg:rounded-[3rem]">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold font-mono uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-gray-700" /> PRIVACY & CONTROL
          </span>
          <h2 className="text-4xl sm:text-6xl font-display text-gray-950 leading-none">
            YOUR MESSAGE.
            <br />
            YOUR BUSINESS.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-gray-700 font-sans">Your workplace vent is personal.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-gray-800 font-sans">
          <div className="p-4 rounded-2xl bg-white border border-gray-300 flex items-center gap-2.5 shadow-2xs">
            <DoodleCheckMark className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Messages are never publicly visible</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-300 flex items-center gap-2.5 shadow-2xs">
            <DoodleCheckMark className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>API keys safe on server side</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-300 flex items-center gap-2.5 shadow-2xs">
            <DoodleCheckMark className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Users control saved local history</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-300 flex items-center gap-2.5 shadow-2xs">
            <DoodleCheckMark className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>One-click local data wipe</span>
          </div>
        </div>
      </div>

      {/* Section 13: Pricing - START FREE. GO PRO WHEN YOU NEED MORE. */}
      <div className="mx-auto max-w-[1180px] space-y-12 text-center">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold font-mono uppercase tracking-widest text-gray-500 block">
            PRICING
          </span>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display text-gray-950 leading-none">
            START FREE.
            <br />
            GO PRO WHEN <span className="desktop-blue-note text-[#2563EB]">YOU&apos;RE READY.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 text-left md:grid-cols-12">
          {/* Free Tier */}
          <div className="flex flex-col justify-between space-y-6 border-2 border-gray-950 bg-white p-7 shadow-md md:col-span-4 md:-rotate-1 rounded-3xl">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase">FREE</span>
              <div className="text-5xl font-display text-gray-950">₹0 <span className="text-xs font-sans font-medium text-gray-500">/ month</span></div>
              <p className="text-xs text-gray-600 font-sans">For occasional workplace survival.</p>
              <ul className="space-y-3 text-xs font-bold text-gray-800 font-sans">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Core translations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Basic tones</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Basic history</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 5 platforms support</li>
              </ul>
            </div>
            <Link
              href="/new"
              className="w-full h-13 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-950 font-extrabold text-xs flex items-center justify-center border-2 border-gray-950 transition-colors"
            >
              Start free →
            </Link>
          </div>

          {/* Pro Tier - Black Background */}
          <div className="relative flex flex-col justify-between space-y-6 overflow-hidden border-2 border-gray-950 bg-[#09090B] p-9 text-white shadow-xl md:col-span-8 md:rotate-1 md:scale-[1.04] rounded-3xl">
            {/* Tiny Sticker */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#FACC15] text-gray-950 uppercase font-mono shadow-xs">
              for people who apparently have meetings all day
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">PRO</span>
              <div className="text-5xl font-display text-white">₹499 <span className="text-xs font-sans font-medium text-gray-400">/ month</span></div>
              <p className="text-xs text-gray-300 font-sans">For people who apparently have meetings all day.</p>
              <ul className="space-y-3 text-xs font-bold text-white font-sans">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited translations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom tones</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Saved templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Advanced history</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Personal style customization</li>
              </ul>
            </div>
            <Link
              href="/checkout"
              className="w-full h-13 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-gray-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform hover:scale-102"
            >
              <span>Get Started Pro</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
