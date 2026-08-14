"use client";

import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { AuthUser } from "@/components/AuthModal";

interface MobileNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
}

export function MobileNav({
  activeTab,
  onTabChange,
  user,
  onOpenAuth,
  onLogout,
  onOpenSettings,
  onOpenHistory,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-[#0B0E14] text-white border-b border-[#1F2937] sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
          vent<span className="text-purple-400">2corp</span>
          <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/20" />
        </h1>
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-gray-800 text-gray-200 hover:text-white"
        aria-label="Toggle Navigation"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-50 flex">
          <div className="w-72 bg-[#0B0E14] h-full shadow-2xl overflow-y-auto animate-fade-in-up">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setOpen(false);
                if (onTabChange) onTabChange(tab);
              }}
              user={user}
              onOpenAuth={() => {
                setOpen(false);
                if (onOpenAuth) onOpenAuth();
              }}
              onLogout={() => {
                setOpen(false);
                if (onLogout) onLogout();
              }}
              onOpenSettings={() => {
                setOpen(false);
                if (onOpenSettings) onOpenSettings();
              }}
              onOpenHistory={() => {
                setOpen(false);
                if (onOpenHistory) onOpenHistory();
              }}
            />
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
