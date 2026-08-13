"use client";

import { useState, useEffect } from "react";
import { Menu, Moon, Sun, Settings, History, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export function Navigation({ onOpenHistory, onOpenSettings }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("vent2corp-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    queueMicrotask(() => {
      setIsDark(dark);
      if (dark) root.classList.add("dark");
      else root.classList.remove("dark");
    });
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("vent2corp-theme", newDark ? "dark" : "light");
    if (newDark) root.classList.add("dark");
    else root.classList.remove("dark");
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3 px-4 ${
        scrolled ? "top-2" : "top-0"
      }`}
    >
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/5 dark:shadow-emerald-500/5"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group text-base font-mono font-bold tracking-tight hover:opacity-80 transition-opacity"
          aria-label="Go to top"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 group-hover:scale-110 transition-transform">
            <Terminal className="w-4 h-4" />
          </div>
          <span>vent<span className="text-emerald-500">2corp</span></span>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 font-sans">
          <button
            onClick={() => scrollTo("translator")}
            className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            Translate
          </button>
          <button
            onClick={() => scrollTo("examples")}
            className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            Examples
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          >
            Features
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={onOpenSettings}
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-1 rounded-full h-8 w-8"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-8 w-8"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8 font-sans">
                <button
                  onClick={() => scrollTo("translator")}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  Translate
                </button>
                <button
                  onClick={() => scrollTo("examples")}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  Examples
                </button>
                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  How it works
                </button>
                <button
                  onClick={() => scrollTo("features")}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  Features
                </button>
                <div className="my-2 border-t border-border" />
                <button
                  onClick={() => {
                    onOpenHistory();
                    setMobileOpen(false);
                  }}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2.5 font-medium"
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setMobileOpen(false);
                  }}
                  className="text-left px-4 py-3 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2.5 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
