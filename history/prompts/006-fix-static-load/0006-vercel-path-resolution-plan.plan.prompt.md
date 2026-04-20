---
id: "0006"
title: Vercel Path Resolution Plan
stage: plan
date: 2026-04-20
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.plan
labels: ["plan","vercel","path-resolution","monorepo","outputFileTracingRoot","og-images"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/plan.md
  - specs/006-fix-static-load/research.md
tests:
  - null
---

## Prompt

Feature: 006-fix-static-load
Spec: specs/006-fix-static-load/spec.md

**Root cause:**
`path.resolve(process.cwd(), "context", filename)` in `page.tsx` (line 17).
Vercel builds from `frontend/` as root → `context/` is unreachable.
Same bug exists in `/api/projects/route.ts` and `/api/skills/route.ts`.

**Fix: Add `vercel.json` at monorepo root**

```json
{
  "buildCommand": "npm run build --prefix frontend",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install --prefix frontend",
  "framework": "nextjs"
}
```

This makes Vercel build from repo root → process.cwd() = monorepo root → context/ accessible. No code changes needed in page.tsx.

Also required (manual): Change Vercel dashboard Root Directory from frontend → .

Files touched:

CREATE vercel.json at monorepo root
VERIFY frontend/src/app/page.tsx — no change needed
VERIFY frontend/src/app/api/projects/route.ts — no change needed
VERIFY frontend/src/app/api/skills/route.ts — no change needed

## Response snapshot

Plan written to `specs/006-fix-static-load/plan.md`. Key findings beyond the user's description:

1. **OG image routes use `..` path** — `opengraph-image.tsx` and `projects/[slug]/opengraph-image.tsx` use `path.resolve(process.cwd(), "..", "context", file)`. After the `vercel.json` fix shifts CWD to repo root, this `..` would resolve ABOVE the repo root and break OG images. Both files must be fixed (remove `..`).

2. **`outputFileTracingRoot` missing from `next.config.ts`** — Research.md (2026-04-17) incorrectly claimed it was already set. It was not. Constitution Principle III mandates it. Without it, Vercel won't bundle `context/` into serverless function packages — API routes and OG images fail at runtime even after the build-time CWD fix.

3. **Manual dashboard step is blocking** — The `vercel.json` has no effect until Vercel dashboard Root Directory is changed from `frontend` to `.`.

**Final scope (5 files + 1 manual step):**
- CREATE `vercel.json` at repo root
- MODIFY `frontend/next.config.ts` — add `outputFileTracingRoot: path.resolve(__dirname, "..")`
- FIX `frontend/src/app/opengraph-image.tsx` — remove `..` from path call
- FIX `frontend/src/app/projects/[slug]/opengraph-image.tsx` — same
- VERIFY `page.tsx`, `api/projects/route.ts`, `api/skills/route.ts` — no change needed
- MANUAL: Vercel dashboard Root Directory → `.`

## Outcome

- ✅ Impact: Plan captures all 5 affected files; corrects stale research.md claim; adds OG image regression risk that was not in original user description.
- 🧪 Tests: No automated tests — manual Vercel preview deploy verification.
- 📁 Files: specs/006-fix-static-load/plan.md, specs/006-fix-static-load/research.md
- 🔁 Next prompts: /sp.tasks to generate task list; then /sp.implement to execute
- 🧠 Reflection: Scope grew from 1 file to 5 because path patterns were inconsistent across the codebase — half assumed CWD = `frontend/`, half assumed CWD = repo root. The `vercel.json` fix makes both consistent at repo root.

## Evaluation notes (flywheel)

- Failure modes observed: Research.md made a false claim about outputFileTracingRoot being set — plan verification caught this by reading the actual file.
- Graders run and results (PASS/FAIL): Constitution Check gate ran — Principle III violation identified and incorporated into plan.
- Prompt variant (if applicable): null
- Next experiment: Add a build-time assertion that throws a clear ENOENT error with helpful message when context/*.json not found, to catch future environment mismatches immediately.
