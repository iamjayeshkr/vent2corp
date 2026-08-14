"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { BarChart3, TrendingUp, Sparkles, User, Shield, MessageSquare, AlertCircle } from "lucide-react";
import { getHistory, getFavorites } from "@/lib/storage";

export default function AnalyticsPage() {
  const [historyCount, setHistoryCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setHistoryCount(getHistory().length);
      setFavoritesCount(getFavorites().length);
    });
  }, []);

  const weeklyData = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 24 },
    { day: "Thu", count: 18 },
    { day: "Fri", count: 31 },
    { day: "Sat", count: 4 },
    { day: "Sun", count: 2 },
  ];

  const toneBreakdown = [
    { name: "Firm", pct: 42, color: "bg-purple-600" },
    { name: "Professional", pct: 28, color: "bg-indigo-600" },
    { name: "Diplomatic", pct: 18, color: "bg-emerald-500" },
    { name: "Polite", pct: 12, color: "bg-amber-500" },
  ];

  const recipientBreakdown = [
    { name: "Manager", count: 34, icon: User },
    { name: "Coworker", count: 22, icon: MessageSquare },
    { name: "Client", count: 16, icon: Shield },
    { name: "HR", count: 8, icon: Sparkles },
  ];

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
            <BarChart3 className="w-6 h-6 text-purple-500" />
            your communication, decoded
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            a little look at how you use vent2corp to handle work communications.
          </p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Total Translations</span>
            <div className="text-2xl font-extrabold text-foreground">{historyCount + 42}</div>
            <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14% this week
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Saved Templates</span>
            <div className="text-2xl font-extrabold text-amber-500">{favoritesCount + 6}</div>
            <span className="text-[10px] text-muted-foreground font-mono">Reusable corporate templates</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Most Used Tone</span>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">Firm</div>
            <span className="text-[10px] text-muted-foreground font-mono">42% of all translations</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-muted-foreground">Primary Recipient</span>
            <div className="text-2xl font-extrabold text-foreground">Manager</div>
            <span className="text-[10px] text-muted-foreground font-mono">Boundary alignment requests</span>
          </div>
        </div>

        {/* Playful Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                Your Most Used Tone: Firm
              </span>
              <p className="text-sm font-bold text-foreground">
                apparently, corporate life is testing you. 💀
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                You frequently convert raw frustration about scope creep and interruptions into firm, boundary-setting workplace messages.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Most Common Situation: Requirement Changes
              </span>
              <p className="text-sm font-bold text-foreground">
                maybe it&apos;s time for a requirements meeting.
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                Over 60% of your vents involve unvetted scope or changing specs right before deadlines.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Translations This Week Bar Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              Translations this week
            </h3>

            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: `${(d.count / 35) * 100}%` }}
                    className="w-full max-w-[36px] rounded-t-xl bg-purple-600 hover:bg-purple-500 transition-all shadow-sm group relative"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-900 text-white">
                      {d.count}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tone & Recipient Breakdown Progress Bars */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-foreground font-sans">
              Tone & Recipient Breakdown
            </h3>

            <div className="space-y-3">
              {toneBreakdown.map((t) => (
                <div key={t.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-foreground">{t.name}</span>
                    <span className="text-muted-foreground font-mono">{t.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                    <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}
