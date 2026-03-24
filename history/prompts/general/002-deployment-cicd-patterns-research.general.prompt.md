---
id: "002"
title: Deployment and CI/CD Patterns Research
stage: general
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 001-portfolio-vision
user: brownie
command: research deployment CI/CD patterns
labels: ["research","railway","vercel","fastapi","nextjs","github-actions","neon","postgresql","docker","ci-cd"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/general/002-deployment-cicd-patterns-research.general.prompt.md
tests:
  - none
---

## Prompt

Research the following deployment and CI/CD patterns. Do NOT write any code. Return concise findings only.

**Context**: Next.js 15 frontend on Vercel, FastAPI backend on Railway, GitHub Actions for CI/CD.

**Research tasks:**

1. **Railway FastAPI deployment**: What does a minimal `Dockerfile` and `railway.json` look like for a FastAPI app? What health check path is standard?

2. **Vercel + Next.js API proxying**: When Next.js API route handlers proxy to a FastAPI backend, should `NEXT_PUBLIC_API_URL` be exposed or kept server-side only? What is the recommended pattern for keeping backend URL private from browser?

3. **GitHub Actions deploy workflow**: What is the minimal GitHub Actions workflow to: (a) run ESLint on Next.js, (b) run pytest on FastAPI, (c) trigger Vercel deploy via CLI, (d) trigger Railway redeploy via webhook? List required secrets.

4. **Neon PostgreSQL connection**: What connection string format does Neon use? Is connection pooling (pgbouncer) needed for Railway-hosted FastAPI? What env var name is conventional?

Return findings as: Decision / Rationale / Alternatives. 3-5 lines per topic max.

## Response snapshot

Four topics researched. Key findings:

1. **Railway FastAPI**: Use `python:3.12-slim` Dockerfile with `uvicorn`. `railway.json` sets `healthcheckPath: "/health"` and uses `$PORT` env var in start command. Nixpacks is the zero-config alternative.

2. **Vercel API proxying**: Use plain `API_URL` (no `NEXT_PUBLIC_` prefix) — server-side only. Route handlers or `next.config.js` rewrites proxy to FastAPI; backend URL never reaches the browser bundle. `NEXT_PUBLIC_` variables are inlined at build time and visible to clients.

3. **GitHub Actions**: Four jobs: lint (ESLint), test (pytest), deploy-vercel (CLI with `vercel deploy --prod`), deploy-railway (curl POST to webhook). Required secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `RAILWAY_DEPLOY_WEBHOOK`.

4. **Neon PostgreSQL**: Direct connection string format: `postgresql://user:pass@ep-<id>.region.aws.neon.tech/dbname?sslmode=require`. Do NOT use pgbouncer pooled endpoint for Railway FastAPI (persistent process with SQLAlchemy owns its own pool; pgbouncer conflicts with prepared statements). Conventional env var: `DATABASE_URL`.

## Outcome

- Impact: Reference patterns established for Railway Dockerfile, Vercel proxy security, GitHub Actions secrets, and Neon connection string — ready to be applied when implementing backend and CI/CD specs.
- Tests: none — research task only
- Files: history/prompts/general/002-deployment-cicd-patterns-research.general.prompt.md
- Next prompts: /sp.spec for FastAPI backend service, /sp.plan for CI/CD pipeline, /sp.adr for deployment platform decisions
- Reflection: WebSearch and most WebFetch calls were denied; Railway and Neon docs were inaccessible. Vercel CLI and deploy hook docs were confirmed via WebFetch. Remaining findings are from authoritative training knowledge (FastAPI/Railway/Neon patterns are stable and well-documented).

## Evaluation notes (flywheel)

- Failure modes observed: WebSearch denied; most WebFetch calls denied (Railway, Neon, Vercel guides blocked). Only two Vercel official doc pages were accessible.
- Graders run and results (PASS/FAIL): n/a — research task
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Re-run with WebSearch enabled to verify Railway railway.json schema fields and Neon pooled vs. direct endpoint recommendation against live docs.
