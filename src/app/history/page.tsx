"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Search, History, Copy, Check, Trash2, Bookmark, ArrowRight } from "lucide-react";
import { getHistory, deleteHistoryItem, toggleFavorite, isFavorite, clearHistory } from "@/lib/storage";
import type { HistoryItem } from "@/types";

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTone, setSelectedTone] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setHistoryItems(getHistory());
    });
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistoryItems(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setHistoryItems([]);
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFav = (item: HistoryItem) => {
    toggleFavorite(item);
    setHistoryItems([...getHistory()]);
  };

  const filtered = historyItems
    .filter((item) => {
      const matchesSearch =
        item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translated.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTone = selectedTone === "all" || item.tone === selectedTone;
      const matchesPlatform = selectedPlatform === "all" || item.platform === selectedPlatform;
      return matchesSearch && matchesTone && matchesPlatform;
    })
    .sort((a, b) => (sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased select-none">
      <MobileNav user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
      <div className="hidden lg:block">
        <Sidebar user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} onOpenGlobalSearch={() => setGlobalSearchOpen(true)} />
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold font-handwritten text-foreground tracking-wide flex items-center gap-2">
              <History className="w-6 h-6 text-purple-500" />
              your translation history
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              everything you&apos;ve turned from raw to send-ready.
            </p>
          </div>

          {historyItems.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold border border-red-500/20 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* Filters & Controls */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history messages..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-sans text-foreground focus:outline-none"
            />
          </div>

          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-sans text-foreground"
          >
            <option value="all">All Tones</option>
            <option value="professional">Professional</option>
            <option value="polite">Polite</option>
            <option value="firm">Firm</option>
            <option value="diplomatic">Diplomatic</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="h-10 px-3 rounded-xl bg-muted/20 border border-border/80 text-xs font-sans text-foreground"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
        </div>

        {/* History List Cards */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 text-center space-y-3">
            <History className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <h3 className="text-xl font-bold font-handwritten text-foreground">nothing here yet</h3>
            <p className="text-xs text-muted-foreground font-sans">
              Your translated messages will show up here as soon as you convert your raw thoughts.
            </p>
            <button
              type="button"
              onClick={() => router.push("/new")}
              className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition-all inline-flex items-center gap-2"
            >
              Start translating <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-md space-y-3 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span className="capitalize font-bold text-purple-600 dark:text-purple-400">
                    {item.tone} · {item.recipient} · {item.platform}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40 text-xs font-sans font-medium text-foreground">
                    <span className="text-[10px] font-mono text-pink-600 block mb-1">RAW</span>
                    {item.original}
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40 text-xs font-sans font-medium text-foreground">
                    <span className="text-[10px] font-mono text-emerald-600 block mb-1">CORPORATE</span>
                    {item.translated}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.translated)}
                    className="px-3 py-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 text-xs font-medium border border-border/80 flex items-center gap-1"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFav(item)}
                    className="p-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/80"
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite(item.original) ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}
