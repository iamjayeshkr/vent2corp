"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Trash2, Star, ChevronRight, Clock, Sparkles, Flame } from "lucide-react";
import type { HistoryItem, Tone } from "@/types";
import { triggerHaptic } from "@/lib/mobile/capacitor";

interface MobileHistoryScreenProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteHistoryItem?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function MobileHistoryScreen({
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onToggleFavorite,
}: MobileHistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterTone, setSelectedFilterTone] = useState<Tone | "all">("all");

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.translated.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTone = selectedFilterTone === "all" || item.tone === selectedFilterTone;
      return matchesSearch && matchesTone;
    });
  }, [history, searchQuery, selectedFilterTone]);

  // Group history items by timeline
  const groupedHistory = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const today: HistoryItem[] = [];
    const yesterday: HistoryItem[] = [];
    const thisWeek: HistoryItem[] = [];
    const older: HistoryItem[] = [];

    filteredHistory.forEach((item) => {
      const diff = now - item.timestamp;
      if (diff < oneDay) {
        today.push(item);
      } else if (diff < 2 * oneDay) {
        yesterday.push(item);
      } else if (diff < 7 * oneDay) {
        thisWeek.push(item);
      } else {
        older.push(item);
      }
    });

    return { today, yesterday, thisWeek, older };
  }, [filteredHistory]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderHistoryGroup = (title: string, items: HistoryItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-1">
          {title} ({items.length})
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                void triggerHaptic("light");
                onSelectHistoryItem(item);
              }}
              className="p-4 rounded-2xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 shadow-[3px_3px_0_#18181b] dark:shadow-none space-y-2 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-pink-100 dark:bg-pink-950/80 border border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400">
                    {formatTime(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase">
                    {item.tone}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="text-xs font-bold text-gray-950 dark:text-white line-clamp-1">
                {item.original}
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-300 font-sans line-clamp-2 border-l-2 border-emerald-500 pl-2">
                {item.translated}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/80 text-[10px] font-mono text-gray-500">
                <span className="capitalize">To: {item.recipient} ({item.platform})</span>
                {onDeleteHistoryItem && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void triggerHaptic("medium");
                      onDeleteHistoryItem(item.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-6 select-none font-sans">
      {/* Title & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display text-gray-950 dark:text-white">Your Vents</h2>
          <span className="text-xs font-mono text-gray-500 font-bold">{history.length} saved</span>
        </div>

        {/* Search Field */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your vents..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 text-xs font-sans text-gray-950 dark:text-white placeholder:text-gray-400 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#141923] border-2 border-gray-950 dark:border-gray-800 rounded-3xl space-y-2">
          <Clock className="w-8 h-8 text-gray-400 mx-auto" />
          <h4 className="text-xs font-mono font-bold text-gray-950 dark:text-white uppercase">No vents found</h4>
          <p className="text-xs text-gray-500 font-sans">Your workplace vent translations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {renderHistoryGroup("Today", groupedHistory.today)}
          {renderHistoryGroup("Yesterday", groupedHistory.yesterday)}
          {renderHistoryGroup("This Week", groupedHistory.thisWeek)}
          {renderHistoryGroup("Older", groupedHistory.older)}
        </div>
      )}
    </div>
  );
}
