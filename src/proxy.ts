import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "vent2corp_session";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret(): string {
  return process.env.JWT_SECRET?.trim() || process.env.APP_ACCESS_KEY?.trim() || "corporate2026";
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hasValidSession(rawToken: string | undefined) {
  if (!rawToken) return false;
  let token = rawToken;
  try {
    token = decodeURIComponent(rawToken);
  } catch {
    token = rawToken;
  }
  const secret = getSecret();
  if (!secret) return false;
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature) return false;

  try {
    const header = JSON.parse(decoder.decode(decodeBase64Url(encodedHeader))) as { alg?: string };
    const payload = JSON.parse(decoder.decode(decodeBase64Url(encodedPayload))) as { exp?: number };
    if (header.alg !== "HS256" || !payload.exp || payload.exp * 1000 <= Date.now()) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    return crypto.subtle.verify("HMAC", key, decodeBase64Url(encodedSignature), encoder.encode(`${encodedHeader}.${encodedPayload}`));
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  if (await hasValidSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const destination = new URL("/", request.url);
  destination.searchParams.set("auth", "required");
  destination.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(destination);
}

export const config = {
  matcher: [
    "/app/:path*",
    "/analytics/:path*",
    "/dashboard/:path*",
    "/examples/:path*",
    "/favorites/:path*",
    "/history/:path*",
    "/new/:path*",
    "/settings/:path*",
    "/tone-lab/:path*",
    "/checkout/:path*",
  ],
};
