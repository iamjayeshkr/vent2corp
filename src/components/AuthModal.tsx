"use client";

import { useState } from "react";
import { Lock, LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendVerifiedFirebaseEmail,
  updateProfile,
} from "@/lib/firebase/client";

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
  const [mode, setMode] = useState<"login" | "signup" | "verify_otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // 1. Firebase Client SignUp
        let userCredential;
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } catch {
          // Fallback to backend API if Firebase API key is unconfigured
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to create account.");

          setMode("verify_otp");
          setInfoMessage(data.message || `A verification code has been sent to ${email}. Check your inbox.`);
          setLoading(false);
          return;
        }

        const user = userCredential.user;
        if (name) {
          await updateProfile(user, { displayName: name });
        }
        await sendVerifiedFirebaseEmail(user);

        setMode("verify_otp");
        setInfoMessage(`Verification link sent to ${email}. Please check your Inbox (or Spam folder).`);
        setLoading(false);
        return;
      }

      if (mode === "login") {
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          if (!firebaseUser.emailVerified) {
            await sendVerifiedFirebaseEmail(firebaseUser);
            setMode("verify_otp");
            setInfoMessage(`Email not verified yet. A fresh verification link has been sent to ${email}. Check your Inbox / Spam folder.`);
            setLoading(false);
            return;
          }

          const token = await firebaseUser.getIdToken();
          onAuthSuccess(token, {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name: firebaseUser.displayName || name || "User",
            createdAt: 0,
          });
          onOpenChange(false);
          resetForm();
          return;
        } catch {
          // Fallback to local JWT auth if Firebase fails or is unconfigured
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if (data.requiresVerification) {
            setMode("verify_otp");
            setInfoMessage(data.message || `Verification code sent to ${email}. Check your inbox.`);
            setLoading(false);
            return;
          }

          if (!res.ok) throw new Error(data.error || "Authentication failed.");

          onAuthSuccess(data.token, data.user);
          onOpenChange(false);
          resetForm();
          return;
        }
      }

      if (mode === "verify_otp") {
        // Reload current Firebase user to check emailVerified status
        if (auth.currentUser) {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            const token = await auth.currentUser.getIdToken(true);
            onAuthSuccess(token, {
              id: auth.currentUser.uid,
              email: auth.currentUser.email || email,
              name: auth.currentUser.displayName || name || "User",
              createdAt: 0,
            });
            onOpenChange(false);
            resetForm();
            return;
          }
        }
        throw new Error("Email not verified yet. Please click the link in your email inbox (or Spam folder) and try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError("");
    setInfoMessage("");
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendVerifiedFirebaseEmail(auth.currentUser);
        setInfoMessage(`A fresh verification link has been sent via Firebase to ${email}. Check your Inbox & Spam.`);
      } else {
        const res = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to resend code.");
        setInfoMessage(data.message || "A new verification code has been sent to your inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
    setInfoMessage("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full max-w-lg mx-auto rounded-t-3xl border-t border-border/80 bg-background/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        <SheetHeader className="p-0 pb-4 border-b border-border/60">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-bold font-mono text-foreground">
              {mode === "verify_otp" ? (
                <>
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Verify Email Address
                </>
              ) : mode === "login" ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Welcome Back
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  Create Your Account
                </>
              )}
            </span>
            {mode !== "verify_otp" && (
              <div className="flex gap-1 p-1 bg-muted/40 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setInfoMessage(""); }}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                    mode === "login" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                    mode === "signup" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {mode === "verify_otp" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" /> Check Your Email Inbox
                </p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  A verification link was sent to <span className="text-foreground underline">{email}</span>. Click the link in your email (check <strong>Spam / Junk</strong> folder if not in Inbox), then press below to log in.
                </p>
              </div>

              {infoMessage && (
                <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {infoMessage}
                </p>
              )}

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
                    Checking Verification...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    I&apos;ve Verified My Email <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs font-mono pt-2">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); }}
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  ← Back to Login
                </button>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Link
                </button>
              </div>
            </form>
          ) : (
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

              {infoMessage && (
                <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {infoMessage}
                </p>
              )}

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
                    {mode === "login" ? "Sign In & Continue" : "Send Verification Email"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </Button>
            </form>
          )}

          <div className="p-3 rounded-xl border border-border/60 bg-muted/10 flex items-start gap-2.5 text-xs text-muted-foreground font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Firebase Authentication protects your Gemini API tokens & delivers verified emails.
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
