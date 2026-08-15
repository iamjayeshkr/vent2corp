import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "vent2corp — say it raw, send it right.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const geist = await readFile(join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"));

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#fffefa", color: "#09090b", padding: "58px 70px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "57%" }}>
        <div style={{ display: "flex", fontSize: 36, fontWeight: 900, letterSpacing: -2 }}>vent<span style={{ color: "#2563eb" }}>2</span>corp</div>
        <div style={{ display: "flex", marginTop: 66, flexDirection: "column", fontSize: 86, lineHeight: 0.88, fontWeight: 900, letterSpacing: -5 }}>
          <span>SAY IT RAW.</span><span style={{ color: "#2563eb" }}>SEND IT RIGHT.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 25, fontWeight: 600 }}>same meaning. better delivery.</div>
      </div>
      <div style={{ display: "flex", position: "absolute", right: 64, top: 128, width: 420, flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", transform: "rotate(-3deg)", flexDirection: "column", border: "3px solid #f9a8d4", borderRadius: 26, background: "#fff1f6", padding: "22px 28px", fontSize: 19, fontWeight: 700 }}><span style={{ color: "#be185d", fontSize: 14 }}>RAW THOUGHT</span><span style={{ marginTop: 10 }}>"bhai this is impossible 😭"</span></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", fontSize: 34 }}>↓</div>
        <div style={{ display: "flex", transform: "rotate(2deg)", flexDirection: "column", border: "3px solid #86efac", borderRadius: 26, background: "#f0fdf4", padding: "22px 28px", fontSize: 18, fontWeight: 700 }}><span style={{ color: "#047857", fontSize: 14 }}>CORPORATE.EXE</span><span style={{ marginTop: 10 }}>Could we discuss a revised timeline?</span></div>
      </div>
      <div style={{ display: "flex", position: "absolute", bottom: 44, left: 68, height: 10, width: 300, background: "#facc15" }} />
    </div>,
    { ...size, fonts: [{ name: "Geist", data: geist, weight: 400, style: "normal" }] }
  );
}
