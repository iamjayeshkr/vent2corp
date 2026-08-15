"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MobileAppLayout } from "@/components/mobile/MobileAppLayout";

export default function DashboardPage() {
  const router = useRouter();
  const { user: currentUser, login, logout: contextLogout } = useAuth();
  const executeTranslateRef = useRef<(() => void) | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");
  const [loading, setLoading] = useState(false);

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
    queueMicrotask(() => {
      setHistory(getHistory());
      setFavorites(getFavorites());
      const s = getSettings();
      setSettings(s);
      setTone(s.defaultTone || "firm");
      setRecipient(s.defaultRecipient || "manager");
      setPlatform(s.defaultPlatform || "email");
    });
  }, []);

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

  const handleReopenHistory = () => {
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
    login(token, user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    void contextLogout();
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

  const handleBindTrigger = useCallback((fn: () => void) => {
    executeTranslateRef.current = fn;
  }, []);

  return (
    <ProtectedRoute>
      {/* Mobile-First App Layout for Mobile Viewports & Native Capacitor */}
      <div className="block lg:hidden">
        <MobileAppLayout
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenCheckout={() => router.push("/checkout")}
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onDeleteHistoryItem={handleDeleteHistory}
          onSaveToHistory={(item) => {
            const newItem = {
              id: Date.now().toString(),
              ...item,
              timestamp: Date.now(),
            };
            setHistory((prev) => [newItem, ...prev]);
          }}
        />
      </div>

      {/* Desktop Multi-Column Layout */}
      <div className="hidden lg:flex min-h-screen bg-background text-foreground flex-col lg:flex-row antialiased">
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
                onBindTrigger={handleBindTrigger}
                onLoadingChange={setLoading}
              />

              <ProBanner onUpgrade={() => router.push("/checkout")} />
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
                  if (executeTranslateRef.current) {
                    executeTranslateRef.current();
                  } else {
                    const centerBtn = document.getElementById("center-translate-btn");
                    if (centerBtn) centerBtn.click();
                  }
                }}
                loading={loading}
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
    </ProtectedRoute>
  );
}
