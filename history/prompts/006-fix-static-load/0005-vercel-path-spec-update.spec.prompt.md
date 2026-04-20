---
id: "0005"
title: Vercel Path Resolution Spec Update
stage: spec
date: 2026-04-20
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.specify
labels: ["spec","vercel","path-resolution","monorepo","static-load"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/spec.md
  - specs/006-fix-static-load/checklists/requirements.md
tests:
  - null
---

## Prompt

Feature: 006-fix-static-load

The Projects section on Vercel shows blank — stuck on "Loading projects...".

Root cause: `page.tsx` reads `context/projects-manifest.json` using `process.cwd()`.
On Vercel, `cwd` = `frontend/` directory. But `context/` lives at the monorepo root.
File not found → build fails silently → empty projects array → blank section.

**In scope:** Fix path resolution so `context/*.json` files are readable on Vercel.
**Out of scope:** UI changes, new features, backend, styling.

**Success criteria:**
- [ ] Vercel production shows 4 project cards
- [ ] Skills section data also loads correctly
- [ ] `context/` folder stays at monorepo root (no restructuring)
- [ ] `page.tsx` stays a Server Component (no client-side fetch)

## Response snapshot

Updated `specs/006-fix-static-load/spec.md`:
- Status: Implemented → In Progress
- Input updated to reflect the Vercel monorepo path mismatch
- Added edge case: build working directory ≠ repo root
- Added FR-008: manifest resolution must succeed regardless of build-time working directory
- Added SC-006: Vercel production shows all 4 project cards + skills with zero blanks
- Added SC-007: manifest resolution succeeds when build is launched from `frontend/`
- Added Assumptions documenting the `process.cwd()` = `frontend/` Vercel constraint

Updated `specs/006-fix-static-load/checklists/requirements.md` notes section.

## Outcome

- ✅ Impact: Spec now accurately captures the Vercel deployment failure and scopes the fix to path resolution only — no UI or API changes.
- 🧪 Tests: No tests changed — spec update only.
- 📁 Files: specs/006-fix-static-load/spec.md, specs/006-fix-static-load/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to update the implementation plan with the path resolution approach
- 🧠 Reflection: The original spec was marked "Implemented" prematurely — the Vercel build environment revealed a gap between local dev (cwd = repo root) and production (cwd = frontend/).

## Evaluation notes (flywheel)

- Failure modes observed: Spec marked "Implemented" before verifying in all deployment environments.
- Graders run and results (PASS/FAIL): Checklist re-validated — all items pass with new requirements added.
- Prompt variant (if applicable): null
- Next experiment: Add a build-time guard that throws a clear error when manifest files are not found, so future environment mismatches surface immediately.
