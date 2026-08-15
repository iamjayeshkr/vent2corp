"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/sections/TrustStrip";
import { HowItWorks } from "@/sections/HowItWorks";
import { ToneLabShowcase } from "@/sections/ToneLabShowcase";
import { ContextIntelligence } from "@/sections/ContextIntelligence";
import { UseCases } from "@/sections/UseCases";
import { Examples } from "@/sections/Examples";
import { Comparison } from "@/sections/Comparison";
import { StepFlow } from "@/sections/StepFlow";
import { PricingSection } from "@/sections/PricingSection";
import { CTA } from "@/sections/CTA";
import { Footer } from "@/sections/Footer";

import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AuthModal, type AuthUser } from "@/components/AuthModal";

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

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user: currentUser, login, loading: authLoading, logout: contextLogout } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined" || authLoading) return;
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthRequired = urlParams.get("auth") === "required";
    const nextUrl = urlParams.get("next");

    if (currentUser) {
      setAuthModalOpen(false);
      if (isAuthRequired) {
        const destination = nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//") ? nextUrl : "/dashboard";
        router.push(destination);
      }
    } else if (isAuthRequired) {
      setAuthModalOpen(true);
    }
  }, [currentUser, authLoading, router]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > div"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionItems = ".paper-object, .rant-note, .tone-rail-card, .scenario-rail-card, .example-card-rail-item, .step-flow-card, .platform-rail-card";
    const items: HTMLElement[] = [];

    sections.forEach((section) => {
      section.classList.add("landing-reveal");
      if (section.id === "hero") return;

      section.querySelectorAll<HTMLElement>(motionItems).forEach((item, index) => {
        item.classList.add("landing-item-reveal");
        item.style.setProperty("--landing-item-delay", `${Math.min(index, 5) * 70}ms`);
        items.push(item);
      });
    });
    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -4%" }
    );
    const itemObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          itemObserver.unobserve(entry.target);
        }
      }),
      { threshold: 0.2, rootMargin: "0px 0px -8%" }
    );
    sections.forEach((section) => observer.observe(section));
    items.forEach((item) => itemObserver.observe(item));
    return () => {
      observer.disconnect();
      itemObserver.disconnect();
    };
  }, []);

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
    login(token, user);
    setAuthModalOpen(false);
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
  };

  const handleLogout = () => {
    void contextLogout();
  };

  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans selection:bg-yellow-300 selection:text-gray-950">
      <Navigation
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="landing-main relative z-10 flex-1 space-y-12">
        <Hero onStartTranslating={handleStartTranslating} />
        <TrustStrip />
        <HowItWorks />
        <ToneLabShowcase />
        <ContextIntelligence />
        <UseCases />
        <Examples />
        <Comparison />
        <StepFlow />
        <PricingSection />
        <CTA />
      </main>

      <Footer user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

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
