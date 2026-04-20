---
id: "0007"
title: Vercel Path Resolution Tasks
stage: tasks
date: 2026-04-20
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.tasks
labels: ["tasks","vercel","path-resolution","monorepo","og-images","outputFileTracingRoot"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/tasks.md
tests:
  - null
---

## Prompt

Feature: 006-fix-static-load
Plan: specs/006-fix-static-load/plan.md

1. **Create `vercel.json`** at monorepo root with build/output/install config pointing to `frontend/`.
2. **Verify `page.tsx`** — confirm `process.cwd()` + `"context"` path works from monorepo root.
3. **Verify API routes** — `api/projects/route.ts` and `api/skills/route.ts` use same pattern, confirm no change needed after root fix.
4. **Local build test** — run `npm run build --prefix frontend` from monorepo root, confirm no ENOENT errors.
5. **Document manual step** — Vercel dashboard → Settings → Root Directory → change `frontend` to `.` → redeploy.
6. **Smoke test** — confirm 4 project cards and skills data visible on Vercel preview URL.

## Response snapshot

Generated `specs/006-fix-static-load/tasks.md` — 16 tasks across 5 phases:

- **T001** (Phase 1): Grep `process.cwd()` across `frontend/src/` to confirm scope is exactly 5 files
- **T002–T006** (Phase 2, Foundational): Create `vercel.json` + add `outputFileTracingRoot` to `next.config.ts` + fix both OG image path calls + local build test
- **T007–T011** (Phase 3, US1): Verify `page.tsx` + `api/projects/route.ts`, manual Vercel dashboard Root Directory change, push/deploy, smoke test 4 project cards
- **T012–T013** (Phase 4, US2): Verify `api/skills/route.ts`, smoke test skills section
- **T014–T016** (Phase 5, Polish): OG image regression check, production merge, spec status update

Key structure decisions:
- T003, T004, T005 marked [P] — three different files, apply simultaneously
- T009 (manual dashboard step) flagged as most likely failure point
- T006 (local build) is the confidence gate before any Vercel deployment
- Both user stories (US1, US2) are served by the same foundational changes

## Outcome

- ✅ Impact: 16 immediately-executable tasks; critical path is clear; manual dashboard step explicitly gated before deployment
- 🧪 Tests: No automated tests in scope — acceptance via browser smoke tests
- 📁 Files: specs/006-fix-static-load/tasks.md
- 🔁 Next prompts: /sp.implement to execute T001–T016
- 🧠 Reflection: T009 (manual Vercel dashboard change) is the highest-risk step and cannot be automated — flagged as blocking gate in tasks.md.

## Evaluation notes (flywheel)

- Failure modes observed: None during task generation.
- Graders run and results (PASS/FAIL): All 16 tasks follow required format (checkbox + ID + [P]? + [Story]? + description with file path).
- Prompt variant (if applicable): null
- Next experiment: After T015 ships, add a build-time assertion in readJson that throws a descriptive error when the file is not found, to catch future environment regressions immediately.
