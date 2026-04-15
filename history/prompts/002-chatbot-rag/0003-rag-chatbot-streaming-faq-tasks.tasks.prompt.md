---
id: "0003"
title: RAG Chatbot Streaming FAQ Tasks
stage: tasks
date: 2026-04-01
surface: agent
model: claude-sonnet-4-6
feature: 002-chatbot-rag
branch: main
user: brownie
command: /sp.tasks
labels: ["tasks","chatbot","rag","streaming","sse","faq","002-chatbot-rag"]
links:
  spec: specs/002-chatbot-rag/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-rag/tasks.md
tests:
  - "Playwright MCP: streaming visible, typing indicator correct, mobile 375px intact"
---

## Prompt

/sp.tasks 002-chatbot-rag

Generate granular task list for the RAG chatbot streaming + FAQ expansion. Tasks must cover:
1. FAQ expansion (faq.md update + seed-rag.py re-run)
2. Backend streaming (LLM provider stream=True + chat.py StreamingResponse)
3. Frontend proxy (api/chat/route.ts ReadableStream passthrough)
4. Frontend widget (ChatWidget.tsx token-by-token rendering + typing indicator)
5. Playwright MCP verification

## Response snapshot

Generated `specs/002-chatbot-rag/tasks.md` with 6 tasks:

- **Task 1** — Update FAQ knowledge base: 15+ Q&As across 6 categories, re-run seed-rag.py
- **Task 2** — Add stream=True to LLM providers (Groq + OpenAI): async generator yielding token chunks
- **Task 3** — Change /chat endpoint to StreamingResponse: SSE format with done/token events, DB save after exhaustion
- **Task 4** — Update Next.js API route: ReadableStream passthrough, Content-Type text/event-stream
- **Task 5** — Update ChatWidget: token-by-token state, typing indicator until first token, mobile-safe
- **Task 6** — Playwright MCP verification: streaming visible, typing indicator, FAQ answers accurate, mobile 375px

## Outcome

- ✅ Impact: 6-task implementation plan — fully ordered, each task has explicit acceptance checks
- 🧪 Tests: Task 6 Playwright MCP covers all spec acceptance criteria
- 📁 Files: specs/002-chatbot-rag/tasks.md
- 🔁 Next prompts: /sp.implement 002-chatbot-rag — execute all 6 tasks
- 🧠 Reflection: Task order matters — FAQ first (independent), then backend stream, then frontend. ChatWidget changes depend on route handler being correct. Playwright verification last.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): task format validation — all items checklist-compliant
- Prompt variant (if applicable): null
- Next experiment: /sp.implement to execute tasks; note any HF Spaces SSE timeout issues during testing
