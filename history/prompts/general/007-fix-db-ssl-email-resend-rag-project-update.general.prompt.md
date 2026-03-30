---
id: "007"
title: Fix DB SSL Drop Email Resend RAG Project Update
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: main
user: brownie
command: debug contact form email + chatbot project info
labels: ["bugfix","database","neon","pool-pre-ping","resend","email","rag","chatbot","smtp"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - context/rag-knowledge-base/projects.md
  - context/rag-knowledge-base/faq.md
  - context/rag-knowledge-base/skills.md
  - backend/app/database.py
  - backend/app/routers/contact.py
  - frontend/src/app/api/contact/route.ts
tests:
  - curl POST /contact → 201 (no SSL error) ✓
  - Resend email received ✓
  - Chatbot new session → Physical AI Textbook (no AI Chatbot Demo) ✓
---

## Prompt

Two issues:
1. Chatbot was still mentioning "AI Chatbot Demo" even after projects.md was updated and seed-rag.py was re-run
2. Contact form email notification not arriving despite SMTP credentials set on HF Spaces

## Response snapshot

**Issue 1 — Chatbot still showing AI Chatbot Demo:**
- Root cause: `sources` from chat API showed `faq.md`, `about.md`, `skills.md`, `contact.md` — NOT `projects.md`
- The answer was coming from `faq.md` (line 22: "4. AI Chatbot Demo...") and `skills.md` (line 9: "Gemini API — used in AI Chatbot Demo")
- Fix: Updated all 3 RAG files — projects.md, faq.md, skills.md — to replace AI Chatbot Demo with Physical AI & Humanoid Robotics Textbook and replace Gemini API with Groq API in skills
- Re-ran seed-rag.py → Qdrant updated → chatbot now answers correctly

**Issue 2 — Email not arriving:**
- HF Spaces log showed: `sqlalchemy.exc.OperationalError: SSL connection has been closed unexpectedly` in `_generate_reference()` — Neon idle connection timeout. `pool_pre_ping=True` was missing.
- Because `_generate_reference()` failed, `background_tasks.add_task(_send_notification, contact)` was never reached → email never queued
- SMTP also blocked: HF Spaces blocks outbound port 587 (common cloud platform restriction)
- Fix 1: `database.py` — added `pool_pre_ping=True, pool_recycle=300` to `create_engine()`
- Fix 2: `contact.py` — replaced SMTP with Resend HTTP API (stdlib urllib, no new deps). RESEND_API_KEY + NOTIFY_EMAIL env vars on HF Spaces

## Outcome

- ✅ Impact: All 4 issues resolved — chatbot correct, contact form saves, email arrives, DB stable
- 🧪 Tests: curl /contact → 201 clean (no SSL error); Resend email received; chatbot new session → correct project names
- 📁 Files: 5 files modified
- 🔁 Next prompts: Remove old SMTP env vars from HF Spaces (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — no longer needed)
- 🧠 Reflection: Only updating projects.md was not enough — faq.md and skills.md also had AI Chatbot Demo references that the RAG was retrieving. Always grep ALL rag-knowledge-base files when replacing a project. SMTP port blocking is a standard cloud limitation — Resend/HTTP APIs are the correct solution for cloud-deployed backends.

## Evaluation notes (flywheel)

- Failure modes observed: Partial RAG update (only projects.md, missed faq.md + skills.md); SMTP blocked on cloud; pool_pre_ping missing for Neon
- Graders run and results (PASS/FAIL): curl /contact 201 PASS; email received PASS; chatbot correct PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add domain verification on Resend for custom from-address
