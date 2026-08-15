"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, onAuthStateChanged, type User as FirebaseUser } from "@/lib/firebase/client";
import { initCapacitorMobile } from "@/lib/mobile/capacitor";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncUserSession = useCallback(async (token?: string) => {
    try {
      const headers: Record<string, string> = {};
      const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("vent2corp_token") : null);
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch("/api/auth/me", { headers });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.token && typeof window !== "undefined") {
          localStorage.setItem("vent2corp_token", data.token);
          localStorage.setItem("vent2corp_user", JSON.stringify(data.user));
        }
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("vent2corp_token");
          localStorage.removeItem("vent2corp_user");
        }
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void initCapacitorMobile();

    // 1. Listen to Firebase Auth State Changes (Restores session on reload/token change)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const sessionRes = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
          });

          if (sessionRes.ok) {
            const data = await sessionRes.json();
            setUser(data.user);
            if (data.token && typeof window !== "undefined") {
              localStorage.setItem("vent2corp_token", data.token);
              localStorage.setItem("vent2corp_user", JSON.stringify(data.user));
            }
            setLoading(false);
            return;
          }
        } catch {
          // Fall through to syncUserSession if session endpoint fails
        }
      }

      // 2. Fallback to /api/auth/me for HTTP cookie or local token sessions
      await syncUserSession();
    });

    return () => unsubscribe();
  }, [syncUserSession]);

  const login = useCallback((token: string, newUser: AuthUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vent2corp_token", token);
      localStorage.setItem("vent2corp_user", JSON.stringify(newUser));
    }
    setUser(newUser);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("vent2corp_token");
      localStorage.removeItem("vent2corp_user");
    }
    setUser(null);
    setLoading(false);
  }, []);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    await syncUserSession();
  }, [syncUserSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
