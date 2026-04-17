---
id: "0001"
title: Fix Static Load Spec
stage: spec
date: 2026-04-17
surface: agent
model: claude-sonnet-4-6
feature: 006-fix-static-load
branch: 006-fix-static-load
user: Murad Hasil
command: /sp.specify
labels: ["spec","static-load","projects","skills","next.js","performance"]
links:
  spec: specs/006-fix-static-load/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-fix-static-load/spec.md
  - specs/006-fix-static-load/checklists/requirements.md
tests:
  - Spec quality checklist (all items pass)
---

## Prompt

/sp.specify Fix projects and skills section loading spinners by eliminating client-side data fetching. Both Projects.tsx and Skills.tsx were using useEffect + fetch("/api/...") to load static JSON data, causing visible loading states on every page load. The fix: make page.tsx (Server Component) read the manifest JSON files at build time and pass data as props to Projects and Skills components. Remove all useEffect, fetch, loading state, and error state from both components. Export necessary types (Project, SkillsData) from the components for use in page.tsx. Result: home page becomes fully static (○ Static in Next.js build output), projects and skills render instantly with zero loading spinners.

## Response snapshot

- Created branch 006-fix-static-load via create-new-feature.sh
- Wrote specs/006-fix-static-load/spec.md with 2 user stories (US1: Projects instant load P1, US2: Skills instant load P2), 7 functional requirements, 5 success criteria
- Created specs/006-fix-static-load/checklists/requirements.md — all items pass
- No NEEDS CLARIFICATION markers — all decisions were clear

## Outcome

- ✅ Impact: Spec fully documents the client trust problem (loading spinner) and the build-time solution with clear measurable success criteria
- 🧪 Tests: Spec quality checklist — all 16 items pass
- 📁 Files: spec.md + checklists/requirements.md created
- 🔁 Next prompts: /sp.plan 006-fix-static-load
- 🧠 Reflection: Retroactive spec for already-implemented feature — all decisions were provable from existing code

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): spec checklist PASS
- Prompt variant (if applicable): retroactive spec
- Next experiment: none
