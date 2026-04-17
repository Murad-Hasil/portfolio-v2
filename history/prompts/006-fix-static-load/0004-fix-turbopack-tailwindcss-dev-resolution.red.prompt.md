---
id: "0004"
title: Fix Turbopack Tailwindcss Dev Resolution
stage: red
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.phr
labels: ["turbopack", "tailwindcss", "outputFileTracingRoot", "dev-server", "bugfix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/next.config.ts
  - frontend/src/__tests__/error.test.tsx
  - specs/006-fix-static-load/tasks.md
tests:
  - npx tsc --noEmit (zero errors)
  - npm run build (homepage ○ Static confirmed)
---

## Prompt

npm run dev hang ho raha tha Claude ke sath — user ne output copy karke diya. Error: `Can't resolve 'tailwindcss' in '/home/brownie/projects/portfolio-v2'`. User ne permanent professional fix manga, koi jugaad nahi.

Full session context:
- `npx tsc --noEmit` → error in `error.test.tsx` (Error class shadowing)
- `npm run build` → pass, homepage `○ (Static)` confirmed
- `npm run dev` → Turbopack CSS resolution error on tailwindcss, causing dev server crash loop → WSL2 resource exhaustion → Claude hang
- Root cause: `outputFileTracingRoot: path.join(__dirname, "../")` in `next.config.ts` caused Turbopack to treat repo root as workspace root for CSS module resolution; `tailwindcss` was only in `frontend/node_modules/`, not root
- `frontend/context/` already had the manifest files (via `sync-context.sh`), so `outputFileTracingRoot` was never needed
- Fix: remove `outputFileTracingRoot` (and the failed `turbopack.resolveAlias` attempt) from `next.config.ts`

## Response snapshot

Identified root cause: `outputFileTracingRoot` was added unnecessarily — `frontend/context/` already has the manifest files via `sync-context.sh`. Removing it fixed Turbopack's CSS `@import "tailwindcss"` resolution. Also fixed `error.test.tsx` where importing `Error` component shadowed the global `Error` class.

## Outcome

- ✅ Impact: `npm run dev` now works without hanging; `npm run build` still passes; homepage remains `○ (Static)`; TypeScript zero errors
- 🧪 Tests: `npx tsc --noEmit` (zero errors), `npm run build` (static homepage confirmed)
- 📁 Files: `frontend/next.config.ts` (removed outputFileTracingRoot + turbopack.resolveAlias), `frontend/src/__tests__/error.test.tsx` (renamed import to avoid Error class shadow), `specs/006-fix-static-load/tasks.md` (T001–T018 marked complete)
- 🔁 Next prompts: git commit + push; Vercel preview visual verification (T019–T022)
- 🧠 Reflection: `outputFileTracingRoot` is only needed when manifest files are OUTSIDE `frontend/`; since `sync-context.sh` already copies them into `frontend/context/`, the option was redundant and harmful

## Evaluation notes (flywheel)

- Failure modes observed: First attempted `turbopack.resolveAlias` fix which only affects JS imports, not CSS pipeline — wasted one iteration. Should have identified CSS vs JS resolution difference immediately.
- Graders run and results (PASS/FAIL): build PASS, tsc PASS, dev server PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): When `outputFileTracingRoot` is set, add a comment explaining WHY it exists and what would break if removed — prevents future re-introduction
