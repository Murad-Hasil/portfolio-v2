---
id: 017
title: Chatbot Streaming SSE + FAQ + Full SDD Docs
stage: general
date: 2026-04-01
surface: agent
model: claude-sonnet-4-6
feature: 002-chatbot-rag
branch: main
user: brownie
command: "constitution update → Portfolio-Spec update → spec files → faq update → streaming implementation"
labels: ["chatbot", "streaming", "sse", "faq", "sdd", "constitution", "spec"]
links:
  spec: specs/002-chatbot-rag/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md (v1.1.0 → v1.2.0)
  - Portfolio-Spec.md (v1.2 → v1.3, Phase 8 added)
  - specs/002-chatbot-rag/spec.md (new)
  - specs/002-chatbot-rag/plan.md (new)
  - specs/002-chatbot-rag/tasks.md (new)
  - context/rag-knowledge-base/faq.md (expanded: 6 categories, 20+ Q&As)
  - backend/app/routers/chat.py (StreamingResponse, SSE generator)
  - frontend/src/app/api/chat/route.ts (SSE stream proxy)
  - frontend/src/components/ChatWidget.tsx (token-by-token rendering)
tests:
  - next build PASS (14/14 static pages)
  - backend/app/routers/chat.py import PASS
  - scripts/seed-rag.py PASS (18 vectors)
---

## Prompt

thek ha faq.md update karo and Streaming add karo liken ussy pehle consitution update karo uske bad Portfolio-Spec.md update karo pir specs bana kar kaam karo history, specify main record rehna chahiye taake koi bhi LLM/cli agent code ko dekhe bina srif constitution, specs, history dekh kr samjh jaye koi confusion na ho.

## Response snapshot

Full SDD-compliant workflow executed in order:

1. **Constitution v1.2.0** — Added current RAG pipeline state (chunking, retrieval, memory, streaming status) and planned improvements section to Principle VI. Updated version footer.

2. **Portfolio-Spec.md v1.3** — Status updated to IN PROGRESS. Phase 8 section added covering FAQ expansion + streaming SSE (backend + frontend). Version History table updated. TOC updated.

3. **specs/002-chatbot-rag/** — Created full spec folder:
   - `spec.md`: current state (as-is), target state (to-be), acceptance criteria, out of scope, risks
   - `plan.md`: 3 architectural decisions — SSE vs WebSocket (SSE wins: HF Spaces constraint), Next.js proxy pattern, DB save timing
   - `tasks.md`: 6 testable tasks with acceptance checks, deferred tasks table

4. **faq.md** — Expanded from ~12 Q&As to 20+ across 6 categories: About Murad, Projects, Technical Skills, Hiring & Collaboration. Added hackathon context, live URLs, timezone, pricing range, spec-driven dev methodology, GIAIC education. Re-seeded Qdrant: 18 vectors (up from 15).

5. **Streaming backend** — `chat.py` rewritten: `StreamingResponse` + async SSE generator `_stream_response()`. RAG retrieval + prompt build happens before streaming. LLM called with `stream=True`. Token events: `{"token": "...", "done": false}`. Final event: `{"token": "", "done": true, "session_id": "...", "sources": [...]}`. DB save after stream exhausts.

6. **Streaming frontend** — `route.ts`: JSON proxy → SSE stream proxy using `new Response(upstream.body, {...})`. `ChatWidget.tsx`: `sendMessage()` rewritten with `ReadableStream` reader + `TextDecoder`. Typing indicator shows until first token (then hides). `streaming` state prevents double-sends. Placeholder assistant message added immediately, updated token by token.

## Outcome

- ✅ Impact: Chatbot now streams tokens to browser as they arrive. FAQ expanded for recruiter/client queries. Full SDD paper trail: constitution + spec + plan + tasks + history.
- 🧪 Tests: next build PASS, chat.py import PASS, seed-rag.py PASS (18 vectors)
- 📁 Files: 9 files modified/created
- 🔁 Next prompts: 003-chatbot-memory (conversation memory), Playwright MCP verification, Portfolio-Spec.md v1.3 → SHIPPED after verification
- 🧠 Reflection: SSE over WebSocket was the right call — HF Spaces free tier blocks persistent WS. Spec-first approach caught the HF constraint before implementation.

## Evaluation notes (flywheel)

- Failure modes observed: none — build clean, imports clean
- Graders run and results (PASS/FAIL): next build PASS, python import PASS, seed-rag PASS
- Prompt variant (if applicable): null
- Next experiment: live test streaming on deployed site via Playwright MCP
