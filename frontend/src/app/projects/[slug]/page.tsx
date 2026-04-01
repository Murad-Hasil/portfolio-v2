import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import fs from "fs";
import path from "path";

type GalleryItem = {
  src: string;
  caption: string;
};

type Phase = {
  phase: string;
  title: string;
  tech: string;
  points: number;
  description: string;
};

type Module = {
  number: number;
  title: string;
  weeks: string;
  description: string;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  category: string;
  context?: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  live_url: string | null;
  github_url: string | null;
  image: string;
  gallery?: GalleryItem[];
  phases?: Phase[];
  modules?: Module[];
  metrics: string[];
  highlights: string[];
  demo_note?: string;
};

function readProjectsJson(): { projects: Project[] } {
  const jsonPath = path.resolve(
    process.cwd(),
    "context",
    "projects-manifest.json"
  );
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as {
    projects: Project[];
  };
}

function fetchProject(slug: string): Project | null {
  try {
    const data = readProjectsJson();
    return data.projects.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const data = readProjectsJson();
    return data.projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = fetchProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = fetchProject(slug);
  if (!project) notFound();

  const hasLiveUrl =
    project.live_url !== null &&
    project.live_url !== "[your deployed URL]";
  const hasGithub =
    project.github_url !== null &&
    project.github_url !== "[your GitHub repo URL]";

  const gallery = project.gallery?.filter((g) => g.src) ?? [];
  const hasGallery = gallery.length > 1;

  return (
    <main
      className="min-h-screen py-20 px-4 sm:px-6"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors duration-200 hover:text-[var(--accent-cyan)]"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>

        {/* Category badge */}
        <div className="mb-4">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--accent-indigo)",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-bold leading-tight mb-4"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "var(--text-primary)",
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
        <p
          className="text-base mb-6 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>

        {/* Context / Hackathon badge */}
        {project.context && (
          <div
            className="rounded-lg p-4 mb-8 text-sm leading-relaxed"
            style={{
              background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.2)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            <span
              className="text-xs tracking-widest uppercase block mb-1"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                color: "var(--accent-cyan)",
              }}
            >
              // Context
            </span>
            {project.context}
          </div>
        )}

        {/* Hero screenshot */}
        {project.image && (
          <div
            className="rounded-lg overflow-hidden mb-8"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={900}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <hr style={{ borderColor: "var(--border-subtle)", marginBottom: "2rem" }} />

        {/* Problem / Solution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div
            className="rounded-lg p-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <h2
              className="text-xs tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              {"// Problem"}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {project.problem}
            </p>
          </div>
          <div
            className="rounded-lg p-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <h2
              className="text-xs tracking-widest uppercase mb-2"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              {"// Solution"}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {project.solution}
            </p>
          </div>
        </div>

        {/* Evolution Phases (Todo-style projects) */}
        {project.phases && project.phases.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-xs tracking-widest uppercase mb-5"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              {"// Evolution Phases"}
            </h2>
            <div className="relative">
              {/* vertical line */}
              <div
                className="absolute left-[18px] top-0 bottom-0 w-px"
                style={{ background: "var(--border-subtle)" }}
              />
              <div className="space-y-5">
                {project.phases.map((p) => (
                  <div key={p.phase} className="flex gap-4">
                    {/* dot */}
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center text-xs font-bold z-10"
                      style={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--accent-cyan)",
                        color: "var(--accent-cyan)",
                        fontFamily: "var(--font-jetbrains-mono)",
                      }}
                    >
                      {p.phase}
                    </div>
                    <div
                      className="flex-1 rounded-lg p-4"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <span
                          className="font-semibold text-sm"
                          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
                        >
                          {p.title}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                          style={{
                            fontFamily: "var(--font-jetbrains-mono)",
                            color: "var(--accent-indigo)",
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                          }}
                        >
                          {p.points} pts
                        </span>
                      </div>
                      <p
                        className="text-xs mb-2"
                        style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {p.tech}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modules (Textbook-style projects) */}
        {project.modules && project.modules.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-xs tracking-widest uppercase mb-5"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              {"// Curriculum Modules"}
            </h2>
            <div className="space-y-4">
              {project.modules.map((m) => (
                <div
                  key={m.number}
                  className="rounded-lg p-5 flex gap-4"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.3)",
                      color: "var(--accent-cyan)",
                      fontFamily: "var(--font-jetbrains-mono)",
                    }}
                  >
                    {m.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                      <span
                        className="font-semibold text-sm"
                        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
                      >
                        {m.title}
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
                      >
                        {m.weeks}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot Gallery */}
        {hasGallery && (
          <div className="mb-10">
            <h2
              className="text-xs tracking-widest uppercase mb-4"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              {"// Screenshots"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gallery.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden"
                  style={{ border: "1px solid var(--border-subtle)" }}
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    width={600}
                    height={340}
                    className="w-full h-44 object-cover object-top"
                  />
                  <div
                    className="px-3 py-2 text-xs"
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-jetbrains-mono)",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    {item.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-10">
          <h2
            className="text-xs tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
          >
            {"// Tech Stack"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent-indigo)",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                [{t}]
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-10">
          <h2
            className="text-xs tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
          >
            {"// Metrics"}
          </h2>
          <ul className="space-y-2">
            {project.metrics.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-green)", flexShrink: 0 }}>✓</span>
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Highlights */}
        <div className="mb-10">
          <h2
            className="text-xs tracking-widest uppercase mb-3"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
          >
            {"// Highlights"}
          </h2>
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-indigo)", flexShrink: 0 }}>→</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        {(hasLiveUrl || hasGithub || project.demo_note) && (
          <div className="flex flex-wrap gap-3">
            {hasLiveUrl && (
              <a
                href={project.live_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: "var(--accent-cyan)",
                  color: "#08080F",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {hasGithub && (
              <a
                href={project.github_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
                style={{
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                <GithubIcon size={14} />
                GitHub
              </a>
            )}
            {project.demo_note && !hasLiveUrl && (
              <span
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--text-muted)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {project.demo_note}
              </span>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
