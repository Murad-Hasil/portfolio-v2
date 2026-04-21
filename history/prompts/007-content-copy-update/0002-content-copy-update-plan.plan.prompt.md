---
id: "0002"
title: Content Copy Update Plan
stage: plan
date: 2026-04-21
surface: agent
model: claude-sonnet-4-6
feature: 007-content-copy-update
branch: 007-content-copy-update
user: Murad Hasil
command: /sp.plan
labels: [copy, content, hero, about, plan, text-only]
links:
  spec: specs/007-content-copy-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/007-content-copy-update/plan.md
  - specs/007-content-copy-update/research.md
  - specs/007-content-copy-update/quickstart.md
tests:
  - Visual inspection via Playwright MCP at 1440px and 375px
  - npm run build (type check)
---

## Prompt

Feature: 007-content-copy-update
Spec: specs/007-content-copy-update/spec.md

**Files to edit:**
- `frontend/src/components/sections/Hero.tsx` — lines 195–198
- `frontend/src/components/sections/About.tsx` — lines 16 and 143–167

**Change 1 — Hero.tsx:**
Replace existing subtext with:
"I help businesses save time and cut costs by replacing repetitive work with AI systems that run automatically—so you can stop managing manual tasks and focus on growing your business."

**Change 2 — About.tsx stats (line 16):**
`{ value: "4", label: "Projects" }` → `{ value: "100%", label: "Self-Taught" }`

**Change 3 — About.tsx bio:**
Replace existing paragraphs with these 4 new ones:
1. "I started my journey as a full-stack developer, but I kept noticing a recurring problem: businesses didn't just need more apps, they needed their work done faster and without the manual headache. That's what pushed me into the world of AI automation."
2. "Since 2023, I've been building production-ready AI systems that handle real tasks—like customer support, internal workflows, and data processing. My focus is simple: build something that actually works in the real world, not just a demo."
3. "What makes my approach different is how I plan before building. I follow a 'spec-driven' workflow where requirements, architecture, and edge cases are defined upfront. This reduces surprises, keeps systems clean, and makes them easier to scale."
4. "I care about keeping things simple, reliable, and genuinely useful. If repetitive work is slowing your team down or you want to add AI to your workflow, let's talk."

No new components, no style changes.

## Response snapshot

Constitution check passed with one documented deviation (hardcoded stat value — owner-authorized override). Generated plan.md, research.md, and quickstart.md. No data-model or contracts needed — pure string literal changes. All NEEDS CLARIFICATION resolved. Ready for /sp.tasks or direct /sp.implement.

## Outcome

- ✅ Impact: Full implementation plan produced for 3 string edits across 2 files
- 🧪 Tests: Playwright MCP screenshots (1440px + 375px) + npm run build
- 📁 Files: plan.md, research.md, quickstart.md
- 🔁 Next prompts: /sp.tasks or /sp.implement
- 🧠 Reflection: Constitution Principle II deviation (hardcoded stat) is pre-existing and owner-authorized; no blocking issues

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check — PASS (with documented deviation)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): run /sp.implement directly (tasks.md not required for 3-change scope)
