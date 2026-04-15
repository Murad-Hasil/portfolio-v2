---
id: "0004"
title: Dynamic OG Image Implementation
stage: green
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 004-og-image
branch: main
user: brownie
command: /sp.implement
labels: ["green","og-image","seo","opengraph","implementation","004-og-image"]
links:
  spec: specs/004-og-image/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/next.config.ts
  - frontend/src/app/opengraph-image.tsx
  - frontend/src/app/projects/[slug]/opengraph-image.tsx
tests:
  - "GET /opengraph-image: 1200×630 PNG with real skills from skills-manifest.json (PASS)"
  - "GET /projects/crm-digital-fte/opengraph-image: [AI Agents] indigo badge, title, 4 tech tags, metric (PASS)"
  - "GET /projects/todo-cloud-ai/opengraph-image: [Full-Stack + AI] cyan badge, title, 4 tech tags, metric (PASS)"
  - "GET /projects/personal-ai-employee/opengraph-image: [AI Automation] indigo badge (PASS)"
  - "GET /projects/physical-ai-textbook/opengraph-image: [Full-Stack + AI] cyan badge (PASS)"
  - "Unknown slug: generic fallback image 'Murad Hasil — Portfolio' (PASS)"
  - "No hardcoded skill names, project titles, or tech strings in any opengraph-image.tsx (PASS)"
  - "next build clean: zero TypeScript/ESLint errors, all 4 slugs in build output (PASS)"
  - "Commit: 9cdb63e — feat: availability badge + dynamic OG image (v1.4)"
---

## Prompt

/sp.implement 004-og-image

Execute all 5 tasks from specs/004-og-image/tasks.md. Implement dynamic OG images for homepage and all project case study pages.

## Response snapshot

All 5 tasks executed. Dynamic OG images shipped as part of commit 9cdb63e on 2026-04-02 (v1.4).

**Task 1 — next.config.ts** ✅
```typescript
import path from "path";
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: { remotePatterns: [...] }
};
```
Bundles `context/` directory one level above `frontend/` into Vercel serverless function.

**Task 2 — opengraph-image.tsx (homepage)** ✅
- `export const runtime = "nodejs"` — enables fs access
- `getTopSkills()`: reads `skills-manifest.json`, returns all `advanced` skills, max 6
- Layout: 3px gradient top bar, grid overlay, eyebrow text, "Murad Hasil" name, subtitle row, tag pills (alternating indigo/cyan), bottom bar (email + site URL)
- Tag colours: odd index=indigo tint, even index=cyan tint

**Task 3 — projects/[slug]/opengraph-image.tsx (new)** ✅
Complete per-project OG image handler:
- `runtime = "nodejs"`, `size = {width: 1200, height: 630}`, `contentType = "image/png"`
- `getProjects()`: reads `context/projects-manifest.json` via `path.resolve(process.cwd(), "..", "context", "projects-manifest.json")`
- `CATEGORY_STYLE` map: AI Agents/AI Automation=indigo (#6366f1), Full-Stack+AI/Full-Stack=cyan (#00d4ff)
- Layout: gradient bar, grid overlay, category badge, title (truncated 60 chars), description (truncated 110 chars), 4 tech tags, first metric with → prefix, bottom email + projects URL
- Fallback: unknown slug → generic dark card "Murad Hasil — Portfolio"
- Bug fixed: Next.js 15 `params` is a `Promise<{slug: string}>` — added `async/await` on params
- Bug fixed: `✦` unicode not rendered by ImageResponse — replaced with `→` arrow

**Task 4 — next build** ✅
Zero TypeScript errors, zero ESLint errors. All 4 project slugs appear in build output under `/projects/[slug]`.

**Task 5 — Playwright Verification** ✅
All 4 project OG images verified with correct category badges, titles, tech tags, and metrics. Homepage OG shows 6 advanced skills from skills-manifest.json (OpenAI Agents SDK, OpenAI API, Gemini API, MCP, RAG Systems, Autonomous AI Agents).

## Outcome

- ✅ Impact: Every social share now shows a professional 1200×630 preview card — 4 unique per-project cards + 1 dynamic homepage card, all data-driven from context/ files
- 🧪 Tests: All 9 acceptance criteria pass; zero build errors; Playwright verified all 4 project OGs
- 📁 Files: 3 files created/modified (next.config.ts, opengraph-image.tsx, projects/[slug]/opengraph-image.tsx)
- 🔁 Next prompts: v1.4 complete. Update constitution to v1.5.0 to reflect all shipped features.
- 🧠 Reflection: Two bugs discovered and fixed during implementation — Next.js 15 params Promise requirement and unicode rendering limitation in ImageResponse. Both fixed without workarounds.

## Evaluation notes (flywheel)

- Failure modes observed: (1) Next.js 15 params must be awaited as Promise — not in docs clearly. (2) Unicode ✦ char not rendered by ImageResponse Satori engine — replaced with → safely.
- Graders run and results (PASS/FAIL): All acceptance criteria PASS; Playwright PASS; build PASS
- Prompt variant (if applicable): null
- Next experiment: Verify LinkedIn/WhatsApp share previews show correct OG images (requires testing with actual link sharing)
