"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DoodleArrow, DoodleCrown, DoodleScribble } from "@/components/ui/Doodles";
import type { AuthUser } from "@/components/AuthModal";

interface NavigationProps {
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
  onOpenAuth: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export function Navigation({
  onOpenAuth,
  user,
  onLogout,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const requireAuthForModule = (event: MouseEvent<HTMLAnchorElement>) => {
    if (user) return;
    event.preventDefault();
    setMobileOpen(false);
    onOpenAuth();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3.5 px-4 sm:px-8 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs py-3" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="relative flex flex-col group text-left md:pr-8">
          <div className="text-xl sm:text-2xl font-black font-sans tracking-tight text-gray-950">
            vent<span className="text-[#2563EB]">2</span>corp
          </div>
          <span className="hidden sm:block text-[11px] font-medium text-gray-400 font-sans -mt-1 tracking-tight">
            say it raw, send it right.
          </span>
          <DoodleCrown className="absolute left-2 -top-4 hidden h-6 w-7 text-[#D4A017] md:block" rotation={-5} />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-800 font-sans">
          <button type="button" onClick={() => scrollTo("features")} className="hover:text-[#2563EB] transition-colors">
            Features
          </button>
          <Link href="/examples" onClick={requireAuthForModule} className="hover:text-[#2563EB] transition-colors">
            Examples
          </Link>
          <Link href="/tone-lab" onClick={requireAuthForModule} className="hover:text-[#2563EB] transition-colors">
            Tone Lab
          </Link>
          <button type="button" onClick={() => scrollTo("how-it-works")} className="hover:text-[#2563EB] transition-colors">
            How it works
          </button>
          <button type="button" onClick={() => scrollTo("pricing")} className="hover:text-[#2563EB] transition-colors">
            Pricing
          </button>
          <Link href="/analytics" className="hover:text-[#2563EB] transition-colors">
            Blog
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3 font-sans">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="h-10 px-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-gray-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="h-10 px-4 rounded-xl border border-gray-950 hover:bg-gray-100 text-xs font-bold text-gray-950 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenAuth}
                className="h-10 px-5 rounded-xl border-2 border-gray-950 hover:bg-gray-100 text-xs font-extrabold text-gray-950 transition-colors"
              >
                Login
              </button>

              <Link
                href="/new"
                className="h-10 px-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-gray-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102"
              >
                <span>Start venting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Drawer */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button type="button" className="mobile-menu-trigger" aria-label="Open menu">
                  <span>menu</span>
                  <Menu className="w-4 h-4" strokeWidth={2.8} />
                </button>
              }
            />
            <SheetContent side="right" className="mobile-navigation-drawer w-full max-w-none border-0 bg-[#fffefa] p-7 sm:w-[26rem]" showCloseButton>
              <DoodleCrown className="absolute left-10 top-[4.2rem] h-7 w-9 text-[#D4A017]" rotation={-5} />
              <DoodleScribble className="absolute right-12 top-24 h-6 w-16 text-pink-500" rotation={-5} />
              <div className="mt-12 flex items-center gap-2 border-b-2 border-gray-950 pb-6 font-sans">
                <span className="text-2xl font-black tracking-tight">vent<span className="text-[#2563EB]">2</span>corp</span>
                <DoodleArrow className="h-5 w-8 text-[#2563EB]" rotation={-15} />
              </div>
              <div className="flex flex-col gap-1 pt-6 font-sans">
                <button type="button" onClick={() => scrollTo("features")} className="mobile-drawer-link text-left">Features</button>
                <Link href="/examples" onClick={(event) => { setMobileOpen(false); requireAuthForModule(event); }} className="text-sm font-bold text-gray-950">
                  Examples
                </Link>
                <Link href="/tone-lab" onClick={(event) => { setMobileOpen(false); requireAuthForModule(event); }} className="text-sm font-bold text-gray-950">
                  Tone Lab
                </Link>
                <button type="button" onClick={() => scrollTo("how-it-works")} className="text-left text-sm font-bold text-gray-950">
                  How it works
                </button>
                <button type="button" onClick={() => scrollTo("pricing")} className="text-left text-sm font-bold text-gray-950">
                  Pricing
                </button>
                <div className="my-2 border-t border-gray-200" />
                {user ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="mobile-drawer-link">Dashboard</Link>
                ) : (
                  <button type="button" onClick={() => { onOpenAuth(); setMobileOpen(false); }} className="mobile-drawer-link text-left">Login</button>
                )}
                <Link
                  href="/new"
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 w-full h-13 rounded-xl bg-[#FACC15] text-gray-950 font-extrabold text-sm flex items-center justify-center gap-2 border-2 border-gray-950 shadow-[4px_4px_0_#18181b]"
                >
                  <span>Start venting</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
