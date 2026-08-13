"use client";

import { useState } from "react";
import { Lock, KeyRound, ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticate: (key: string) => void;
}

export function AuthModal({ open, onOpenChange, onAuthenticate }: AuthModalProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the access passcode.");
      return;
    }
    setAuthenticating(true);
    setError("");

    setTimeout(() => {
      onAuthenticate(passcode.trim());
      setAuthenticating(false);
    }, 400);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-border/80 bg-background/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        <SheetHeader className="p-0 pb-4 border-b border-border/60">
          <SheetTitle className="flex items-center gap-2 text-base font-bold font-mono text-foreground">
            <Lock className="w-4 h-4 text-emerald-400" />
            Access Key Required
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <KeyRound className="w-5 h-5 flex-shrink-0" />
            <span>
              This vent2corp instance is protected. Enter the access passcode to unlock translation features and API access.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium text-muted-foreground block">
                Access Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full h-12 px-4 rounded-xl border border-border/80 bg-muted/20 text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500/60 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-destructive flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={authenticating || !passcode.trim()}
              className="w-full h-12 text-sm font-semibold rounded-xl bg-foreground text-background hover:scale-[1.01] transition-transform"
            >
              {authenticating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Unlock Workspace <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-[11px] font-mono text-muted-foreground text-center">
            Default Passcode: <code className="text-emerald-400 font-bold">corporate2026</code> (configurable in .env.local)
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
