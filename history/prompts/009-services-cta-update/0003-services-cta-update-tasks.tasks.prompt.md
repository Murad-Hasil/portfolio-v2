---
id: "0003"
title: Services CTA Update Tasks
stage: tasks
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 009-services-cta-update
branch: 009-services-cta-update
user: Murad Hasil
command: /sp.tasks
labels: ["tasks", "copy", "cta", "services", "about", "hero", "contact", "footer"]
links:
  spec: specs/009-services-cta-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/009-services-cta-update/tasks.md
  - history/prompts/009-services-cta-update/0003-services-cta-update-tasks.tasks.prompt.md
tests:
  - null
---

## Prompt

Feature: 009-portfolio-services-cta-update
Read plan at: specs/009-portfolio-services-cta-update/plan.md
Read spec at:  specs/009-portfolio-services-cta-update/spec.md

Generate tasks.md. Each task must include:
  - Exact file path
  - Exact before-string to find (copy from current file)
  - Exact after-string to replace with
  - What must NOT change (protected elements)

Group tasks for maximum parallelism. Suggested groups:
  Group A (parallel): T001 Hero CTA, T002 Footer Fiverr, T003 About bio para 3
  Group B (parallel): T004 Contact Fiverr CTA, T005 About stats
  Group C (after A+B): T006 Services.tsx full rewrite (type + data + render — largest task)
  Group D: Final — tsc verify, visual check

Hard rules for every task:
  1. Read file before editing
  2. Verify before-string exists before writing
  3. Do NOT change: routing ids, Zod schema, service IDs, bio paras 1/2/4, CTA button hrefs other than Hero primary
  4. Do NOT add comments or refactor surrounding code
  5. Each task independently verifiable

## Response snapshot

Generated tasks.md at specs/009-services-cta-update/tasks.md with 7 tasks across 4 groups: Group A (T001 Hero CTA swap, T002 Footer Fiverr link, T003 About bio para 3 — all parallel), Group B (T004 Contact Fiverr block insert, T005 About stats data+render — parallel; T005 sequential after T003), Group C (T006 Services full rewrite — 3 sub-steps: type, data, card render), Group D (T007 acceptance gate — tsc, href spot-check, visual at 1440px+375px, form regression). Every task has exact before/after strings extracted from live file content, protected element lists, and per-task verify checklists.

## Outcome

- ✅ Impact: 7 tasks with exact before/after strings ready for /sp.implement or manual execution
- 🧪 Tests: T007 acceptance gate covers tsc --noEmit, 3 href checks, visual at 2 breakpoints, form regression
- 📁 Files: specs/009-services-cta-update/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: Before-strings extracted verbatim from read file content — no approximations. T005 dependency on T003 (same file) explicitly documented in execution order diagram.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): before-strings verified against read file content — all match
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
