---
id: "019"
title: Availability Badge — Spec & Implementation
stage: general
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 003-availability-badge
branch: main
user: Murad Hasil
command: manual implementation request
labels: ["availability-badge","hero","spec-driven","fr-014","murad-profile","profile-api"]
links:
  spec: specs/003-availability-badge/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - context/murad-profile.md
  - Portfolio-Spec.md
  - .specify/memory/constitution.md
  - specs/003-availability-badge/spec.md
  - specs/003-availability-badge/plan.md
  - specs/003-availability-badge/tasks.md
  - backend/app/routers/profile.py
  - backend/app/main.py
  - frontend/src/app/api/profile/route.ts
  - frontend/src/components/sections/Hero.tsx
tests:
  - Manual: change Status in murad-profile.md → verify badge colour changes
  - Manual: 375px / 768px / 1440px viewport check
  - Manual: prefers-reduced-motion stops pulse
---

## Prompt

OG image se pehle availability badge implement karo. Pehle Portfolio-Spec.md, constitution.md, history aur specs mein document karo, phir Hero.tsx mein implement karo. murad-profile.md ka naam bataya tha — usme availability data hoga. Client ki nazar pehle Hero mein jaati hai.

## Response snapshot

Full spec-driven flow executed in correct order:

1. **murad-profile.md** — `## Availability` block added with Status, Label, Note, Hours per week fields.

2. **Portfolio-Spec.md** —
   - Phase 8 checklist marked ✅ SHIPPED
   - Version history: 1.3 → SHIPPED, 1.4 → IN PROGRESS
   - FR-014 added (availability badge requirement)
   - Phase 9 section added (22.1 backend, 22.2 frontend, 22.3 checklist)

3. **constitution.md** — v1.2.0 → v1.3.0:
   - Principle II: availability badge rule added (must source from murad-profile.md, never hardcode)
   - Principle VI: streaming state updated from "not yet implemented" to "✅ SHIPPED 2026-04-01"

4. **specs/003-availability-badge/** — spec.md, plan.md, tasks.md created with full acceptance criteria, data contracts, visual design spec.

5. **Implementation**:
   - `backend/app/routers/profile.py` — `GET /profile` parses murad-profile.md with regex
   - `backend/app/main.py` — profile router registered
   - `frontend/src/app/api/profile/route.ts` — reads murad-profile.md directly via `fs` (consistent with projects/skills pattern)
   - `frontend/src/components/sections/Hero.tsx` — `useEffect` fetches `/api/profile`, renders colour-coded badge between `<h1>` and `<TypeAnimation>`, silent degradation on error

## Outcome

- ✅ Impact: Clients see availability status in first glance at Hero, before any scrolling
- 🧪 Tests: Verification pending (Task 6 in tasks.md)
- 📁 Files: 10 files created/modified
- 🔁 Next prompts: Verify badge renders → then proceed to OG image (specs/004-og-image/)
- 🧠 Reflection: Following actual codebase pattern (frontend reads context/ files directly via fs) is more reliable than proxying to backend — backend sleeps on HF free tier.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Pending Playwright verification
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): After confirming badge, proceed to OG image feature
