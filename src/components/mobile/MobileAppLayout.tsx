"use client";

import React, { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import type { Tone, HistoryItem } from "@/types";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav, type MobileTab } from "./MobileBottomNav";
import { MobileHomeScreen } from "./MobileHomeScreen";
import { MobileTranslateScreen } from "./MobileTranslateScreen";
import { MobileHistoryScreen } from "./MobileHistoryScreen";
import { MobileToneLabScreen } from "./MobileToneLabScreen";
import { MobileProfileScreen } from "./MobileProfileScreen";
import { registerBackButtonHandler } from "@/lib/mobile/capacitor";

interface MobileAppLayoutProps {
  onOpenAuth: () => void;
  onOpenCheckout: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteHistoryItem?: (id: string) => void;
  onSaveToHistory?: (item: { original: string; translated: string; tone: Tone; recipient: any; platform: any }) => void;
}

export function MobileAppLayout({
  onOpenAuth,
  onOpenCheckout,
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onSaveToHistory,
}: MobileAppLayoutProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  // Register Android Hardware Back Button Handler
  useEffect(() => {
    registerBackButtonHandler(() => {
      if (activeTab !== "home") {
        setActiveTab("home");
        return true; // Handled back navigation to home
      }
      return false; // Exit app
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#09090B] text-gray-950 dark:text-white flex flex-col font-sans select-none pb-20">
      {/* 1. Compact Mobile Header */}
      <MobileHeader activeTab={activeTab} onOpenCheckout={onOpenCheckout} />

      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-gray-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You're offline. Your saved messages & history are still here.</span>
        </div>
      )}

      {/* 2. Main Destination Screen */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {activeTab === "home" && (
          <MobileHomeScreen
            onStartVenting={() => setActiveTab("translate")}
            onSeeHowItWorks={() => setActiveTab("tone_lab")}
          />
        )}

        {activeTab === "translate" && (
          <MobileTranslateScreen
            onRequireAuth={onOpenAuth}
            onSaveToHistory={onSaveToHistory}
          />
        )}

        {activeTab === "history" && (
          <MobileHistoryScreen
            history={history}
            onSelectHistoryItem={(item) => {
              onSelectHistoryItem(item);
              setActiveTab("translate");
            }}
            onDeleteHistoryItem={onDeleteHistoryItem}
          />
        )}

        {activeTab === "tone_lab" && (
          <MobileToneLabScreen
            onSelectTone={(tone) => {
              setActiveTab("translate");
            }}
          />
        )}

        {activeTab === "profile" && (
          <MobileProfileScreen onOpenCheckout={onOpenCheckout} />
        )}
      </main>

      {/* 3. Fixed Bottom Navigation Bar with Elevated FAB */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
