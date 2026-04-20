---
id: "0003"
title: Fix Static Load Tasks
stage: tasks
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.tasks
labels: ["tasks","static-load","projects","skills","next.js"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/tasks.md
tests:
  - TypeScript check (npx tsc --noEmit)
  - Build classification check (npm run build → ○ Static)
  - Playwright visual verification (1440px + 375px)
---

## Prompt

/sp.tasks 006-fix-static-load

## Response snapshot

- Generated specs/006-fix-static-load/tasks.md with 22 tasks across 5 phases
- Phase 1: Setup (T001–T003) — manifest and Server Component verification
- Phase 2: Foundational (T004–T005) — type exports (parallel)
- Phase 3 US1: Projects instant load (T006–T012) — remove useEffect, pass initialProjects prop
- Phase 4 US2: Skills instant load (T013–T018) — remove useEffect, pass initialData prop
- Phase 5: Polish (T019–T022) — Playwright screenshots + network verification

## Outcome

- ✅ Impact: 22 tasks covering both user stories; all immediately executable
- 🧪 Tests: tsc --noEmit + npm run build + Playwright + DevTools network check
- 📁 Files: tasks.md created
- 🔁 Next prompts: /sp.implement 006-fix-static-load
- 🧠 Reflection: US1 and US2 share page.tsx modification — recommended to deliver both together in one deployment

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): format validation PASS (all tasks have checkbox, ID, labels, paths)
- Prompt variant (if applicable): retroactive tasks
- Next experiment: none
