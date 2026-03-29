---
id: 005
title: Keep-Alive GitHub Actions Workflow for HF Space Backend
stage: general
date: 2026-03-30
surface: agent
model: claude-sonnet-4-6
feature: none
branch: 001-portfolio-vision
user: brownie
command: keep-alive workflow creation
labels: ["github-actions","ci-cd","huggingface","keep-alive","cron"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .github/workflows/keep-alive.yml
tests:
  - none
---

## Prompt

My portfolio backend is deployed on Hugging Face Spaces (free tier) which sleeps after ~15 minutes of inactivity, causing the chatbot to have cold-start delays.

I need you to create a GitHub Actions cron workflow that pings my backend every 8 minutes to keep it alive.

Details:
- My HF Space URL is: [APNA URL YAHAN LIKHO e.g. https://your-username-portfolio-backend.hf.space]
- The health endpoint is: /health
- Create the file at: .github/workflows/keep-alive.yml

The workflow should:
1. Run on a cron schedule every 8 minutes
2. Also support manual trigger via workflow_dispatch
3. Use curl to ping the /health endpoint
4. Print the HTTP status code in the logs
5. Warn if status is unexpected (not 2xx/3xx)

Also, if my backend does not already have a /health endpoint, add one. My backend framework is: [FASTAPI / FLASK / EXPRESS — jo bhi use kar rahe ho]
My backend main file is: [e.g. main.py / app.py / index.js]

## Response snapshot

- Found HF Space URL from README.md: `https://mb-murad-portfolio-v2.hf.space`
- Confirmed `/health` endpoint already exists in `backend/app/main.py:85-87` (FastAPI)
- Created `.github/workflows/keep-alive.yml` with cron `*/8 * * * *`, workflow_dispatch, curl ping, HTTP status logging, and warning on non-2xx/3xx

## Outcome

- ✅ Impact: Backend will be pinged every 8 minutes, preventing HF Space cold-start delays for chatbot users
- 🧪 Tests: No tests required — workflow is verified via GitHub Actions logs
- 📁 Files: .github/workflows/keep-alive.yml created
- 🔁 Next prompts: Push to main to activate the cron workflow
- 🧠 Reflection: /health endpoint was already present; no backend changes needed. URL discovered from README.md rather than env vars.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add Slack/email notification on repeated failures
