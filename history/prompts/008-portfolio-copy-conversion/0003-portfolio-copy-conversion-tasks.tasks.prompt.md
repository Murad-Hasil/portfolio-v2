---
id: "0003"
title: Portfolio Copy Conversion Tasks
stage: tasks
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 008-portfolio-copy-conversion
branch: 008-portfolio-copy-conversion
user: Murad Hasil
command: /sp.tasks Feature 008-portfolio-copy-conversion — 14 tasks across 5 execution groups
labels: ["tasks", "copy", "conversion", "portfolio", "hero", "about", "services", "contact", "footer", "chatwidget", "rag", "skills"]
links:
  spec: specs/008-portfolio-copy-conversion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-portfolio-copy-conversion/tasks.md
tests:
  - n/a — tasks stage
---

## Prompt

Feature 008-portfolio-copy-conversion — Portfolio Copy Conversion. Generate tasks from spec.md (35 FRs) and plan.md (5 execution groups). Each task must reference exact FR numbers, exact before/after values, exact file paths. 14 tasks across 5 groups.

## Response snapshot

14 tasks across 5 execution groups:
- Group A (T001–T004): Parallel — Skills heading, Footer, ChatWidget questions, About stats
- Group B (T005): Hero — H1 + TypeAnimation + techPills (with tsc verification)
- Group C (T006–T007): Services rename + Contact rewrite (conditional WhatsApp note in JSX map)
- Group D (T008–T009): JSON manifest problem fields + murad-profile.md
- Group E (T010–T014): RAG KB sync (4 files) + mandatory Qdrant re-seed

## Outcome

- ✅ Impact: 14 immediately-executable tasks with zero ambiguity — each maps to 1–4 FRs with exact before/after values
- 🧪 Tests: 7-point acceptance checklist (tsc, JSON validity, routing, visual, RAG chatbot, bio preservation, service id)
- 📁 Files: specs/008-portfolio-copy-conversion/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: FR-014 requires JSX conditional inside map — not a simple text replacement. T014 (seed-rag.py) is constitution-mandatory. Both captured clearly.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): format check — all 14 tasks have checkbox, ID, story label, file path
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Run /sp.implement — verify each task completes without touching declared invariants
