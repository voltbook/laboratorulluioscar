import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Oscar Lab";
  const accent = searchParams.get("accent") ?? "#00ff66";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "750px",
          display: "flex",
          background: "linear-gradient(135deg,#020403,#06140b 58%,#001f0d)",
          color: "white",
          fontFamily: "monospace",
          padding: "62px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.24, backgroundImage: `linear-gradient(90deg, transparent 97%, ${accent} 98%), linear-gradient(0deg, transparent 97%, ${accent} 98%)`, backgroundSize: "46px 46px" }} />
        <div style={{ position: "absolute", right: "-90px", top: "-120px", width: "420px", height: "420px", border: `2px solid ${accent}`, transform: "rotate(20deg)" }} />
        <div style={{ marginTop: "auto", width: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ color: accent, fontSize: 32, letterSpacing: 8 }}>LABORATORUL LUI OSCAR</div>
          <div style={{ marginTop: 26, fontSize: 74, lineHeight: 1.05, fontWeight: 700 }}>{title}</div>
          <div style={{ marginTop: 34, color: accent, fontSize: 26 }}>DIY HARDWARE // WIRING // CODE // 3D // PDF</div>
        </div>
      </div>
    ),
    { width: 1200, height: 750 },
  );
}
