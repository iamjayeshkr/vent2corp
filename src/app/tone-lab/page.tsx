"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Sliders, Sparkles, Copy, Check, ArrowRight, Shield, Heart, Smile, Flame, Eye, AlertTriangle } from "lucide-react";
import type { Tone } from "@/types";

interface ToneCardData {
  tone: Tone;
  name: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  raw: string;
  result: string;
}

const TONES_LAB_DATA: ToneCardData[] = [
  {
    tone: "professional",
    name: "Professional",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Shield,
    description: "Standard corporate tone suitable for executives, status updates, and formal documentation.",
    raw: "bhai ye kaam aaj nahi ho payega, bahut load hai",
    result: "Due to current workload constraints, I will not be able to complete this task today. I will provide a revised timeline first thing tomorrow.",
  },
  {
    tone: "polite",
    name: "Polite",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Heart,
    description: "Gentle, considerate, and warm while maintaining workplace etiquette.",
    raw: "ye requirement samajh nahi aayi phir se batao",
    result: "Could you kindly clarify the specific requirement details once more? I want to ensure we are completely aligned before implementation.",
  },
  {
    tone: "friendly",
    name: "Friendly",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Smile,
    description: "Casual, collaborative tone best for trusted peers, Slack messages, and internal team check-ins.",
    raw: "jaldi kar de na bro, demo kal subah hai",
    result: "Hey! Mind pushing this update over as soon as you can? We've got the client demo coming up tomorrow morning!",
  },
  {
    tone: "firm",
    name: "Firm",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    icon: Flame,
    description: "Direct and unyielding. Establishes hard boundaries without profanity or rudeness.",
    raw: "bhai roz nayi requirement kyu aa rahi hai, pehle wali poori karo",
    result: "We need to freeze the current requirement scope and finish existing deliverables before introducing any new features.",
  },
  {
    tone: "diplomatic",
    name: "Diplomatic",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Eye,
    description: "Tactful and politically refined. Navigates disagreements while protecting cross-team relationships.",
    raw: "bhai ye kaam galat hai aisa nahi hota",
    result: "I wanted to highlight a potential discrepancy in our current implementation approach. Let's align on alternative methodologies.",
  },
  {
    tone: "passive-aggressive",
    name: "Passive Aggressive",
    badgeColor: "bg-orange-100 text-orange-700 border-orange-200",
    icon: AlertTriangle,
    description: "Politely pointed. Highlights delays or missed commitments with subtle corporate sarcasm.",
    raw: "phir se wahi mistake ki tumne",
    result: "Per my previous email, I noticed this issue recurred. Re-attaching the original process documentation for reference.",
  },
];

export default function ToneLabPage() {
  const router = useRouter();
  const [testInput, setTestInput] = useState("bhai ye kaam aaj nahi ho payega");
  const [selectedTone, setSelectedTone] = useState<Tone>("firm");
  const [copiedTone, setCopiedTone] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const handleCopy = async (toneName: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTone(toneName);
    setTimeout(() => setCopiedTone(null), 2000);
  };

  const handleTryTone = (rawText: string) => {
    router.push(`/new?raw=${encodeURIComponent(rawText)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased select-none">
      <MobileNav user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
      <div className="hidden lg:block">
        <Sidebar user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} onOpenGlobalSearch={() => setGlobalSearchOpen(true)} />
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-handwritten text-foreground tracking-wide flex items-center gap-2">
            <Sliders className="w-6 h-6 text-purple-500" />
            tone lab
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            same thought. completely different delivery.
          </p>
        </div>

        {/* Interactive Tone Comparison Tool Top Box */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-lg space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 fill-purple-500/20" />
              Interactive Tone Comparison Tool
            </h3>
            <span className="text-xs font-mono text-muted-foreground">Select tone to test</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Test Raw Input
              </label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-muted/20 border border-border/80 text-xs font-sans font-medium text-foreground focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Selected Tone Mode
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value as Tone)}
                className="w-full h-11 px-4 rounded-xl bg-muted/20 border border-border/80 text-xs font-sans font-medium text-foreground capitalize"
              >
                <option value="professional">Professional</option>
                <option value="polite">Polite</option>
                <option value="friendly">Friendly</option>
                <option value="firm">Firm</option>
                <option value="diplomatic">Diplomatic</option>
                <option value="passive-aggressive">Passive Aggressive</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleTryTone(testInput)}
            className="w-full h-11 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-900/30 transition-all"
          >
            <span>Test Output in Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Visual Tone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TONES_LAB_DATA.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.tone}
                className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-md space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-bold text-foreground">{t.name}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.badgeColor}`}>
                      {t.tone}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {t.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40">
                    <span className="text-[10px] font-mono text-pink-600 block mb-1">RAW</span>
                    <p className="text-xs font-sans font-medium text-foreground italic">&ldquo;{t.raw}&rdquo;</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40">
                    <span className="text-[10px] font-mono text-emerald-600 block mb-1">CORPORATE RESULT</span>
                    <p className="text-xs font-sans font-medium text-foreground leading-relaxed">{t.result}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => handleTryTone(t.raw)}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    Try this tone <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(t.name, t.result)}
                    className="px-3 py-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 text-xs font-medium text-foreground border border-border/80 flex items-center gap-1"
                  >
                    {copiedTone === t.name ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedTone === t.name ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}
