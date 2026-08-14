"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Examples } from "@/sections/Examples";
import { HowItWorks } from "@/sections/HowItWorks";
import { Features } from "@/sections/Features";
import { CTA } from "@/sections/CTA";
import { Footer } from "@/sections/Footer";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  getSettings,
  saveSettings,
} from "@/lib/storage";
import type {
  HistoryItem,
  Tone,
  Recipient,
  Platform,
  Theme,
} from "@/types";

export default function Home() {
  const router = useRouter();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState({
    theme: "system" as Theme,
    defaultTone: "professional" as Tone,
    defaultRecipient: "manager" as Recipient,
    defaultPlatform: "slack" as Platform,
  });

  useEffect(() => {
    queueMicrotask(async () => {
      setHistory(getHistory());
      const s = getSettings();
      setSettings(s);

      // Check query param for auth requirement
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("auth") === "required") {
          setAuthModalOpen(true);
        }
      }

      // Check stored session
      const token = localStorage.getItem("vent2corp_token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem("vent2corp_token");
            localStorage.removeItem("vent2corp_user");
          }
        } catch {
          // Keep offline state
        }
      }
    });
  }, []);

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
    if (currentUser) {
      router.push("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleUpdateSettings = useCallback(
    (updates: Partial<typeof settings>) => {
      const updated = { ...settings, ...updates };
      setSettings(updated);
      saveSettings(updates);
    },
    [settings]
  );

  const handleStartTranslating = () => {
    if (currentUser) {
      router.push("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (token: string, user: AuthUser) => {
    localStorage.setItem("vent2corp_token", token);
    localStorage.setItem("vent2corp_user", JSON.stringify(user));
    setCurrentUser(user);
    setAuthModalOpen(false);
    router.push("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("vent2corp_token");
    localStorage.removeItem("vent2corp_user");
    setCurrentUser(null);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-purple-500/20 selection:text-purple-600">
      {/* Interactive 3D WebGL Background */}
      <HeroCanvas />

      <Navigation
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="relative z-10 flex-1">
        <Hero onStartTranslating={handleStartTranslating} />
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

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
