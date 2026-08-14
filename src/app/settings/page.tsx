"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Settings, User, Shield, Command, Lock, Check, Sparkles } from "lucide-react";
import { getSettings, saveSettings, clearHistory } from "@/lib/storage";
import type { Tone, Recipient, Platform, Theme } from "@/types";

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState<Theme>("light");
  const [defaultTone, setDefaultTone] = useState<Tone>("firm");
  const [defaultRecipient, setDefaultRecipient] = useState<Recipient>("manager");
  const [defaultPlatform, setDefaultPlatform] = useState<Platform>("email");
  const [casualOption, setCasualOption] = useState(true);
  const [strongLanguage, setStrongLanguage] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const s = getSettings();
      setThemeMode(s.theme || "light");
      setDefaultTone(s.defaultTone || "firm");
      setDefaultRecipient(s.defaultRecipient || "manager");
      setDefaultPlatform(s.defaultPlatform || "email");
    });
  }, []);

  const handleSave = () => {
    saveSettings({
      theme: themeMode,
      defaultTone,
      defaultRecipient,
      defaultPlatform,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased select-none">
      <MobileNav user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
      <div className="hidden lg:block">
        <Sidebar user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} onOpenGlobalSearch={() => setGlobalSearchOpen(true)} />
      </div>

      <div className="flex-1 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold font-handwritten text-foreground tracking-wide flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-500" />
              settings
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              make vent2corp work the way you like.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            {savedSuccess ? "Saved!" : "Save Preferences"}
          </button>
        </div>

        {/* Grouped Settings Cards */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" /> Profile & Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Display Name</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.name || "Rudra"}
                  className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-foreground font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Work Email</label>
                <input
                  type="email"
                  readOnly
                  value={currentUser?.email || "rudra@company.com"}
                  className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-foreground font-medium"
                />
              </div>
            </div>
          </div>

          {/* Translation Preferences Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" /> Translation Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Default Tone</label>
                <select
                  value={defaultTone}
                  onChange={(e) => setDefaultTone(e.target.value as Tone)}
                  className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-foreground font-medium"
                >
                  <option value="professional">Professional</option>
                  <option value="polite">Polite</option>
                  <option value="friendly">Friendly</option>
                  <option value="firm">Firm</option>
                  <option value="diplomatic">Diplomatic</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Default Recipient</label>
                <select
                  value={defaultRecipient}
                  onChange={(e) => setDefaultRecipient(e.target.value as Recipient)}
                  className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-foreground font-medium"
                >
                  <option value="manager">Manager</option>
                  <option value="client">Client</option>
                  <option value="coworker">Coworker</option>
                  <option value="hr">HR Team</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Default Platform</label>
                <select
                  value={defaultPlatform}
                  onChange={(e) => setDefaultPlatform(e.target.value as Platform)}
                  className="w-full h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-foreground font-medium"
                >
                  <option value="slack">Slack</option>
                  <option value="email">Email</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Intelligence Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> AI Intelligence Controls
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/60 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-foreground">Preserve Casual Fact Nuances</div>
                  <div className="text-[11px] text-muted-foreground">Keep Hinglish dates and technical terms intact in output</div>
                </div>
                <input
                  type="checkbox"
                  checked={casualOption}
                  onChange={(e) => setCasualOption(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/60 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-foreground">Filter Raw Profanity Inputs</div>
                  <div className="text-[11px] text-muted-foreground">Automatically audit profanity removal in generated corporate text</div>
                </div>
                <input
                  type="checkbox"
                  checked={strongLanguage}
                  onChange={(e) => setStrongLanguage(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Command className="w-4 h-4 text-purple-500" /> Keyboard Shortcuts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-muted-foreground">Translate Message</span>
                <kbd className="px-2 py-0.5 rounded bg-muted text-[10px] border">Enter</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-muted-foreground">New Line in Input</span>
                <kbd className="px-2 py-0.5 rounded bg-muted text-[10px] border">Shift + Enter</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-muted-foreground">Global Search</span>
                <kbd className="px-2 py-0.5 rounded bg-muted text-[10px] border">⌘ / Ctrl + K</kbd>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                <span className="text-muted-foreground">Close Search</span>
                <kbd className="px-2 py-0.5 rounded bg-muted text-[10px] border">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Privacy & Danger Zone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-red-500/30 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Privacy & Local Data
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Clear all local translation history and saved favorites</span>
              <button
                type="button"
                onClick={() => { clearHistory(); alert("Local history cleared."); }}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold border border-red-500/20"
              >
                Clear Local Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}
