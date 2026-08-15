"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/?auth=required&next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-mono text-xs select-none">
        <div className="flex items-center gap-3 p-6 rounded-2xl border-2 border-gray-950 bg-white shadow-[6px_6px_0_#18181b]">
          <span className="w-5 h-5 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-gray-950">Verifying workspace session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
