---
id: "0001"
title: Content Copy Update Spec
stage: spec
date: 2026-04-21
surface: agent
model: claude-sonnet-4-6
feature: 007-content-copy-update
branch: 007-content-copy-update
user: Murad Hasil
command: /sp.specify
labels: [copy, content, hero, about, spec]
links:
  spec: specs/007-content-copy-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/007-content-copy-update/spec.md
  - specs/007-content-copy-update/checklists/requirements.md
  - history/prompts/007-content-copy-update/0001-content-copy-update-spec.spec.prompt.md
tests:
  - n/a (copy-only change, no test files added)
---

## Prompt

Feature: 007-content-copy-update

Update 3 pieces of hardcoded copy in the portfolio frontend to give it a more human and professional feel.
No UI changes, no structural changes — text only.

**Changes:**
1. Hero subtext — `Hero.tsx` line 195–198
2. About bio — `About.tsx` lines 143–167 (Update from 3 paragraphs to 4)
3. About stat — `About.tsx` line 16: `"4 Projects"` → `"Self-Taught"`

**Success criteria:**
- [ ] Hero value prop shows new human-centric subtext.
- [ ] About bio shows 4 new refined paragraphs.
- [ ] 4th stat card shows `100%` / `Self-Taught` instead of `4 Projects`.
- [ ] No styling, layout, or component changes.

## Response snapshot

Created spec at `specs/007-content-copy-update/spec.md` with 3 user stories (P1 Hero, P2 About bio, P3 Stat card), 5 functional requirements, 4 success criteria, and edge cases. Created requirements checklist at `specs/007-content-copy-update/checklists/requirements.md` — all items pass. Branch `007-content-copy-update` checked out. Ready for `/sp.plan`.

## Outcome

- ✅ Impact: Spec written for 3 targeted copy changes — Hero subtext, About bio (3→4 paragraphs), 4th stat card label
- 🧪 Tests: No automated tests applicable; acceptance tested via visual inspection scenarios
- 📁 Files: specs/007-content-copy-update/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan or /sp.clarify
- 🧠 Reflection: Scope is tight and well-bounded; the only open item is the actual new copy strings which must be provided at implementation time

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): requirements checklist — all PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): provide new copy strings and run /sp.plan
