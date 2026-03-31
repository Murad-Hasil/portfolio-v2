---
id: "012"
title: Update PERSONAL-GUIDE and README
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: update PERSONAL-GUIDE.md and README.md to reflect latest state
labels: ["documentation", "readme", "personal-guide", "maintenance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - PERSONAL-GUIDE.md
  - README.md
  - backend/.env.example
tests:
  - none
---

## Prompt

Abhi tum PERSONAL-GUIDE.md check karo maybe update karna pade kuch kyun ke kuch latest kaam kiye hai abhi and README.md ko Solid bana do humare portfolio ke accourding spec-kit plus ke sath.

## Response snapshot

Updated both files to reflect actual production state after recent sessions:

**PERSONAL-GUIDE.md changes:**
- Tech stack table: Next.js 15 → 16.2.1, added Email/CI/Testing rows
- Daily workflow: clarified CI auto-deploys both frontend+backend; updated manual deploy command
- Backend .env: removed SMTP_USER/SMTP_PASS, added RESEND_API_KEY/NOTIFY_EMAIL
- HF Spaces env vars table: removed SMTP rows, added RESEND_API_KEY

**README.md full rewrite (solid for GitHub):**
- Added CI/CD badge
- Fixed Next.js version badge (15 → 16.2.1)
- Updated tech stack table (added Email, CI/CD rows)
- Added Testing section (Vitest + pytest commands)
- Expanded Deployment section (CI/CD flow, manual deploy, content update workflow)
- Added Known Platform Constraints table (HF SMTP block, Cloudflare UA, Neon idle, sleep)
- Updated env vars (added RESEND_API_KEY, NOTIFY_EMAIL, LLM vars)

**backend/.env.example:**
- Added RESEND_API_KEY and NOTIFY_EMAIL with note about SMTP not being used

## Outcome

- ✅ Impact: README and PERSONAL-GUIDE now 100% reflect actual project state
- 🧪 Tests: n/a
- 📁 Files: PERSONAL-GUIDE.md, README.md, backend/.env.example
- 🔁 Next prompts: Add real project URLs to projects-manifest.json when projects complete
- 🧠 Reflection: Both files were outdated — SMTP references, wrong Next.js version, missing Resend/CI info. Now accurate for both personal use and public GitHub visitors.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
