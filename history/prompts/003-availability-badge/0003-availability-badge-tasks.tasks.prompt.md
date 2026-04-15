---
id: "0003"
title: Availability Badge Tasks
stage: tasks
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 003-availability-badge
branch: main
user: brownie
command: /sp.tasks
labels: ["tasks","availability-badge","hero","profile","003-availability-badge"]
links:
  spec: specs/003-availability-badge/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-availability-badge/tasks.md
tests:
  - "Playwright MCP: badge renders at 375px, 768px, 1440px — green dot + label text"
---

## Prompt

/sp.tasks 003-availability-badge

Generate granular task list for availability badge. 5 tasks:
1. Add ## Availability block to context/murad-profile.md
2. Create backend/app/routers/profile.py (GET /profile)
3. Register router in backend/app/main.py
4. Create frontend/src/app/api/profile/route.ts (proxy)
5. Update Hero.tsx with badge JSX + fetch + colour map

Plus Playwright MCP verification.

## Response snapshot

Generated `specs/003-availability-badge/tasks.md` with 6 tasks:

- **Task 1** — Add `## Availability` block to murad-profile.md: Status, Label, Note, Hours per week. Done: 2026-04-02 ✅
- **Task 2** — Create profile.py: GET /profile, parse murad-profile.md with regex, Pydantic models (Availability + ProfileResponse)
- **Task 3** — Register profile router in main.py: `app.include_router(profile.router)`
- **Task 4** — Create api/profile/route.ts: proxy GET → BACKEND_URL/profile (implemented as direct fs.readFileSync for Vercel file access)
- **Task 5** — Update Hero.tsx: useEffect fetch, local state, badge JSX between h1 and TypeAnimation, BADGE_STYLES colour map, motion-safe:animate-pulse for available, silent degradation on error
- **Task 6** — Playwright MCP verification: screenshot at 375px, 768px, 1440px, badge renders with green dot + "Available for Freelance Work"

## Outcome

- ✅ Impact: 6-task plan, all ordered correctly (data layer → backend → frontend → verification)
- 🧪 Tests: Playwright MCP covers all 8 acceptance criteria
- 📁 Files: specs/003-availability-badge/tasks.md
- 🔁 Next prompts: /sp.implement 003-availability-badge
- 🧠 Reflection: Task 4 (route.ts) was planned as a backend proxy but implemented as direct fs access — valid architecture decision since context/ files are bundled in Vercel serverless via outputFileTracingRoot.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): task format — all items checklist-compliant
- Prompt variant (if applicable): null
- Next experiment: /sp.implement to execute all tasks
