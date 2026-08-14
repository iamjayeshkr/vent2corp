"use client";

import { useState, useCallback } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Scissors,
  Briefcase,
  ArrowRight,
  Sparkles,
  Info,
  Bookmark,
  Zap,
  Star,
  Target,
  Smile,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { Tone, Recipient, Platform, TranslationResult } from "@/types";

interface TranslatorProps {
  defaultTone: Tone;
  defaultRecipient: Recipient;
  defaultPlatform: Platform;
  onTranslate: (
    original: string,
    result: TranslationResult,
    tone: Tone,
    recipient: Recipient,
    platform: Platform
  ) => void;
  onRequireAuth?: () => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  recipient: Recipient;
  setRecipient: (r: Recipient) => void;
  platform: Platform;
  setPlatform: (p: Platform) => void;
}

const SAMPLE_PROMPTS = [
  "abe chutiya hai kya?? kuch bhi requiement bhej raha hai soch toh le ek baar",
  "jaldi kar bhai client sar pe khada hai",
  "kya bakwas kaam bana ke bheja hai",
  "mujhe ek hafte ki leave chahiye emergency hai",
];

export function Translator({
  onTranslate,
  onRequireAuth,
  tone,
  recipient,
  platform,
}: TranslatorProps) {
  const [input, setInput] = useState(
    "tera marad hun kya saale jab dekho tab bula leta hai kuch bhi hua jayesh yeh dekhna bc itni toh biwi ko nhi khojta jitna mujhe bulata hai bsdk sudhar ja daily naya requirement yeh nayi woh nhi hua gand mein ghus ja bsdk"
  );
  const [result, setResult] = useState<TranslationResult | null>({
    message:
      "I've noticed that I'm being contacted frequently throughout the day for various updates, while new requirements are being introduced regularly. This is making it difficult to stay focused on the current work and maintain a stable implementation scope. Could we please align on the priorities and finalize the current requirements so I can work through them more efficiently?",
    tone: "firm",
    intent: "Boundary & scope alignment",
    emotion: "Overwhelmed",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExecuteTranslate = useCallback(async () => {
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
        if (onRequireAuth) onRequireAuth();
        throw new Error("Authentication required. Please sign in or create an account.");
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      const data = (await res.json()) as TranslationResult;
      setResult(data);
      onTranslate(input.trim(), data, tone, recipient, platform);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Give it another shot.");
    } finally {
      setLoading(false);
    }
  }, [input, tone, recipient, platform, onTranslate, onRequireAuth]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) handleExecuteTranslate();
    }
  };

  const handleCopy = async () => {
    if (!result?.message) return;
    await navigator.clipboard.writeText(result.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = async (action: "regenerate" | "shorter" | "more-professional" | "more-direct" | "softer") => {
    if (!input.trim() || !result?.message) return;
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
        body: JSON.stringify({
          text: input,
          tone,
          recipient,
          platform,
          action,
          previousOutput: result.message,
        }),
      });
      if (res.status === 401) {
        if (onRequireAuth) onRequireAuth();
        throw new Error("Authentication required. Please sign in or create an account.");
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      const data = (await res.json()) as TranslationResult;
      setResult(data);
      onTranslate(input.trim(), data, tone, recipient, platform);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Give it another shot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Sample Prompts Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Try:
        </span>
        {SAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(sample)}
            className="text-xs px-3.5 py-1.5 rounded-full border border-border/70 bg-white dark:bg-[#141923] hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-foreground transition-all font-sans truncate max-w-[280px] shadow-2xs"
          >
            &ldquo;{sample.slice(0, 32)}...&rdquo;
          </button>
        ))}
      </div>

      {/* Main Workspace Box containing 2 Cards */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Card: Input */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#FFF5F7] dark:bg-[#1F1418] border border-pink-200/80 dark:border-pink-900/40 min-h-[340px] shadow-inner transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground font-handwritten tracking-wide">
                  what&apos;s in your mind?
                </h3>
                <span className="text-xs font-mono text-pink-700 dark:text-pink-300 font-medium">
                  {input.length}/2000
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                say it raw. we won&apos;t judge.
              </p>

              <textarea
                id="raw-thought-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type anything. seriously. we won't judge."
                className="w-full mt-3 min-h-[190px] bg-transparent resize-none text-sm leading-relaxed text-foreground placeholder:text-pink-400/60 focus:outline-none font-sans font-medium"
                maxLength={2000}
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="px-3 py-1 rounded-xl bg-white/60 dark:bg-black/20 hover:bg-white text-xs font-semibold text-pink-700 dark:text-pink-300 border border-pink-200/60 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Center Transformation Indicator with Handwritten Doodle */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center relative my-2 lg:my-0">
            {/* Handwritten doodle annotation */}
            <div className="hidden lg:flex flex-col items-center absolute -top-12 z-10 pointer-events-none">
              <span className="text-sm font-bold text-foreground font-handwritten tracking-wide -rotate-6">
                let&apos;s make it corporate
              </span>
              <svg className="w-10 h-8 text-purple-500/80" viewBox="0 0 50 40" fill="none">
                <path
                  d="M10 5 C 25 15, 35 10, 40 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path d="M35 25 L40 30 L42 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <button
              type="button"
              onClick={handleExecuteTranslate}
              disabled={loading || !input.trim()}
              className="w-14 h-14 rounded-full bg-[#0B0E14] text-white flex items-center justify-center shadow-xl shadow-purple-600/20 border-2 border-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-200 group"
            >
              <ArrowRight
                className={`w-6 h-6 text-white transition-transform ${
                  loading ? "animate-spin text-purple-400" : "group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Right Card: Output */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#F0FDF4] dark:bg-[#102018] border border-emerald-300/80 dark:border-emerald-900/40 min-h-[340px] shadow-inner transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground font-handwritten tracking-wide">
                  your corporate version
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/60 dark:bg-black/20 hover:bg-white text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 transition-all"
                    title="Copy Message"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className="p-1.5 rounded-lg bg-white/60 dark:bg-black/20 hover:bg-white text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 transition-all"
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600 text-emerald-600" : ""}`} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                clean. professional. on point.
              </p>

              <div className="mt-3 min-h-[190px] text-sm leading-relaxed text-foreground font-sans font-medium">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-sans text-muted-foreground animate-pulse">
                      Synthesizing workplace message...
                    </span>
                  </div>
                ) : result?.message ? (
                  <p className="animate-fade-in-up whitespace-pre-wrap">{result.message}</p>
                ) : (
                  <p className="text-muted-foreground italic text-xs">
                    Your clear corporate output will appear here...
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40">
              <button
                type="button"
                onClick={() => handleAction("regenerate")}
                disabled={loading || !result?.message}
                className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/30 hover:bg-white text-xs font-semibold text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Regenerate
              </button>

              {copied && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in-up">
                  <Check className="w-3.5 h-3.5" /> Copied!
                </span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-xs text-destructive text-center font-mono font-medium">{error}</p>
        )}
      </div>

      {/* AI Detected Context Pastel Chips Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            AI detected context
          </h4>
          <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 border border-pink-200/80 flex items-center gap-1.5">
            😤 Frustrated
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200/80 flex items-center gap-1.5">
            ↻ Frequent interruptions
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200/80 flex items-center gap-1.5">
            📝 Changing requirements
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200/80 flex items-center gap-1.5">
            🎯 Needs clarity
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5">
            👤 Manager
          </span>
        </div>
      </div>

      {/* Make it even better Refinement Cards Section */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#141923] border border-border/80 shadow-sm space-y-3">
        <h4 className="text-xl font-bold text-foreground font-handwritten tracking-wide">
          make it even better
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Shorter */}
          <button
            type="button"
            onClick={() => handleAction("shorter")}
            className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 hover:border-purple-400 hover:bg-purple-100/50 transition-all text-left space-y-1 group"
          >
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Shorter</div>
            <div className="text-[10px] text-muted-foreground">make it concise</div>
          </button>

          {/* More professional */}
          <button
            type="button"
            onClick={() => handleAction("more-professional")}
            className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 hover:border-amber-400 hover:bg-amber-100/50 transition-all text-left space-y-1 group"
          >
            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">More professional</div>
            <div className="text-[10px] text-muted-foreground">increase professionalism</div>
          </button>

          {/* More direct */}
          <button
            type="button"
            onClick={() => handleAction("more-direct")}
            className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:border-rose-400 hover:bg-rose-100/50 transition-all text-left space-y-1 group"
          >
            <Target className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">More direct</div>
            <div className="text-[10px] text-muted-foreground">make it clearer</div>
          </button>

          {/* Softer */}
          <button
            type="button"
            onClick={() => handleAction("softer")}
            className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-400 hover:bg-emerald-100/50 transition-all text-left space-y-1 group"
          >
            <Smile className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Softer</div>
            <div className="text-[10px] text-muted-foreground">make it polite</div>
          </button>

          {/* Another version */}
          <button
            type="button"
            onClick={() => handleAction("regenerate")}
            className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 hover:border-blue-400 hover:bg-blue-100/50 transition-all text-left space-y-1 group col-span-2 sm:col-span-1"
          >
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Another version</div>
            <div className="text-[10px] text-muted-foreground">different approach</div>
          </button>
        </div>
      </div>
    </div>
  );
}
