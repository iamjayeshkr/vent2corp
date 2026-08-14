"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Bookmark, Copy, Check, ArrowRight, Trash2, Sparkles } from "lucide-react";
import { getFavorites, toggleFavorite } from "@/lib/storage";
import type { HistoryItem } from "@/types";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setFavorites(getFavorites());
    });
  }, []);

  const handleRemove = (item: HistoryItem) => {
    toggleFavorite(item);
    setFavorites(getFavorites());
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReuse = (raw: string) => {
    router.push(`/new?raw=${encodeURIComponent(raw)}`);
  };

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
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
            your favorites ⭐
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            the messages worth keeping around as reusable templates.
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <h3 className="text-xl font-bold font-handwritten text-foreground">save something useful</h3>
            <p className="text-xs text-muted-foreground font-sans">
              Favorite a translation and it&apos;ll live here forever as a quick workplace template.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-amber-400/40 shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 capitalize">
                      {item.tone} · {item.recipient} · {item.platform}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40">
                    <span className="text-[10px] font-mono text-pink-600 block mb-1">RAW</span>
                    <p className="text-xs font-sans font-medium text-foreground italic">&ldquo;{item.original}&rdquo;</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40">
                    <span className="text-[10px] font-mono text-emerald-600 block mb-1">CORPORATE</span>
                    <p className="text-xs font-sans font-medium text-foreground leading-relaxed">{item.translated}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => handleReuse(item.original)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    Use Template
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.translated)}
                      className="px-3 py-1.5 rounded-xl bg-muted/30 hover:bg-muted/60 text-xs font-medium text-foreground border border-border/80 flex items-center gap-1"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === item.id ? "Copied" : "Copy"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
