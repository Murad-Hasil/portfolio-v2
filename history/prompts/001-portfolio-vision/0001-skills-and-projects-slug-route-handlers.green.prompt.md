---
id: 0001
title: Skills and Projects Slug Route Handlers
stage: green
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T028 T031 T032
labels: ["backend","fastapi","router","skills","nextjs","route-handler","proxy","slug"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/api/projects/[slug]/route.ts
  - backend/app/routers/skills.py
  - frontend/src/app/api/skills/route.ts
tests:
  - python -c "from app.routers.skills import router" → OK
  - npx tsc --noEmit → 0 errors
---

## Prompt

T028 T031 T032

## Response snapshot

- T028: Next.js Route Handler at /api/projects/[slug] — proxies GET to BACKEND_URL/projects/{slug} with params: Promise<{ slug: string }> (Next.js 16 async params), 60s revalidation, 503 on backend unreachable.
- T031: FastAPI router at /skills — GET /skills returns full skills-manifest.json. Path resolved relative to file location using pathlib.
- T032: Next.js Route Handler at /api/skills — proxies GET to BACKEND_URL/skills (server-side env var only), 60s revalidation, 503 on backend unreachable.

## Outcome

- ✅ Impact: All three API endpoints wired up — projects slug proxy, skills backend router, and skills frontend proxy
- 🧪 Tests: Python import PASS; tsc --noEmit PASS
- 📁 Files: 3 files created
- 🔁 Next prompts: new conversation starting from T029 T030 (Projects section component + case study page)
- 🧠 Reflection: All three files kept minimal (~15 lines each); slug route handler uses Promise<params> pattern required by Next.js 16

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
