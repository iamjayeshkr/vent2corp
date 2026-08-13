"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RotateCcw, Scissors, Briefcase, ArrowRight, Sparkles, MessageSquare, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TONES, RECIPIENTS, PLATFORMS } from "@/types";
import type { Tone, Recipient, Platform, TranslationResult } from "@/types";

interface TranslatorProps {
  defaultTone: Tone;
  defaultRecipient: Recipient;
  defaultPlatform: Platform;
  onTranslate: (original: string, result: TranslationResult, tone: Tone, recipient: Recipient, platform: Platform) => void;
  onRequireAuth?: () => void;
}

const SAMPLE_PROMPTS = [
  "abe chutiya hai kya?? kuch bhi requiement bhej raha hai soch toh le ek baar",
  "jaldi kar bhai client sar pe khada hai",
  "kya bakwas kaam bana ke bheja hai",
  "mujhe ek hafte ki leave chahiye emergency hai",
];

export function Translator({
  defaultTone,
  defaultRecipient,
  defaultPlatform,
  onTranslate,
  onRequireAuth,
}: TranslatorProps) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>(defaultTone);
  const [recipient, setRecipient] = useState<Recipient>(defaultRecipient);
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const accessKey = localStorage.getItem("vent2corp-access-key") || "corporate2026";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-key": accessKey,
        },
        body: JSON.stringify({ text: input, tone, recipient, platform }),
      });
      if (res.status === 401) {
        if (onRequireAuth) onRequireAuth();
        throw new Error("Access Key required to translate. Enter passcode to unlock.");
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
      if (input.trim()) handleTranslate();
    }
  };

  const handleCopy = async () => {
    if (!result?.message) return;
    await navigator.clipboard.writeText(result.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = async (action: "regenerate" | "shorter" | "more-professional" | "more-direct") => {
    if (!input.trim() || !result?.message) return;
    setLoading(true);
    setError("");
    try {
      const accessKey = localStorage.getItem("vent2corp-access-key") || "corporate2026";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-key": accessKey,
        },
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
        throw new Error("Access Key required. Enter passcode to unlock.");
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
    <section id="translator" className="px-4 py-16 sm:py-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Container Box with Glassmorphism */}
        <div className="p-6 sm:p-10 rounded-3xl border border-border/80 bg-background/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Top Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-base font-bold font-mono tracking-tight">AI Playground</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">
              Press Enter to translate · Shift+Enter for newline
            </span>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-amber-400" /> Try:
            </span>
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInput(sample)}
                className="text-xs px-3 py-1 rounded-full border border-border/60 bg-muted/30 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all font-mono truncate max-w-[280px]"
              >
                &ldquo;{sample.slice(0, 32)}...&rdquo;
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {/* Input Panel */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Raw Thought / Hinglish Vent
              </label>
              <div className="relative flex-1 min-h-[220px] lg:min-h-[300px]">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. abe chutiya hai kya?? kuch bhi requiement bhej raha hai soch toh le ek baar..."
                  className="min-h-[220px] lg:min-h-[300px] resize-none text-base leading-relaxed p-5 rounded-2xl border border-border/80 bg-muted/20 focus-visible:ring-emerald-500/40 font-sans"
                  maxLength={2000}
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
                  {input.length}/2000
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Corporate Output
              </label>
              <div className="relative flex-1 min-h-[220px] lg:min-h-[300px] rounded-2xl border border-border/80 bg-muted/30 p-5 overflow-auto flex flex-col justify-between">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 my-auto">
                    <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono text-muted-foreground animate-pulse">
                      Synthesizing workplace message...
                    </p>
                  </div>
                ) : result ? (
                  <div className="animate-fade-in-up">
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground font-sans">
                      {result.message}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 my-auto">
                    <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                    <p className="text-sm">
                      Your workplace-ready message will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground mb-1.5 block">Tone</label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger className="w-full h-11 rounded-xl font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground mb-1.5 block">Recipient</label>
                <Select value={recipient} onValueChange={(v) => setRecipient(v as Recipient)}>
                  <SelectTrigger className="w-full h-11 rounded-xl font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECIPIENTS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground mb-1.5 block">Platform</label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                  <SelectTrigger className="w-full h-11 rounded-xl font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleTranslate}
              disabled={!input.trim() || loading}
              className="w-full h-13 text-base font-semibold rounded-xl bg-foreground text-background hover:scale-[1.01] transition-transform shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Translating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Translate Message
                </span>
              )}
            </Button>

            {error && (
              <p className="text-sm text-destructive text-center font-mono">{error}</p>
            )}
          </div>

          {/* Output Actions */}
          {result && !loading && (
            <div className="mt-6 animate-fade-in-up">
              <Separator className="mb-4" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("regenerate")}
                    className="gap-1.5 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("shorter")}
                    className="gap-1.5 rounded-lg"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    Shorter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("more-professional")}
                    className="gap-1.5 rounded-lg"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    More professional
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction("more-direct")}
                    className="gap-1.5 rounded-lg"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    More direct
                  </Button>
                </div>
              </div>

              {/* Detected Context */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="font-semibold text-foreground">Detected:</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {result.emotion}
                </Badge>
                <span>·</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {result.intent}
                </Badge>
                <span>·</span>
                <Badge variant="secondary" className="text-xs font-normal">
                  {RECIPIENTS.find((r) => r.value === recipient)?.label}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
