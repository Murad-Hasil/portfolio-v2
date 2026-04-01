# Plan — Feature 004: Dynamic OG Image

| Field | Value |
|---|---|
| **Status** | In Progress |
| **Date** | 2026-04-02 |

---

## Key Decision: edge → nodejs runtime

Next.js ImageResponse supports both `edge` and `nodejs` runtimes. Edge is
faster globally but does NOT support Node.js built-ins (`fs`, `path`). Since
we need `fs.readFileSync` to read `context/` JSON files at request time, we
switch to `nodejs` runtime. Performance difference for OG images is negligible
(they are cached by social platforms after first fetch).

## Key Decision: outputFileTracingRoot

`context/` lives one level above `frontend/` (the Next.js project root). By
default Vercel's file tracer only bundles files within the Next.js project
directory. Setting `outputFileTracingRoot` to the repo root tells the tracer
to follow `fs` reads that resolve to `../context/` and include those files in
the serverless bundle. Without this, the OG route would throw ENOENT on Vercel.

---

## Layer-by-layer plan

### Layer 1 — next.config.ts

```ts
import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: { remotePatterns: [...] },
}
export default nextConfig
```

### Layer 2 — opengraph-image.tsx (homepage)

```ts
export const runtime = "nodejs"  // was "edge"
// remove: export const alt, size, contentType (keep size/contentType)

import fs from "fs"
import path from "path"

function getTopSkills(): string[] {
  const raw = fs.readFileSync(
    path.resolve(process.cwd(), "..", "context", "skills-manifest.json"),
    "utf-8"
  )
  const manifest = JSON.parse(raw)
  return Object.values(manifest.skills as Record<string, { items: { name: string; level: string }[] }>)
    .flatMap(cat => cat.items.filter(s => s.level === "advanced"))
    .slice(0, 6)
    .map(s => s.name)
}
```

Tags alternate indigo/cyan. Agent network SVG stays (right-side decoration).

### Layer 3 — projects/[slug]/opengraph-image.tsx (new)

```ts
export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export async function generateImageMetadata({ params }) {
  const projects = getProjects()
  const p = projects.find(p => p.slug === params.slug)
  return [{ id: params.slug, alt: p ? `${p.title} — Murad Hasil` : "Project" }]
}

export default function ProjectOgImage({ params, id }) {
  const projects = getProjects()
  const project = projects.find(p => p.slug === params.slug)
  if (!project) return fallbackImage()
  // render layout with project data
}
```

Category colour helper:
```ts
const CATEGORY_COLOUR: Record<string, { bg: string; text: string; border: string }> = {
  "AI Agents":      { bg: "rgba(99,102,241,0.15)", text: "#6366F1", border: "rgba(99,102,241,0.4)" },
  "AI Automation":  { bg: "rgba(99,102,241,0.15)", text: "#6366F1", border: "rgba(99,102,241,0.4)" },
  "Full-Stack + AI":{ bg: "rgba(0,212,255,0.12)",  text: "#00D4FF", border: "rgba(0,212,255,0.35)" },
  "Full-Stack":     { bg: "rgba(0,212,255,0.12)",  text: "#00D4FF", border: "rgba(0,212,255,0.35)" },
}
```
