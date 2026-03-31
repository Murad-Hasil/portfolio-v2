---
id: "014"
title: Update Project URLs and Screenshots
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: "update project manifest URLs + take screenshots via Playwright"
labels: ["content","projects","manifest","screenshots","playwright"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - context/projects-manifest.json
  - frontend/public/projects/todo-cloud-ai.png
  - frontend/public/projects/personal-ai-employee.png
tests:
  - "Playwright screenshot: https://murad-hasil-todo-ai.vercel.app (PASS)"
  - "Playwright screenshot: https://github.com/Murad-Hasil/personal-ai-employee (PASS)"
---

## Prompt

User provided real GitHub and live URLs for 2 projects:

- Todo App → Cloud-Native AI Agent: GitHub https://github.com/Murad-Hasil/Todo-AI-Assistant.git, Frontend https://murad-hasil-todo-ai.vercel.app, Backend https://mb-murad-todo-ai-assistant.hf.space
- Personal AI Employee: GitHub https://github.com/Murad-Hasil/personal-ai-employee.git

User asked to: take Todo AI screenshot via Playwright, take AI Employee GitHub screenshot, and update manifest.

## Response snapshot

Updated `context/projects-manifest.json`:
- `todo-cloud-ai`: `live_url` → https://murad-hasil-todo-ai.vercel.app, `github_url` → https://github.com/Murad-Hasil/Todo-AI-Assistant
- `personal-ai-employee`: `github_url` → https://github.com/Murad-Hasil/personal-ai-employee (live_url stays null — local deployment by design)

Screenshots taken via Playwright MCP and saved to `frontend/public/projects/`:
- `todo-cloud-ai.png` — Hero page: "Manage tasks with AI intelligence" purple/blue gradient
- `personal-ai-employee.png` — GitHub repo page showing 4-tier structure (Bronze → Silver → Gold → Platinum)

## Outcome

- ✅ Impact: Placeholder URLs removed from 2 projects; real screenshots replace any placeholders; case study pages now show live demo links
- 🧪 Tests: Both Playwright navigations successful, pages loaded correctly
- 📁 Files: 3 files changed (manifest + 2 screenshots)
- 🔁 Next prompts: Resume PDF upload; CRM project completion; project-specific improvements (plus points)
- 🧠 Reflection: AI Employee GitHub repo shows 4 completed phases (Bronze/Silver/Gold/Platinum) — this detail should be reflected in project description when updating

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Playwright screenshot PASS x2
- Prompt variant (if applicable): null
- Next experiment: null
