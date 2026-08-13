"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { Translator } from "@/components/Translator";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
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

export default function AppWorkspace() {
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

      const token = localStorage.getItem("vent2corp_token");
      if (!token) {
        router.push("/?auth=required");
        return;
      }

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
          router.push("/?auth=required");
        }
      } catch {
        router.push("/?auth=required");
      }
    });
  }, [router]);

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

  const handleAuthSuccess = (token: string, user: AuthUser) => {
    localStorage.setItem("vent2corp_token", token);
    localStorage.setItem("vent2corp_user", JSON.stringify(user));
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("vent2corp_token");
    localStorage.removeItem("vent2corp_user");
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* 3D WebGL Background */}
      <HeroCanvas />

      <Navigation
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="relative z-10 flex-1 pt-24">
        <Translator
          defaultTone={settings.defaultTone}
          defaultRecipient={settings.defaultRecipient}
          defaultPlatform={settings.defaultPlatform}
          onTranslate={handleTranslate}
          onRequireAuth={() => setAuthModalOpen(true)}
        />
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
