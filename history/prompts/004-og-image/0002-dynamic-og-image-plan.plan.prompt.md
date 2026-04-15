---
id: "0002"
title: Dynamic OG Image Plan
stage: plan
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 004-og-image
branch: main
user: brownie
command: /sp.plan
labels: ["plan","og-image","seo","opengraph","nodejs-runtime","004-og-image"]
links:
  spec: specs/004-og-image/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-og-image/plan.md
tests:
  - "None (plan stage — no code written yet)"
---

## Prompt

/sp.plan 004-og-image

Architecture plan for dynamic OG images. Key decision: runtime = "edge" vs "nodejs" for opengraph-image.tsx files.

## Response snapshot

Plan created at `specs/004-og-image/plan.md`.

**Key Decision — runtime: "edge" vs "nodejs"**:
- `"edge"`: No Node.js APIs (no `fs`, no `path`). Cannot read files. Reading context/ files would require bundling them as imports or using fetch(). Rejected — would require hardcoding or complex bundling.
- `"nodejs"`: Full Node.js APIs available. `fs.readFileSync` works. `outputFileTracingRoot` bundles `context/` directory in Vercel serverless function. CHOSEN.
- Decision: `export const runtime = "nodejs"` in both opengraph-image.tsx files.

**File change plan**:
1. `frontend/next.config.ts` — add `outputFileTracingRoot: path.join(__dirname, "../")` so Vercel bundles `context/` one level above `frontend/`
2. `frontend/src/app/opengraph-image.tsx` — change runtime to "nodejs", add `fs.readFileSync(skills-manifest.json)`, replace hardcoded tags with `getTopSkills()` returning all `advanced` skills max 6, alternating indigo/cyan colours
3. `frontend/src/app/projects/[slug]/opengraph-image.tsx` — new file: runtime="nodejs", `getProjects()` reads projects-manifest.json, `generateImageMetadata` for alt text, layout: gradient bar, category badge, title, description, 4 tech tags, first metric, bottom bar. Fallback for unknown slug.

**Constitution Check**: ALL principles verified (Spec-First ✅, Content Authenticity ✅ — all data from context/, Design System ✅ — only defined tokens, Type Safety ✅, Accessibility ✅).

## Outcome

- ✅ Impact: Architecture plan with justified runtime decision — nodejs required for fs access
- 🧪 Tests: No tests at plan stage
- 📁 Files: specs/004-og-image/plan.md
- 🔁 Next prompts: /sp.tasks 004-og-image
- 🧠 Reflection: The `outputFileTracingRoot` + `runtime = "nodejs"` combination is the correct approach for reading files outside the Next.js app directory. This is a non-obvious configuration that must be documented to prevent future agents from using hardcoded data instead.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check PASS
- Prompt variant (if applicable): null
- Next experiment: /sp.tasks — generate 5-task implementation list
