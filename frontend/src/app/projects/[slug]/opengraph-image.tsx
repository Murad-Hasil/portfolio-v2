import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Project — Murad Hasil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  metrics: string[];
}

interface ProjectsManifest {
  projects: Project[];
}

function getProjects(): Project[] {
  try {
    const raw = fs.readFileSync(
      path.resolve(process.cwd(), "context", "projects-manifest.json"),
      "utf-8"
    );
    return (JSON.parse(raw) as ProjectsManifest).projects;
  } catch {
    return [];
  }
}

const CATEGORY_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  "AI Agents":       { bg: "rgba(99,102,241,0.15)", text: "#6366f1", border: "rgba(99,102,241,0.4)" },
  "AI Automation":   { bg: "rgba(99,102,241,0.15)", text: "#6366f1", border: "rgba(99,102,241,0.4)" },
  "Full-Stack + AI": { bg: "rgba(0,212,255,0.12)",  text: "#00d4ff", border: "rgba(0,212,255,0.35)" },
  "Full-Stack":      { bg: "rgba(0,212,255,0.12)",  text: "#00d4ff", border: "rgba(0,212,255,0.35)" },
};

const DEFAULT_CAT = { bg: "rgba(99,102,241,0.15)", text: "#6366f1", border: "rgba(99,102,241,0.4)" };

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export default async function ProjectOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjects().find((p) => p.slug === slug);

  // Fallback for unknown slug
  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            background: "#08080f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e2e8f0",
            fontSize: 48,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          Murad Hasil — Portfolio
        </div>
      ),
      { ...size }
    );
  }

  const catStyle = CATEGORY_STYLE[project.category] ?? DEFAULT_CAT;
  const topTech = project.tech.slice(0, 4);
  const metric = project.metrics[0] ?? "";

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

        {/* Subtle glow — top right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${catStyle.text}18 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 80px",
            flex: 1,
            gap: 0,
          }}
        >
          {/* Category badge */}
          <div style={{ display: "flex", marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                background: catStyle.bg,
                color: catStyle.text,
                border: `1px solid ${catStyle.border}`,
                borderRadius: 6,
                padding: "5px 16px",
                fontSize: 15,
                fontFamily: "monospace",
                letterSpacing: 0.5,
              }}
            >
              {project.category}
            </div>
          </div>

          {/* Project title */}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 800,
              color: "#e2e8f0",
              lineHeight: 1.1,
              marginBottom: 14,
              letterSpacing: -0.5,
              maxWidth: 1000,
            }}
          >
            {truncate(project.title, 60)}
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              fontSize: 19,
              color: "#64748b",
              marginBottom: 32,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {truncate(project.description, 110)}
          </div>

          {/* Tech tags */}
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {topTech.map((tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  color: "#94a3b8",
                  background: "rgba(148,163,184,0.08)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: 6,
                  padding: "5px 14px",
                  fontSize: 14,
                  fontFamily: "monospace",
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          {/* First metric */}
          {metric && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#00d4ff",
                fontSize: 18,
                fontFamily: "monospace",
              }}
            >
              <span style={{ color: "#00d4ff", fontSize: 20 }}>→</span>
              {truncate(metric, 70)}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 80px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#64748b",
              fontSize: 15,
              fontFamily: "monospace",
            }}
          >
            mbmuradhasil@gmail.com
          </div>
          <div
            style={{
              display: "flex",
              color: "#00d4ff",
              fontSize: 15,
              fontFamily: "monospace",
              border: "1px solid rgba(0,212,255,0.3)",
              borderRadius: 6,
              padding: "5px 14px",
            }}
          >
            muradhasil.vercel.app/projects
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
