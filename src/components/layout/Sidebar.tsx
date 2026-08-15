"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  History,
  Bookmark,
  Sliders,
  BarChart3,
  Settings,
  Plus,
  Rocket,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";
import type { AuthUser } from "@/components/AuthModal";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  historyCount?: number;
  favoritesCount?: number;
  user?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
}

export function Sidebar({
  historyCount = 0,
  favoritesCount = 0,
  user,
  onOpenAuth,
  onLogout,
  onOpenGlobalSearch,
}: SidebarProps) {
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { id: "examples", label: "Examples", href: "/examples", icon: Sparkles },
    { id: "history", label: "History", href: "/history", icon: History, badge: historyCount },
    { id: "favorites", label: "Favorites", href: "/favorites", icon: Bookmark, badge: favoritesCount },
    { id: "tonelab", label: "Tone Lab", href: "/tone-lab", icon: Sliders },
    { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ];

  const displayName = user?.name || "Rudra";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-64 bg-[#0B0E14] text-[#F9FAFB] flex flex-col justify-between h-screen sticky top-0 border-r border-[#1F2937]/60 p-5 select-none z-30">
      {/* Top Header & Logo */}
      <div className="space-y-5">
        <div className="flex flex-col gap-1 px-2 pt-1">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
              vent<span className="text-purple-400">2corp</span>
              <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/20 group-hover:rotate-12 transition-transform" />
            </h1>
          </Link>
          <p className="text-[11px] text-gray-400 font-medium font-sans">
            say it raw, send it right.
          </p>
        </div>

        {/* New Translation CTA */}
        <Link
          href="/new"
          className="w-full h-11 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Translation</span>
        </Link>

        {/* Quick Search Shortcut Trigger */}
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          className="w-full h-9 px-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-400 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            Search...
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] font-mono text-gray-400 border border-gray-700">
            ⌘K
          </kbd>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full h-10 px-3.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all duration-150 ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30 shadow-sm shadow-purple-900/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-purple-500/40 text-purple-200" : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-3 border-t border-[#1F2937]/50">
        {/* Go Pro Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-indigo-950/20 border border-purple-800/30 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              Go Pro <Rocket className="w-3.5 h-3.5 text-purple-400" />
            </span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            Unlock unlimited translations, custom tones, templates and more.
          </p>
          <Link
            href="/checkout"
            className="flex h-8 w-full items-center justify-center rounded-xl bg-purple-600 text-xs font-medium text-white shadow-md shadow-purple-900/40 transition-colors hover:bg-purple-500"
          >
            Upgrade Now
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (user) setProfileDropdownOpen(!profileDropdownOpen);
              else if (onOpenAuth) onOpenAuth();
            }}
            className="w-full p-2.5 rounded-xl bg-[#141923] hover:bg-[#1C2333] border border-[#1F2937]/80 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {avatarLetter}
              </div>
              <div className="text-left leading-none">
                <div className="text-xs font-semibold text-gray-200">{displayName}</div>
                <div className="text-[10px] text-purple-400 mt-1 font-sans">
                  {user ? "Free Plan" : "Sign In / Register"}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {profileDropdownOpen && user && (
            <div className="absolute bottom-14 left-0 w-full p-1.5 bg-[#141923] border border-gray-800 rounded-xl shadow-2xl space-y-1 z-50 animate-fade-in-up">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
