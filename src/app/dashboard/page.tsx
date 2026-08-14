"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Translator } from "@/components/Translator";
import { RightPanel } from "@/components/translator/RightPanel";
import { ProBanner } from "@/components/upgrade/ProBanner";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import {
  getHistory,
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  getSettings,
  saveSettings,
  getFavorites,
} from "@/lib/storage";
import type {
  HistoryItem,
  TranslationResult,
  Tone,
  Recipient,
  Platform,
  Theme,
} from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");

  const [tone, setTone] = useState<Tone>("firm");
  const [recipient, setRecipient] = useState<Recipient>("manager");
  const [platform, setPlatform] = useState<Platform>("email");

  const [settings, setSettings] = useState({
    theme: "light" as Theme,
    defaultTone: "firm" as Tone,
    defaultRecipient: "manager" as Recipient,
    defaultPlatform: "email" as Platform,
  });

  useEffect(() => {
    queueMicrotask(async () => {
      setHistory(getHistory());
      setFavorites(getFavorites());
      const s = getSettings();
      setSettings(s);
      setTone(s.defaultTone || "firm");
      setRecipient(s.defaultRecipient || "manager");
      setPlatform(s.defaultPlatform || "email");

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
      t: Tone,
      r: Recipient,
      p: Platform
    ) => {
      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        original,
        translated: result.message,
        tone: t,
        recipient: r,
        platform: p,
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
      const el = document.getElementById("raw-thought-input");
      if (el) el.focus();
    }, 150);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setTone(item.tone);
    setRecipient(item.recipient);
    setPlatform(item.platform);
    const el = document.getElementById("raw-thought-input") as HTMLTextAreaElement;
    if (el) {
      el.value = item.original;
      el.focus();
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

  const toggleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Navigation */}
      <MobileNav
        user={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          historyCount={history.length}
          favoritesCount={favorites.length}
          user={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header
          user={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          theme={themeMode}
          onToggleTheme={toggleTheme}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Workspace (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <Translator
              defaultTone={settings.defaultTone}
              defaultRecipient={settings.defaultRecipient}
              defaultPlatform={settings.defaultPlatform}
              onTranslate={handleTranslate}
              onRequireAuth={() => setAuthModalOpen(true)}
              tone={tone}
              setTone={setTone}
              recipient={recipient}
              setRecipient={setRecipient}
              platform={platform}
              setPlatform={setPlatform}
            />

            <ProBanner onUpgrade={() => setAuthModalOpen(true)} />
          </div>

          {/* Right Utility Column (4 Columns) */}
          <div className="lg:col-span-4">
            <RightPanel
              tone={tone}
              setTone={setTone}
              recipient={recipient}
              setRecipient={setRecipient}
              platform={platform}
              setPlatform={setPlatform}
              onTranslate={() => {
                const el = document.getElementById("raw-thought-input");
                if (el) {
                  el.dispatchEvent(new Event("input", { bubbles: true }));
                  const btn = document.querySelector("button[type='button']") as HTMLButtonElement;
                  if (btn) btn.click();
                }
              }}
              loading={false}
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onViewAllHistory={() => router.push("/history")}
            />
          </div>
        </div>
      </div>

      {/* Modals & Global Search */}
      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <HistoryPanel open={historyOpen} onOpenChange={setHistoryOpen} history={history} onDelete={handleDeleteHistory} onReopen={handleReopenHistory} onClear={handleClearHistory} />
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} theme={settings.theme} defaultTone={settings.defaultTone} defaultRecipient={settings.defaultRecipient} defaultPlatform={settings.defaultPlatform} onUpdate={handleUpdateSettings} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}
