---
id: 011
title: Projects Router and Route Handler T026 T027
stage: green
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T026 T027
labels: ["backend","fastapi","router","projects","nextjs","route-handler","proxy"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/routers/projects.py
  - frontend/src/app/api/projects/route.ts
tests:
  - python -c "from app.routers.projects import router" → OK
  - npx tsc --noEmit → 0 errors
---

## Prompt

T026 T027

## Response snapshot

- T026: FastAPI router at /projects — GET /projects returns all from context/projects-manifest.json; GET /projects/{slug} returns single project or 404. Path resolved relative to file location using pathlib.
- T027: Next.js Route Handler at /api/projects — proxies GET to BACKEND_URL/projects (server-side env var only), 60s revalidation, 503 on backend unreachable.

## Outcome

- ✅ Impact: Backend serves project data from manifest; frontend proxy keeps BACKEND_URL server-side only
- 🧪 Tests: Python import PASS; tsc --noEmit PASS
- 📁 Files: 2 files created
- 🔁 Next prompts: new conversation starting from T028 (fresh context)
- 🧠 Reflection: Kept both files minimal and focused — router is 20 lines, route handler is 15 lines

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
