---
id: 029
title: Frontend & Backend Context Sync — n8n→OpenClaw, CRM-FTE Gallery Update
stage: general
date: 2026-04-26
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: re-check kuch reh to nhi gya
labels: ["content-sync", "frontend-context", "backend-context", "crm-fte", "openclaw"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/context/skills-manifest.json
  - frontend/context/murad-profile.md
  - frontend/context/projects-manifest.json
  - backend/context/skills-manifest.json
tests:
  - grep sweep: no n8n, Clawdbot, or old CRM screenshot filenames in any context directory
---

## Prompt

re-check kuch reh to nhi gya (continued from prior session after context compaction)

## Response snapshot

Identified that root `context/` files had been updated in the prior session but the live Next.js app reads from `frontend/context/` via `process.cwd()`, and the FastAPI backend reads from `backend/context/`. All 4 stale files were updated in parallel:

1. `frontend/context/skills-manifest.json` — n8n → OpenClaw (Personal AI Agent), intermediate
2. `frontend/context/murad-profile.md` — "Clawdbot Crash Course (3 months — in progress)" → "OpenClaw — Personal AI Agent Platform (in progress)"
3. `backend/context/skills-manifest.json` — n8n → OpenClaw (Personal AI Agent), intermediate
4. `frontend/context/projects-manifest.json` — CRM-FTE entry: 5 old screenshots (including terminal crm-fte-api-response.png) → 7 new screenshots (webform-v2, ticket-v2, email-sent, email-received, whatsapp, db-schema, docker-services); description updated with Agent Maturity Model story; 4 old metrics → 5 real production metrics; 6 old highlights → 6 engineering war story highlights; tech stack updated to "Neon PostgreSQL + pgvector" and "Next.js 15"

Final grep sweep confirmed zero n8n, Clawdbot, crm-fte-webform-filled, crm-fte-ticket-success, or crm-fte-api-response occurrences across all context directories.

## Outcome

- ✅ Impact: All three content layers (RAG chatbot, live Next.js app, FastAPI backend) are now fully consistent. No stale skills, profile text, or project gallery data remains.
- 🧪 Tests: grep sweep — zero stale strings in frontend/context/, backend/context/, context/
- 📁 Files: 4 files updated
- 🔁 Next prompts: Optional — address Portfolio-Spec.md stale content (Clawdbot, n8n, placeholder URLs); confirm deployment builds cleanly
- 🧠 Reflection: Critical distinction: Next.js reads from `process.cwd()/context/` which resolves to `frontend/context/` in monorepo — not the root `context/` directory. Always update both when content changes.

## Evaluation notes (flywheel)

- Failure modes observed: Context compaction mid-session caused the frontend/context discrepancy to remain unresolved until this continuation
- Graders run and results (PASS/FAIL): grep sweep PASS
- Prompt variant (if applicable): null
- Next experiment: Add a CI check or pre-commit hook that diffs root context/ against frontend/context/ and backend/context/ to prevent drift
