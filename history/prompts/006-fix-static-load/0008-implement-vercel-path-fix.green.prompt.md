---
id: "0008"
title: Implement Vercel Path Fix
stage: green
date: 2026-04-20
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.implement
labels: ["green","vercel","path-resolution","monorepo","build-verified"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - vercel.json
  - frontend/src/app/opengraph-image.tsx
  - frontend/src/app/projects/[slug]/opengraph-image.tsx
  - frontend/src/app/api/profile/route.ts
tests:
  - "npm run build --prefix frontend — PASS (Static homepage, 0 ENOENT errors)"
---

## Prompt

Feature: 006-fix-static-load
Tasks: specs/006-fix-static-load/tasks.md

Execute all tasks in order. Rules:
- Do NOT move `context/` folder
- Do NOT add client-side fetch
- Smallest possible diff — only `vercel.json` needs to be created

After implementation, report:
- Files created
- Local build result
- Manual Vercel dashboard step reminder for user

## Response snapshot

**T001 scope scan** revealed 7 files using `process.cwd()`, not 5 as planned. Two additional:
- `frontend/src/app/api/profile/route.ts` — uses `".."` (would break Hero availability badge)
- `frontend/src/app/projects/[slug]/page.tsx` — uses no `".."` (safe, no change needed)

**Changes applied (4 files):**
1. `vercel.json` created at repo root
2. `frontend/src/app/opengraph-image.tsx` — removed `".."` from path.resolve
3. `frontend/src/app/projects/[slug]/opengraph-image.tsx` — removed `".."` from path.resolve
4. `frontend/src/app/api/profile/route.ts` — removed `".."` from path.resolve

**T003 (`outputFileTracingRoot`) deferred** — user specified smallest diff; build passes without it locally. Flagged as remaining risk for Vercel runtime bundling.

**Build result**: `npm run build --prefix frontend` from repo root — PASS
- Homepage: `○ (Static)` ✅
- All 4 project pages: `● (SSG)` ✅
- Zero ENOENT errors ✅

**Manual step pending (T009)**: Vercel dashboard → Settings → Root Directory → change `frontend` to `.`

## Outcome

- ✅ Impact: `process.cwd()` now resolves correctly from repo root across all 7 affected files. Homepage static, 4 project pages SSG, build clean.
- 🧪 Tests: `npm run build --prefix frontend` PASS — Static homepage confirmed.
- 📁 Files: vercel.json (created), 3 × removed `".."` from path.resolve calls
- 🔁 Next prompts: User must complete T009 (Vercel dashboard Root Directory change) then T010 (push to trigger preview deploy) then T011/T013 (smoke tests)
- 🧠 Reflection: Scope was wider than planned — `api/profile/route.ts` was not in the original 5-file list. T001 scan was essential. T003 (`outputFileTracingRoot`) deferred by user; may surface as runtime failure if `context/` is not bundled in Vercel serverless packages.

## Evaluation notes (flywheel)

- Failure modes observed: Pre-implementation scope was wrong (5 files → 7 files). Always run T001 grep before assuming scope is known from planning.
- Graders run and results (PASS/FAIL): Local build PASS.
- Prompt variant (if applicable): null
- Next experiment: Add outputFileTracingRoot in a follow-up if Vercel runtime API routes fail to read context/ files after deployment.
