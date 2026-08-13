"use client";

import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { Translator } from "@/components/Translator";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Examples } from "@/sections/Examples";
import { HowItWorks } from "@/sections/HowItWorks";
import { Features } from "@/sections/Features";
import { CTA } from "@/sections/CTA";
import { Footer } from "@/sections/Footer";
import {
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  getSettings,
  saveSettings,
} from "@/lib/storage";
import type {
  HistoryItem,
  TranslationResult,
  Tone,
  Recipient,
  Platform,
  Theme,
} from "@/types";

export default function Home() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState({
    theme: "system" as Theme,
    defaultTone: "professional" as Tone,
    defaultRecipient: "manager" as Recipient,
    defaultPlatform: "slack" as Platform,
  });

  useEffect(() => {
    queueMicrotask(() => {
      setHistory(getHistory());
      const s = getSettings();
      setSettings(s);
    });
  }, []);

  const handleTranslate = useCallback(
    (
      original: string,
      result: TranslationResult,
      tone: Tone,
      recipient: Recipient,
      platform: Platform
    ) => {
      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        original,
        translated: result.message,
        tone,
        recipient,
        platform,
        timestamp: Date.now(),
      };
      addHistoryItem(item);
      setHistory((prev) => [item, ...prev].slice(0, 50));
    },
    []
  );

  const handleDeleteHistory = (id: string) => {
    deleteHistoryItem(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleReopenHistory = (_item: HistoryItem) => {
    setHistoryOpen(false);
    setTimeout(() => {
      const el = document.getElementById("translator");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleUpdateSettings = useCallback(
    (updates: Partial<typeof settings>) => {
      const updated = { ...settings, ...updates };
      setSettings(updated);
      saveSettings(updates);
    },
    [settings]
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Interactive 3D WebGL Background */}
      <HeroCanvas />

      <Navigation
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="relative z-10 flex-1">
        <Hero />
        <Translator
          defaultTone={settings.defaultTone}
          defaultRecipient={settings.defaultRecipient}
          defaultPlatform={settings.defaultPlatform}
          onTranslate={handleTranslate}
        />
        <Examples />
        <HowItWorks />
        <Features />
        <CTA />
      </main>

      <Footer />

      <HistoryPanel
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        onDelete={handleDeleteHistory}
        onReopen={handleReopenHistory}
        onClear={handleClearHistory}
      />

      <SettingsPanel
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={settings.theme}
        defaultTone={settings.defaultTone}
        defaultRecipient={settings.defaultRecipient}
        defaultPlatform={settings.defaultPlatform}
        onUpdate={handleUpdateSettings}
      />
    </div>
  );
}
