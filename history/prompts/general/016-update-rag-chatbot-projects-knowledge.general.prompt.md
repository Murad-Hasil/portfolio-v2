---
id: 016
title: Update RAG Chatbot Projects Knowledge Base
stage: general
date: 2026-04-01
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: brownie
command: update chatbot RAG with new case study content
labels: ["rag", "chatbot", "projects", "knowledge-base", "qdrant"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - context/rag-knowledge-base/projects.md
tests:
  - scripts/seed-rag.py (ran successfully, 15 vectors indexed)
---

## Prompt

Haan chatbot bhi update karna ha and make sure case studies sai hai kisi bhi client/recruiter ke liye.

## Response snapshot

Updated `context/rag-knowledge-base/projects.md` with comprehensive content for all 4 projects:
- Todo Cloud AI: added Hackathon II context (1,000 base + 600 bonus pts), live URL, GitHub URL, detailed 5-phase breakdown with tech/points/descriptions, spec-driven development story, Roman Urdu support, Better Auth details
- Physical AI Textbook: added Hackathon I context (100 base + 150 bonus pts), 4-module curriculum with week ranges and full descriptions, RAG chatbot details, hardware personalization details, founder invite context
- CRM Digital FTE: added cost breakdown ($1,000/yr vs $75,000/yr), key highlights section
- Personal AI Employee: added 4-phase architecture (Bronze→Silver→Gold→Platinum), cost comparison

Ran `EMBEDDING_PROVIDER=fastembed python scripts/seed-rag.py` — 15 vectors upserted to Qdrant `portfolio-knowledge` collection. projects.md now generates 6 chunks (up from ~2).

## Outcome

- ✅ Impact: Chatbot can now answer detailed questions about Hackathon context, project phases, tech stack, metrics, URLs, and spec-driven methodology for all 4 projects
- 🧪 Tests: seed-rag.py completed successfully — 15 vectors, all 6 files indexed
- 📁 Files: context/rag-knowledge-base/projects.md
- 🔁 Next prompts: CRM Digital FTE screenshots/URLs when available
- 🧠 Reflection: Adding hackathon context (points, invitations, spec-driven zero-manual-coding story) makes the chatbot much more useful for recruiters asking about project origins

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): seed-rag.py PASS (15/15 vectors)
- Prompt variant (if applicable): null
- Next experiment: test chatbot with recruiter-style questions about the projects
