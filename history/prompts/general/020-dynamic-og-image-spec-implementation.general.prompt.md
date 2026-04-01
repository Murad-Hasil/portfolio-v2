---
id: "020"
title: Dynamic OG Image — Spec & Implementation
stage: general
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 004-og-image
branch: main
user: Murad Hasil
command: manual implementation request
labels: ["og-image","opengraph","dynamic","fr-015","skills-manifest","projects-manifest","next-js","imageresponse"]
links:
  spec: specs/004-og-image/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - Portfolio-Spec.md
  - .specify/memory/constitution.md
  - specs/004-og-image/spec.md
  - specs/004-og-image/plan.md
  - specs/004-og-image/tasks.md
  - frontend/next.config.ts
  - frontend/src/app/opengraph-image.tsx
  - frontend/src/app/projects/[slug]/opengraph-image.tsx
tests:
  - Playwright: /opengraph-image — skills from skills-manifest.json verified
  - Playwright: /projects/crm-digital-fte/opengraph-image — project data verified
  - Playwright: /projects/todo-cloud-ai/opengraph-image — project data verified
  - Build: next build clean (zero errors)
---

## Prompt

Ready — OG image feature implement karo. Pehle docs (Portfolio-Spec.md, constitution.md, specs/004-og-image/), phir implementation.

## Response snapshot

Full spec-driven flow:

**Documentation:**
1. Portfolio-Spec.md — FR-015 added, Phase 10 section (23.1 homepage, 23.2 per-project, 23.3 checklist), Phase 9 checklist closed ✅
2. constitution.md — v1.4.0: OG image rule added to Principle III (design tokens, fs reads, nodejs runtime, outputFileTracingRoot)
3. specs/004-og-image/ — spec.md (US-1/US-2, acceptance criteria, design spec with layouts), plan.md (edge→nodejs decision, outputFileTracingRoot decision), tasks.md (5 tasks, all ✅)

**Implementation:**
- `next.config.ts` — `outputFileTracingRoot: path.join(__dirname, "../")` added for Vercel bundle
- `opengraph-image.tsx` — `runtime="nodejs"`, `getTopSkills()` reads `skills-manifest.json`, top 6 `advanced` skills as alternating indigo/cyan tags
- `projects/[slug]/opengraph-image.tsx` — new file: `async` default export, `await params`, `getProjects()` reads `projects-manifest.json`, per-project layout with category badge, title, 4 tech tags, first metric, bottom URL bar

**Bugs caught & fixed:**
1. Next.js 15+ `params` is a Promise — initial sync access returned `undefined` slug → fallback showed. Fixed by making export `async` and `await params`.
2. `✦` Unicode (U+2736) not supported by OG renderer's default font → replaced with `→` (U+2192) which renders correctly.

**Verification results:**
- Homepage: OpenAI Agents SDK, OpenAI API (GPT-4o), Gemini API, MCP, RAG Systems, Autonomous AI Agents — all from manifest ✅
- CRM project: [AI Agents] indigo badge, title, 4 tech tags, → metric ✅
- Todo project: [Full-Stack + AI] cyan badge, title, 4 tech tags, → metric ✅
- `next build` clean ✅

## Outcome

- ✅ Impact: Every shared link (LinkedIn, WhatsApp, Twitter) now shows a branded, content-accurate preview card
- 🧪 Tests: 3 Playwright screenshots + build check — all passing
- 📁 Files: 8 files created/modified
- 🔁 Next prompts: Portfolio complete — commit + deploy to Vercel
- 🧠 Reflection: Next.js 15+ async params is a common gotcha for OG image files in dynamic routes. Always make the default export `async` and `await params` when using dynamic route segments.

## Evaluation notes (flywheel)

- Failure modes observed: (1) params sync access in Next.js 15+ → undefined slug, silent fallback. (2) Unicode special chars broken in OG renderer fonts.
- Graders run and results (PASS/FAIL): Playwright visual check PASS, build PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): git commit + push → verify Vercel deployment shows correct OG images via opengraph.xyz
