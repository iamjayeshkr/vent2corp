"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";
import { AuthModal, type AuthUser } from "@/components/AuthModal";
import { Sparkles, Copy, Check, Shield, User, MessageSquare, Bookmark } from "lucide-react";
import { addHistoryItem, toggleFavorite, isFavorite } from "@/lib/storage";
import type { Tone, Recipient, Platform, TranslationResult } from "@/types";

function NewTranslationContent() {
  const searchParams = useSearchParams();

  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [recipient, setRecipient] = useState<Recipient>("manager");
  const [platform, setPlatform] = useState<Platform>("slack");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [currentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const rawParam = searchParams.get("raw");
      if (rawParam) {
        setInput(rawParam);
      }
    });
  }, [searchParams]);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const jwtToken = localStorage.getItem("vent2corp_token");
      const accessKey = localStorage.getItem("vent2corp-access-key") || "corporate2026";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-access-key": accessKey,
      };
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      const res = await fetch("/api/translate", {
        method: "POST",
        headers,
        body: JSON.stringify({ text: input, tone, recipient, platform }),
      });

      if (res.status === 401) {
        setAuthModalOpen(true);
        throw new Error("Authentication required. Please log in.");
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to translate.");
      }

      const data = (await res.json()) as TranslationResult;
      setResult(data);
      addHistoryItem({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        original: input.trim(),
        translated: data.message,
        tone,
        recipient,
        platform,
        timestamp: Date.now(),
      });
      setSaved(isFavorite(input.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.message) return;
    await navigator.clipboard.writeText(result.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFav = () => {
    if (!result?.message) return;
    const item = {
      id: `${Date.now()}`,
      original: input,
      translated: result.message,
      tone,
      recipient,
      platform,
      timestamp: Date.now(),
    };
    const nextSaved = toggleFavorite(item);
    setSaved(nextSaved);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased select-none">
      <MobileNav user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />
      <div className="hidden lg:block">
        <Sidebar user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} onOpenGlobalSearch={() => setGlobalSearchOpen(true)} />
      </div>

      <div className="flex-1 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header user={currentUser} onOpenAuth={() => setAuthModalOpen(true)} />

        {/* Focused Writing Tool Header */}
        <div className="space-y-1">
          <h2 className="text-3xl font-bold font-handwritten text-foreground tracking-wide">
            what&apos;s in your mind?
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            say it raw. we won&apos;t judge. (Distraction-Free Writing Mode)
          </p>
        </div>

        {/* Workspace Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-xl space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-pink-600 dark:text-pink-400 font-mono">
                Raw Input ({input.length}/2000)
              </span>
              {input && (
                <button
                  type="button"
                  onClick={() => { setInput(""); setResult(null); }}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type anything. seriously. we won't judge."
              className="w-full h-44 p-4 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40 text-sm font-sans font-medium text-foreground focus:outline-none focus:border-purple-400 transition-all resize-none"
              maxLength={2000}
            />
          </div>

          {/* Quick Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-purple-500" /> Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-muted/20 text-xs font-sans font-medium"
              >
                <option value="professional">Professional</option>
                <option value="polite">Polite</option>
                <option value="friendly">Friendly</option>
                <option value="firm">Firm</option>
                <option value="diplomatic">Diplomatic</option>
                <option value="passive-aggressive">Passive Aggressive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-500" /> Recipient
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value as Recipient)}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-muted/20 text-xs font-sans font-medium"
              >
                <option value="manager">Manager</option>
                <option value="client">Client</option>
                <option value="coworker">Coworker</option>
                <option value="junior">Junior</option>
                <option value="hr">HR Team</option>
                <option value="team">Whole Team</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" /> Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-muted/20 text-xs font-sans font-medium"
              >
                <option value="slack">Slack</option>
                <option value="email">Email</option>
                <option value="teams">Microsoft Teams</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading || !input.trim()}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Translating...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>✨ Translate Message</span>
              </>
            )}
          </button>

          {error && <p className="text-xs text-destructive text-center font-mono">{error}</p>}

          {/* Corporate Result Box */}
          {result && (
            <div className="p-6 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40 space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-handwritten text-foreground">
                  your corporate version
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFav}
                    className="p-1.5 rounded-xl bg-white/80 dark:bg-black/30 border border-emerald-200/80"
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600 text-emerald-600" : ""}`} />
                  </button>
                </div>
              </div>

              <p className="text-sm font-sans font-medium text-foreground whitespace-pre-wrap leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      </div>

      <GlobalSearchModal open={globalSearchOpen} onOpenChange={setGlobalSearchOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} onAuthSuccess={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function NewTranslationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-mono">Loading writing workspace...</div>}>
      <NewTranslationContent />
    </Suspense>
  );
}
