"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, History, Bookmark, Sliders, Settings, ArrowRight } from "lucide-react";
import { getHistory, getFavorites } from "@/lib/storage";

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  const historyItems = getHistory();
  const favoriteItems = getFavorites();

  const routes = [
    { title: "Dashboard - Main Workspace", path: "/dashboard", icon: Sparkles },
    { title: "New Translation - Writing Tool", path: "/new", icon: Sparkles },
    { title: "Examples - Transformation Gallery", path: "/examples", icon: Sparkles },
    { title: "History - Translated Messages", path: "/history", icon: History },
    { title: "Favorites - Saved Templates", path: "/favorites", icon: Bookmark },
    { title: "Tone Lab - Tone Playground", path: "/tone-lab", icon: Sliders },
    { title: "Analytics - Communication Habits", path: "/analytics", icon: Sparkles },
    { title: "Settings - Application Preferences", path: "/settings", icon: Settings },
  ];

  const filteredRoutes = routes.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredHistory = historyItems.filter(
    (h) =>
      h.original.toLowerCase().includes(query.toLowerCase()) ||
      h.translated.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    setQuery("");
    router.push(path);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4 select-none animate-fade-in-up">
      <div className="w-full max-w-xl bg-white dark:bg-[#141923] border border-border/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, history, favorites, settings..."
            className="w-full bg-transparent text-sm font-sans font-medium text-foreground focus:outline-none placeholder:text-muted-foreground"
          />
          <kbd className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/60">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Pages */}
          <div className="space-y-1">
            <div className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Pages & Tools
            </div>
            {filteredRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.path}
                  onClick={() => handleNavigate(route.path)}
                  className="px-3 py-2.5 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center justify-between transition-colors cursor-pointer text-xs font-medium text-foreground group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-purple-500" />
                    <span>{route.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              );
            })}
          </div>

          {/* History Match Snippets */}
          {query.trim() && filteredHistory.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Matching History ({filteredHistory.length})
              </div>
              {filteredHistory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(`/new?raw=${encodeURIComponent(item.original)}`)}
                  className="px-3 py-2 rounded-2xl hover:bg-muted/40 flex flex-col gap-0.5 cursor-pointer text-xs transition-colors"
                >
                  <div className="font-semibold text-foreground line-clamp-1">{item.original}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{item.translated}</div>
                </div>
              ))}
            </div>
          )}

          {/* Favorites Count Badge */}
          {!query.trim() && favoriteItems.length > 0 && (
            <div
              onClick={() => handleNavigate("/favorites")}
              className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-between cursor-pointer hover:bg-amber-500/20 transition-all"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
                You have {favoriteItems.length} saved corporate favorites.
              </span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
