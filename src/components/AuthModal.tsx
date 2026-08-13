"use client";

import { useState } from "react";
import { Lock, LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (token: string, user: AuthUser) => void;
}

export function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = mode === "signup" ? { email, password, name } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onAuthSuccess(data.token, data.user);
      onOpenChange(false);
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-border/80 bg-background/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        <SheetHeader className="p-0 pb-4 border-b border-border/60">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-bold font-mono text-foreground">
              <Lock className="w-4 h-4 text-emerald-400" />
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </span>
            <div className="flex gap-1 p-1 bg-muted/40 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                  mode === "login" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(""); }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                  mode === "signup" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-muted-foreground block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jayesh Kumar"
                  className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/20 text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500/60 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground block">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jayesh@company.com"
                className="w-full h-11 px-4 rounded-xl border border-border/80 bg-muted/20 text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500/60 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "At least 8 characters..." : "Enter your password..."}
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-border/80 bg-muted/20 text-foreground font-mono text-sm focus:outline-none focus:border-emerald-500/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-destructive flex items-center gap-1.5 pt-1">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-semibold rounded-xl bg-foreground text-background hover:scale-[1.01] transition-transform"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === "login" ? "Sign In & Continue" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="p-3 rounded-xl border border-border/60 bg-muted/10 flex items-start gap-2.5 text-xs text-muted-foreground font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Authenticated users get 15 translations / min with end-to-end encryption & zero data logging.
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
