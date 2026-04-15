---
id: "0003"
title: Dynamic OG Image Tasks
stage: tasks
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 004-og-image
branch: main
user: brownie
command: /sp.tasks
labels: ["tasks","og-image","seo","opengraph","004-og-image"]
links:
  spec: specs/004-og-image/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-og-image/tasks.md
tests:
  - "Playwright MCP: /opengraph-image shows real skills from skills-manifest.json"
  - "Playwright MCP: /projects/crm-digital-fte/opengraph-image shows [AI Agents] badge + title + 4 tech tags + metric"
  - "next build clean: zero TypeScript/ESLint errors"
---

## Prompt

/sp.tasks 004-og-image

Generate task list for dynamic OG images. 5 tasks:
1. Update next.config.ts with outputFileTracingRoot
2. Update homepage opengraph-image.tsx (nodejs runtime + dynamic skills)
3. Create projects/[slug]/opengraph-image.tsx (new file, per-project)
4. next build clean verification
5. Playwright MCP screenshot verification

## Response snapshot

Generated `specs/004-og-image/tasks.md` with 5 tasks:

- **Task 1** — Update `next.config.ts`: add `import path from "path"` + `outputFileTracingRoot: path.join(__dirname, "../")`. Test: `next build` still clean.
- **Task 2** — Update `frontend/src/app/opengraph-image.tsx`: runtime="nodejs", add fs+path imports, `getTopSkills()` reads skills-manifest.json returns advanced skills max 6, replace hardcoded array. Tags alternate indigo (odd) / cyan (even).
- **Task 3** — Create `frontend/src/app/projects/[slug]/opengraph-image.tsx`: nodejs runtime, 1200×630, `getProjects()` reads projects-manifest.json, `generateImageMetadata` for alt, layout with gradient bar + category badge + title + description (truncated 110 chars) + 4 tech tags + first metric + bottom bar. Category→colour map. Generic fallback for unknown slug.
- **Task 4** — `next build` clean: zero TS errors, zero ESLint errors, all 4 project slugs in build output.
- **Task 5** — Playwright MCP: homepage OG shows real skills; crm-digital-fte OG shows [AI Agents] badge; todo-cloud-ai OG shows [Full-Stack + AI] (cyan). Bug noted: Next.js 15+ params is a Promise — must use async/await.

## Outcome

- ✅ Impact: 5-task plan, ordered correctly (config → homepage → per-project → build → verify)
- 🧪 Tests: Task 5 Playwright covers all 7 acceptance criteria
- 📁 Files: specs/004-og-image/tasks.md
- 🔁 Next prompts: /sp.implement 004-og-image
- 🧠 Reflection: Task order matters: config must come first (outputFileTracingRoot needed for build). Task 3 (per-project) is the most complex and highest impact — should be verified individually before Task 5.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): task format PASS
- Prompt variant (if applicable): null
- Next experiment: /sp.implement — note the Next.js 15 params Promise issue early in implementation
