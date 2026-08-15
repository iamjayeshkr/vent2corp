"use client";

import { Sun, Moon, Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import type { AuthUser } from "@/components/AuthModal";

interface HeaderProps {
  user?: AuthUser | null;
  onOpenAuth?: () => void;
  theme?: "light" | "dark" | "system";
  onToggleTheme?: () => void;
}

export function Header({ user, theme = "light", onToggleTheme }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name ? user.name.split(" ")[0] : "Rudra";

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 pt-2 select-none">
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          {getGreeting()}, {displayName} <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-sm text-muted-foreground font-sans">
          Turn your messy thoughts into clear, professional communication.
        </p>
      </div>

      {/* Top Right Actions */}
      <div className="flex items-center gap-3 self-end sm:self-center">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#141923] border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all shadow-sm"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-10 h-10 rounded-2xl bg-white dark:bg-[#141923] border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-500 border border-white dark:border-[#141923]" />
        </button>

        {/* Upgrade to Pro Button */}
        <Link
          href="/checkout"
          className="h-10 px-4 rounded-2xl bg-foreground text-background font-semibold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
        >
          <span>Upgrade to Pro</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </Link>
      </div>
    </header>
  );
}
