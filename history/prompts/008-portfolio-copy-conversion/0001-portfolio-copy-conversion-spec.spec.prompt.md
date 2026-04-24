---
id: "0001"
title: Portfolio Copy Conversion Spec
stage: spec
date: 2026-04-23
surface: agent
model: claude-sonnet-4-6
feature: 008-portfolio-copy-conversion
branch: 008-portfolio-copy-conversion
user: Murad Hasil
command: /sp.specify Portfolio conversion copy update — Hero H1 rewrite, About stats client language, Services rename, Projects framing shift, CTA rewrite. No projects removed. All 4 stay.
labels: ["spec", "copy", "conversion", "portfolio", "hero", "about", "services", "projects", "cta"]
links:
  spec: specs/008-portfolio-copy-conversion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-portfolio-copy-conversion/spec.md
  - specs/008-portfolio-copy-conversion/checklists/requirements.md
tests:
  - n/a
---

## Prompt

Portfolio conversion copy update — Hero H1 rewrite, About stats client language, Services rename, Projects framing shift, CTA rewrite. No projects removed. All 4 stay. Based on conversion audit (score 5.5/10) and ChatGPT prompt analysis.

Full context: User analyzed a ChatGPT-generated rewrite prompt and asked to follow SDD workflow (/sp.specify → /sp.plan → /sp.tasks → /sp.implement). Key constraints confirmed in conversation: no projects removed, all 4 stay in featured grid, no pricing section, no discounted work section on portfolio, About bio unchanged, routing IDs unchanged.

## Response snapshot

Spec written with 5 user stories (P1–P3), 15 functional requirements, 7 success criteria, edge cases, key entities, assumptions, and out-of-scope list.

Two open decisions flagged (not blockers for planning):
- FR-004: Tech pills — remove or replace with outcome labels
- FR-005: TypeAnimation — remove or replace with outcome phrases
- FR-007: About stats new values need user approval

Checklist created at specs/008-portfolio-copy-conversion/checklists/requirements.md — all items pass.

## Outcome

- ✅ Impact: Spec written covering all 5 sections (Hero, About, Services, Projects, CTA) with clear boundaries and zero ambiguity on what changes vs. what stays
- 🧪 Tests: n/a — spec stage
- 📁 Files: specs/008-portfolio-copy-conversion/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan — then /sp.tasks — then /sp.implement
- 🧠 Reflection: Critical to have filtered the ChatGPT prompt before speccing — it would have changed bio, removed projects, added pricing anchors, and added discounted client section, all of which conflict with user intent or codebase structure

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): checklist — all pass
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Resolve FR-004, FR-005, FR-007 decisions with user before /sp.plan
