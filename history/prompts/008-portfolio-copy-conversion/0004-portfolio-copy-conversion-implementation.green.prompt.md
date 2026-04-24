---
id: "0004"
title: Portfolio Copy Conversion Implementation
stage: green
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 008-portfolio-copy-conversion
branch: 008-portfolio-copy-conversion
user: Murad Hasil
command: /sp.implement
labels: ["green", "copy", "conversion", "hero", "about", "services", "contact", "footer", "chatwidget", "skills", "rag", "qdrant"]
links:
  spec: specs/008-portfolio-copy-conversion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/sections/Skills.tsx
  - frontend/src/components/layout/Footer.tsx
  - frontend/src/components/ChatWidget.tsx
  - frontend/src/components/sections/About.tsx
  - frontend/src/components/sections/Hero.tsx
  - frontend/src/components/sections/Services.tsx
  - frontend/src/components/sections/Contact.tsx
  - context/projects-manifest.json
  - context/murad-profile.md
  - context/rag-knowledge-base/about.md
  - context/rag-knowledge-base/services.md
  - context/rag-knowledge-base/contact.md
  - context/rag-knowledge-base/faq.md
  - specs/008-portfolio-copy-conversion/tasks.md
tests:
  - tsc --noEmit — PASS (zero errors)
  - python3 -m json.tool context/projects-manifest.json — PASS (valid JSON)
  - service id "rag-knowledge-base" intact — PASS
  - About bio paragraphs unchanged — PASS
  - Availability block in murad-profile.md unchanged — PASS
  - Qdrant re-seed — PASS (19 vectors upserted)
---

## Prompt

Feature 008-portfolio-copy-conversion — execute all 14 tasks from specs/008-portfolio-copy-conversion/tasks.md in order.

Read tasks.md before starting. Each task has exact before/after values — use them precisely.

Execute in this order:
1. T001–T004 (Group A — can run in any order, all different files)
2. T005 (Group B — Hero, run tsc after)
3. T006–T007 (Group C — Services and Contact)
4. T008–T009 (Group D — data files)
5. T010–T013 (Group E — RAG KB files)
6. T014 (Group E — seed-rag.py, MANDATORY last step)

Hard rules:
- Read each file before editing
- Verify exact before-value is present before writing
- Do NOT change: routing ids/slugs, About bio paragraphs, Zod schema, CTA button hrefs/text, service deliverables, project tech/title/description/metrics
- Do NOT add comments, do NOT refactor surrounding code
- After T005 (Hero.tsx): run `cd frontend && npx tsc --noEmit` — must pass
- After T014 (seed-rag.py): confirm script completes without error

After all 14 tasks complete, run the 7-point acceptance verification from tasks.md.

## Response snapshot

All 14 tasks executed in order. Key outcomes:

- T001: Skills.tsx h2 → "What I Build With"
- T002: Footer tagline → "AI Automation for Small Businesses"; copyright → "Built with the same AI stack I sell — Next.js, FastAPI, and an AI assistant that knows the full codebase."
- T003: ChatWidget SUGGESTED array → client-focused questions (automate for my business, cost, get started)
- T004: About stats → {$75K→$1K, 20 hrs, 4, 24/7} with outcome labels
- T005: Hero H1 → "Automate the Work That's Slowing Your Business Down"; TypeAnimation → client phrases; techPills → outcome labels (4 items); tsc PASS
- T006: Services RAG service name → "AI Knowledge Base" (id unchanged); sub-heading → "Built for businesses that want to automate without the technical headache."
- T007: Contact H2 → "Let's Automate Your Workflow"; sub-copy → team-pain framing; WhatsApp note conditional added; availability → split timing note
- T008: projects-manifest.json both problem fields updated (used Python JSON parse due to — escape sequences); JSON valid
- T009: murad-profile.md Title → "AI Automation Engineer"; Summary → removed Full-Stack identity; Stats → system metrics matching About.tsx
- T010–T013: RAG KB files synced — "Full-Stack Developer" removed from about.md and faq.md; "RAG / Knowledge Base Systems" → "AI Knowledge Base" in services.md, contact.md, faq.md; Career Stats updated with system metrics
- T014: seed-rag.py run with backend/.venv python — 19 vectors upserted to Qdrant successfully

One issue encountered: projects-manifest.json stored em-dashes as literal `—` escape sequences; Edit tool couldn't match them as actual `—` characters. Resolved with Python JSON parse/write.

## Outcome

- ✅ Impact: All 35 FRs implemented — portfolio copy converted from developer language to client language across 11 files. RAG chatbot vectors refreshed.
- 🧪 Tests: tsc PASS, JSON valid, service id intact, bio preserved, availability unchanged, 19 vectors seeded
- 📁 Files: 11 modified files + tasks.md (all 14 tasks marked [x])
- 🔁 Next prompts: git commit + PR creation
- 🧠 Reflection: JSON unicode escape mismatch (— vs actual —) is a recurring edge case in JSON files. Python JSON parse/write is the correct tool for JSON field replacements — not text-level Edit.

## Evaluation notes (flywheel)

- Failure modes observed: Edit tool failed on JSON file with literal — escape sequence. Fixed with Python json.load/dump.
- Graders run and results (PASS/FAIL): tsc PASS, json.tool PASS, grep checks PASS, seed-rag.py PASS (19 vectors)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Add json.tool validation as a prerequisite step before any JSON file edit to catch encoding issues early
