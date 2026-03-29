import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Murad Hasil — AI Automation Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#08080f",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #00d4ff, #6366f1, #10b981)",
            display: "flex",
          }}
        />

        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Agent network — right side decoration */}
        <svg
          style={{ position: "absolute", right: 0, top: 0, opacity: 0.18 }}
          width="520"
          height="630"
          viewBox="0 0 520 630"
        >
          {/* Lines */}
          <line x1="380" y1="120" x2="260" y2="220" stroke="#00d4ff" strokeWidth="1" />
          <line x1="380" y1="120" x2="460" y2="280" stroke="#6366f1" strokeWidth="1" />
          <line x1="260" y1="220" x2="180" y2="360" stroke="#00d4ff" strokeWidth="1" />
          <line x1="460" y1="280" x2="380" y2="420" stroke="#6366f1" strokeWidth="1" />
          <line x1="180" y1="360" x2="300" y2="480" stroke="#10b981" strokeWidth="1" />
          <line x1="380" y1="420" x2="300" y2="480" stroke="#00d4ff" strokeWidth="1" />
          <line x1="460" y1="280" x2="500" y2="400" stroke="#6366f1" strokeWidth="1" />
          <line x1="260" y1="220" x2="320" y2="340" stroke="#10b981" strokeWidth="1" />
          <line x1="320" y1="340" x2="380" y2="420" stroke="#00d4ff" strokeWidth="1" />
          {/* Nodes */}
          <circle cx="380" cy="120" r="10" fill="#6366f1" />
          <circle cx="260" cy="220" r="8" fill="#00d4ff" />
          <circle cx="460" cy="280" r="12" fill="#6366f1" />
          <circle cx="180" cy="360" r="7" fill="#10b981" />
          <circle cx="320" cy="340" r="6" fill="#00d4ff" />
          <circle cx="380" cy="420" r="9" fill="#6366f1" />
          <circle cx="300" cy="480" r="11" fill="#00d4ff" />
          <circle cx="500" cy="400" r="7" fill="#10b981" />
          {/* Outer glow rings */}
          <circle cx="380" cy="120" r="22" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
          <circle cx="460" cy="280" r="26" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
          <circle cx="300" cy="480" r="24" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.4" />
        </svg>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            flex: 1,
            maxWidth: 720,
          }}
        >
          {/* Code comment label */}
          <div
            style={{
              display: "flex",
              color: "#00d4ff",
              fontSize: 18,
              fontFamily: "monospace",
              marginBottom: 20,
              letterSpacing: 1,
            }}
          >
            {"// AI Automation Engineer"}
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              color: "#e2e8f0",
              lineHeight: 1.1,
              marginBottom: 16,
              letterSpacing: -1,
            }}
          >
            Murad Hasil
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#94a3b8",
              marginBottom: 40,
              lineHeight: 1.4,
            }}
          >
            AI Agents · RAG Pipelines · Full-Stack · Kubernetes
          </div>

          {/* Tech tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "OpenAI Agents SDK", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
              { label: "MCP", color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
              { label: "FastAPI", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              { label: "Next.js", color: "#e2e8f0", bg: "rgba(226,232,240,0.08)" },
              { label: "RAG", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
              { label: "Kubernetes", color: "#00d4ff", bg: "rgba(0,212,255,0.1)" },
            ].map((tag) => (
              <div
                key={tag.label}
                style={{
                  display: "flex",
                  color: tag.color,
                  background: tag.bg,
                  border: `1px solid ${tag.color}33`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 15,
                  fontFamily: "monospace",
                }}
              >
                {tag.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 80px 36px",
          }}
        >
          <div style={{ display: "flex", color: "#64748b", fontSize: 16, fontFamily: "monospace" }}>
            mbmuradhasil@gmail.com
          </div>
          <div
            style={{
              display: "flex",
              color: "#00d4ff",
              fontSize: 16,
              fontFamily: "monospace",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: 6,
              padding: "6px 16px",
            }}
          >
            murad-hasil-portfolio-v2-xi.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
