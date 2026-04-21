---
id: "0003"
title: Content Copy Update Tasks
stage: tasks
date: 2026-04-21
surface: agent
model: claude-sonnet-4-6
feature: 007-content-copy-update
branch: 007-content-copy-update
user: Murad Hasil
command: /sp.tasks
labels: [copy, content, hero, about, tasks, text-only]
links:
  spec: specs/007-content-copy-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/007-content-copy-update/tasks.md
tests:
  - T007: npm run build (exit 0)
  - T008: Playwright screenshot hero at 1440px
  - T009: Playwright screenshot About at 1440px
  - T010: Playwright screenshot About at 375px
---

## Prompt

Feature: 007-content-copy-update
Plan: specs/007-content-copy-update/plan.md

1. Edit `Hero.tsx` — replace the value prop text with the new approved copy.
2. Edit `About.tsx` line 16 — update stat value to `"100%"` and label to `"Self-Taught"`.
3. Edit `About.tsx` lines 143–167 — replace old paragraphs with the 4 new ones. Ensure each paragraph is wrapped in appropriate tags (e.g., `<p>` or `<motion.p>`) while keeping existing `className` and `style` props.
4. Run `npm run build` to ensure no syntax errors.
5. Verify that the About section looks clean with the new 4-paragraph structure.

## Response snapshot

Generated tasks.md with 10 tasks across 6 phases (Setup, skip Foundational, US1, US3, US2, Build+Visual). T004 (Hero) and T005 (About stat) are parallel. T006 (bio) runs after T005. T007–T010 are build and Playwright screenshot verification. All apostrophes documented as &apos; requirement. 4th bio paragraph correctly marked without mb-3.

## Outcome

- ✅ Impact: 10 actionable tasks covering all 3 user stories and build/visual verification
- 🧪 Tests: npm run build + Playwright MCP screenshots at 1440px and 375px
- 📁 Files: specs/007-content-copy-update/tasks.md
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: US3 (stat) intentionally scheduled before US2 (bio) despite lower priority to avoid diff conflicts in the same file

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): format validation — all tasks follow [ID] [P?] [Story] pattern with file paths — PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): run /sp.implement to execute T001–T010
