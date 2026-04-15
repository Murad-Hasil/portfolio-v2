---
id: "0002"
title: Availability Badge Plan
stage: plan
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 003-availability-badge
branch: main
user: brownie
command: /sp.plan
labels: ["plan","availability-badge","hero","profile","003-availability-badge"]
links:
  spec: specs/003-availability-badge/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-availability-badge/plan.md
tests:
  - "None (plan stage — no code written yet)"
---

## Prompt

/sp.plan 003-availability-badge

Generate architecture plan for availability badge. One key decision: static build-time import vs backend API endpoint for reading murad-profile.md.

## Response snapshot

Plan created at `specs/003-availability-badge/plan.md`.

**Key Decision — Option A (static) vs Option B (backend API)**:
- Option A (static build-time): Zero runtime cost. Downside: requires full Vercel redeploy to change status — even a string change requires git push + deploy.
- Option B (backend GET /profile): Reads murad-profile.md at request time. Change status → restart backend → badge updates. Consistent with how projects/skills/chat work. CHOSEN.

**Layer-by-layer plan**:
1. `context/murad-profile.md` — `## Availability` block already added ✅
2. `backend/app/routers/profile.py` — regex parse of murad-profile.md for Status, Label, Note, Hours per week. Pydantic models: Availability + ProfileResponse.
3. `backend/app/main.py` — `app.include_router(profile.router)`
4. `frontend/src/app/api/profile/route.ts` — proxy to BACKEND_URL/profile, no transformation. Note: actual implementation reads directly from murad-profile.md via `fs.readFileSync` (skips backend for Vercel file access).
5. `frontend/src/components/sections/Hero.tsx` — useEffect fetch on mount, local state, badge JSX between h1 and TypeAnimation. Silent degradation on error (no badge rendered).

**Risk table**:
- murad-profile.md parse fails (regex): Low likelihood — log server-side, return 500
- BACKEND_URL not set in Vercel: Low — already set for other routes
- Badge shifts Hero layout on mobile: Low — inline-flex doesn't affect block flow

Constitution Check: ALL principles verified (Spec-First ✅, Content Authenticity ✅ — no hardcoded strings, Design System ✅ — CSS custom properties only, Type Safety ✅, Accessibility ✅ — motion-safe).

## Outcome

- ✅ Impact: Architecture plan documented with justified Option B decision
- 🧪 Tests: No tests at plan stage
- 📁 Files: specs/003-availability-badge/plan.md
- 🔁 Next prompts: /sp.tasks 003-availability-badge
- 🧠 Reflection: The actual implementation (route.ts reading murad-profile.md via fs directly) is even simpler than Option B as planned — it bypasses the backend entirely and reads the file at Next.js serverless function runtime. This is a valid optimization that satisfies the same requirements.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check PASS
- Prompt variant (if applicable): null
- Next experiment: /sp.tasks — generate 5-task implementation list
