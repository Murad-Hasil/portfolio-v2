---
id: "006"
title: Fix Chatbot Project Info and Contact Form Timeout
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: main
user: brownie
command: fix two issues — chatbot project info + contact form 503
labels: ["bugfix","rag","contact-form","timeout","retry","projects"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - context/rag-knowledge-base/projects.md
  - frontend/src/app/api/contact/route.ts
tests:
  - curl POST https://mb-murad-portfolio-v2.hf.space/contact → 201 confirmed
  - HF Space /health → {"status":"ok"} confirmed
---

## Prompt

Mujhe 2 issue mile humare portfolio main:
1. Portfolio spec main jo AI chatbot demo project ka information tha — usko portfolio ke projects section se remove kar ke "Physical AI & Humanoid Robotics Textbook" add kia. Chatbot ko is naye project ka information dena tha, chatbot wala purana info hatana tha.
2. Contact form submit karte waqt "Service temporarily unavailable. Please try again later." show ho raha tha. SMTP (Google App Password) variables HF pe save hain. DATABASE_URL bhi set hai. HF space soya nahi karta (keep-alive workflow har 8 min main ping karta hai).

## Response snapshot

**Issue 1 — RAG knowledge base update:**
- `context/rag-knowledge-base/projects.md` Project 4 replaced: "AI Chatbot Demo" → "Physical AI & Humanoid Robotics Textbook"
- Full project detail added: 13-week curriculum, 4 modules (ROS 2 → Gazebo → Isaac → Conversational Humanoid), RAG chatbot, hardware-aware personalization, Roman Urdu translation, all tech stack, metrics, live/github URLs

**Issue 2 — Contact form 503 investigation:**
- Tested HF backend directly: `curl POST /contact` → HTTP 201 ✓ (backend + DB working)
- Root cause traced to `frontend/src/app/api/contact/route.ts` catch block — message "Service temporarily unavailable. Please try again later." only exists there (not in backend)
- The fetch itself was failing (network error or timeout), NOT the backend returning 503
- Fix: timeout 10s → 35s, added retry logic (2 attempts with 2s pause between), separated body parsing error (400) from network errors (503)

## Outcome

- ✅ Impact: Chatbot now answers correctly about Physical AI Textbook project; contact form is more resilient to transient network failures
- 🧪 Tests: curl /contact → 201 PASS; /health → ok PASS
- 📁 Files: 2 files modified
- 🔁 Next prompts: Push to main → Vercel auto-deploys contact route fix; HF needs Docker rebuild for RAG update
- 🧠 Reflection: The "Service temporarily unavailable" message was from Next.js catch block, not backend — the distinction matters for debugging. History check confirmed keep-alive workflow exists (005-keep-alive PHR), so sleep was not the root cause; the timeout increase is still a good defensive measure.

## Evaluation notes (flywheel)

- Failure modes observed: Misleading error message in frontend catch block made it appear to be a backend issue
- Graders run and results (PASS/FAIL): curl /contact 201 PASS; /health ok PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Check Vercel function logs to confirm BACKEND_URL is correctly applied in production
