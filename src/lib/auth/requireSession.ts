import "server-only";

import { verifyToken, type JWTPayload } from "@/lib/auth/jwt";

const SESSION_COOKIE = "vent2corp_session";

export function requireSession(request: Request): JWTPayload | null {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(`${SESSION_COOKIE}=`.length);

  return token ? verifyToken(decodeURIComponent(token)) : null;
}
