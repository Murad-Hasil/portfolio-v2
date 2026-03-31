---
id: "008"
title: Deploy HF Space via Git Subtree Push
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: main
user: brownie
command: local pe code change kar ke HF pe push karo
labels: ["deployment","huggingface","git-subtree","contact","email","resend","database","pool-pre-ping"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/routers/contact.py
  - backend/app/database.py
tests:
  - git show hf/main:app/routers/contact.py → has logging + urllib + BackgroundTasks ✓
  - git show hf/main:app/database.py → has pool_pre_ping=True + pool_recycle=300 ✓
---

## Prompt

local pe code change kar ke HF pe push karo

## Response snapshot

**Root cause of HF not updating:** HF Space has a separate git remote (`hf`) — GitHub pushes do NOT update HF. The `backend/` directory maps to HF root via git subtree.

**Fix:** `git subtree push --prefix=backend hf main`

- Pushed 34 commits, HF updated: `03e4470..7c8ab0c`
- Verified `hf/main:app/routers/contact.py` — now has `logging`, `urllib.request`, `BackgroundTasks`, and full Resend email code
- Verified `hf/main:app/database.py` — now has `pool_pre_ping=True, pool_recycle=300`
- HF Space triggered automatic rebuild

## Outcome

- ✅ Impact: Both critical fixes deployed to HF Space — Resend email notification + Neon SSL pool fix
- 🧪 Tests: git show hf/main files confirmed correct content; HF rebuild triggered
- 📁 Files: 2 files deployed (contact.py + database.py via subtree push)
- 🔁 Next prompts: Test contact form email end-to-end; remove old SMTP env vars from HF (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- 🧠 Reflection: Always use `git subtree push --prefix=backend hf main` to deploy backend changes to HF Space. The `hf` remote is already configured. GitHub pushes go to `origin` only — completely separate from HF.

## Evaluation notes (flywheel)

- Failure modes observed: Previous attempts used HF web editor (Playwright) — complex and fragile. git subtree push is the correct, reliable approach.
- Graders run and results (PASS/FAIL): File verification PASS; end-to-end email test pending (HF rebuild in progress)
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Set up GitHub Action to auto-run `git subtree push --prefix=backend hf main` on every push to main
