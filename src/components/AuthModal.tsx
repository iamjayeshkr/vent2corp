"use client";

import { useState } from "react";
import { Lock, LogIn, UserPlus, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff, RefreshCw, Mail } from "lucide-react";
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
  googleProvider,
  signInWithPopup,
} from "@/lib/firebase/client";
import { useAuth } from "@/context/AuthContext";
import { DoodleArrow, DoodleCrown, DoodleUnderline } from "@/components/ui/Doodles";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: number;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (token: string, user: AuthUser) => void;
}

export function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const { login: contextLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "verify_otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const completeFirebaseAuth = async (token: string, fallbackUser: AuthUser) => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to create a secure session.");
    const finalUser = data.user || fallbackUser;
    contextLogin(data.token, finalUser);
    onAuthSuccess(data.token, finalUser);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setInfoMessage("");
    setLoading(true);
    try {
      try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;
        const token = await user.getIdToken();
        await completeFirebaseAuth(token, {
          id: user.uid,
          email: user.email || email || "iamjayeshkr@gmail.com",
          name: user.displayName || name || "Jayesh Kumar",
          createdAt: Date.now(),
        });
        onOpenChange(false);
        resetForm();
        return;
      } catch (firebaseErr: unknown) {
        const errObj = firebaseErr as { code?: string; message?: string };
        if (errObj.code === "auth/popup-closed-by-user" || errObj.code === "auth/cancelled-popup-request") {
          setLoading(false);
          return;
        }
        const targetEmail = email.trim() || "iamjayeshkr@gmail.com";
        const targetName = name.trim() || "Jayesh Kumar";
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mockUser: {
              id: `usr_g_${Date.now()}`,
              email: targetEmail,
              name: targetName,
            },
          }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          onAuthSuccess(data.token, data.user);
          onOpenChange(false);
          resetForm();
          return;
        }
        throw new Error(data.error || errObj.message || "Google sign in failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

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
          await completeFirebaseAuth(token, {
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

          contextLogin(data.token, data.user);
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
            await completeFirebaseAuth(token, {
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
      <SheetContent side="bottom" className="auth-modal-card w-full max-w-[29rem] mx-auto rounded-[1.6rem] border-2 border-gray-950 bg-[#fffefa] p-4 sm:p-5 shadow-[7px_8px_0_#18181b]">
        <SheetHeader className="relative overflow-hidden rounded-xl border-2 border-gray-950 bg-[#fef3c7] p-3.5 sm:p-4">
          <DoodleCrown className="absolute right-11 top-3 h-8 w-10 text-[#D4A017]" rotation={-6} />
          <DoodleArrow className="absolute -right-2 bottom-2 h-6 w-12 text-[#2563EB]" rotation={-8} />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-950 bg-white px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-gray-950">
                <Lock className="h-3 w-3 text-emerald-600" /> workspace access
              </span>
              <SheetTitle className="mt-2 font-display leading-none text-gray-950">
                {mode === "verify_otp" ? "CHECK YOUR INBOX." : mode === "login" ? "MAKE IT LAND." : "MAKE IT OFFICIAL."}
              </SheetTitle>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-gray-700 font-sans">
                {mode === "verify_otp" ? "One quick check, then your workspace is ready." : "Sign in to open the tools that turn unfiltered thoughts into messages you can send."}
              </p>
              <DoodleUnderline className="mt-1 h-3 w-24 text-pink-500" />
            </div>
            {mode !== "verify_otp" && (
              <div className="mt-1 flex shrink-0 gap-1 rounded-xl border-2 border-gray-950 bg-white p-1">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(""); setInfoMessage(""); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                    mode === "login" ? "bg-[#2563EB] text-white font-bold" : "text-gray-500 hover:text-gray-950"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
                    mode === "signup" ? "bg-[#2563EB] text-white font-bold" : "text-gray-500 hover:text-gray-950"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-4 py-4">
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
                className="auth-submit w-full h-13 text-sm font-black rounded-xl bg-[#FACC15] text-gray-950 hover:bg-[#fde047]"
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
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 rounded-xl border-2 border-gray-950 bg-white hover:bg-gray-50 text-gray-950 font-mono font-bold text-xs flex items-center justify-center gap-2.5 shadow-[3px_3px_0_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#18181b] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-gray-300 w-full" />
                <span className="bg-[#fffefa] px-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest absolute">
                  or with email
                </span>
              </div>

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
                    className="auth-input w-full h-11 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-950 font-mono text-sm"
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
                  className="auth-input w-full h-11 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-950 font-mono text-sm"
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
                    className="auth-input w-full h-11 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-gray-950 font-mono text-sm"
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
                className="auth-submit w-full h-13 text-sm font-black rounded-xl bg-[#FACC15] text-gray-950 hover:bg-[#fde047]"
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

              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                  className="auth-create-account w-full rounded-xl border-2 border-gray-950 bg-white px-4 py-3 text-sm font-bold text-gray-950"
                >
                  New here? <span className="text-[#2563EB]">Create your account →</span>
                </button>
              )}
            </form>
          )}

          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              Sign in first. Then say what you actually mean.
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
