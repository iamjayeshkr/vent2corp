import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", color: "#facc15", fontSize: 46, fontWeight: 900, fontFamily: "sans-serif", border: "5px solid #2563eb" }}>2</div>,
    size
  );
}
