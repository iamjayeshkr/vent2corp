"use client";

import { Settings2, Sun, Moon, Monitor, Sparkles, UserCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TONES, RECIPIENTS, PLATFORMS } from "@/types";
import type { Tone, Recipient, Platform, Theme } from "@/types";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: Theme;
  defaultTone: Tone;
  defaultRecipient: Recipient;
  defaultPlatform: Platform;
  onUpdate: (settings: {
    theme?: Theme;
    defaultTone?: Tone;
    defaultRecipient?: Recipient;
    defaultPlatform?: Platform;
  }) => void;
}

export function SettingsPanel({
  open,
  onOpenChange,
  theme,
  defaultTone,
  defaultRecipient,
  defaultPlatform,
  onUpdate,
}: SettingsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full min-h-0 p-6 overflow-hidden bg-background/95 backdrop-blur-2xl">
        <SheetHeader className="p-0 pb-3 border-b border-border/60">
          <SheetTitle className="flex items-center gap-2 text-base font-bold font-mono">
            <Settings2 className="w-4 h-4 text-emerald-400" />
            Preferences & Settings
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1 py-4 space-y-6">
          {/* Theme Section */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Color Theme
              </label>
              <p className="text-xs text-muted-foreground">
                Customize appearance mode across the workspace.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {([
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Monitor, label: "System" },
              ] as const).map((t) => (
                <Button
                  key={t.value}
                  variant={theme === t.value ? "default" : "outline"}
                  className={`h-10 rounded-xl text-xs font-medium gap-1.5 transition-all ${
                    theme === t.value
                      ? "bg-foreground text-background shadow-md"
                      : "bg-background/60 hover:bg-muted"
                  }`}
                  onClick={() => {
                    onUpdate({ theme: t.value });
                    const root = document.documentElement;
                    if (t.value === "dark") {
                      root.classList.add("dark");
                      localStorage.setItem("vent2corp-theme", "dark");
                    } else if (t.value === "light") {
                      root.classList.remove("dark");
                      localStorage.setItem("vent2corp-theme", "light");
                    } else {
                      const prefersDark = window.matchMedia(
                        "(prefers-color-scheme: dark)"
                      ).matches;
                      if (prefersDark) root.classList.add("dark");
                      else root.classList.remove("dark");
                      localStorage.setItem("vent2corp-theme", "system");
                    }
                  }}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="opacity-60" />

          {/* Translation Defaults Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Default Playground Parameters
              </h3>
              <p className="text-xs text-muted-foreground">
                Set default parameters loaded when you open vent2corp.
              </p>
            </div>

            {/* Default Tone */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Default Tone
              </label>
              <Select
                value={defaultTone}
                onValueChange={(v) => onUpdate({ defaultTone: v as Tone })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-background/80 border border-border/80 text-sm">
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

            {/* Default Recipient */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Default Recipient
              </label>
              <Select
                value={defaultRecipient}
                onValueChange={(v) => onUpdate({ defaultRecipient: v as Recipient })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-background/80 border border-border/80 text-sm">
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

            {/* Default Platform */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                Default Platform
              </label>
              <Select
                value={defaultPlatform}
                onValueChange={(v) => onUpdate({ defaultPlatform: v as Platform })}
              >
                <SelectTrigger className="w-full h-11 rounded-xl bg-background/80 border border-border/80 text-sm">
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

          <Separator className="opacity-60" />

          {/* Security & Access Section */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5" />
                API Security & Access Key
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage passcode to protect Gemini API token consumption.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-xs font-mono font-medium text-foreground block">
                Saved Passcode
              </label>
              <input
                type="password"
                defaultValue={typeof window !== "undefined" ? localStorage.getItem("vent2corp-access-key") || "corporate2026" : ""}
                onChange={(e) => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("vent2corp-access-key", e.target.value.trim());
                  }
                }}
                className="w-full h-10 px-3 rounded-xl border border-border/80 bg-background/80 text-xs font-mono"
                placeholder="Enter access key..."
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
