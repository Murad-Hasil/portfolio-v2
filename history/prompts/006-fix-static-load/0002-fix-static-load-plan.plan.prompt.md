---
id: "0002"
title: Fix Static Load Plan
stage: plan
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.plan
labels: ["plan","static-load","next.js","server-component","props"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/plan.md
  - specs/006-fix-static-load/research.md
tests:
  - Constitution Check — all 7 gates PASS
---

## Prompt

/sp.plan 006-fix-static-load

## Response snapshot

- Ran setup-plan.sh — plan.md created at specs/006-fix-static-load/plan.md
- Filled Technical Context: TypeScript 5.x, Next.js 16.2.1 App Router, fs.readFileSync at build time
- Constitution Check: all 7 principles pass — no violations
- Phase 0 research.md: 3 decisions documented (loading strategy, type exports, API route preservation). No NEEDS CLARIFICATION.
- No data-model.md needed — no new entities introduced
- Agent context updated via update-agent-context.sh claude

## Outcome

- ✅ Impact: Plan confirms frontend-only change; no backend involvement; homepage classified as ○ Static
- 🧪 Tests: Constitution Check PASS (all 7 gates)
- 📁 Files: plan.md + research.md created
- 🔁 Next prompts: /sp.tasks 006-fix-static-load
- 🧠 Reflection: Server Component props pattern is idiomatic Next.js App Router — no new libraries needed

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check PASS
- Prompt variant (if applicable): retroactive plan
- Next experiment: none
