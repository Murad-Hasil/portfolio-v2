---
id: "0002"
title: RAG Chatbot Streaming FAQ Plan
stage: plan
date: 2026-04-01
surface: agent
model: claude-sonnet-4-6
feature: 002-chatbot-rag
branch: main
user: brownie
command: /sp.plan
labels: ["plan","chatbot","rag","streaming","sse","002-chatbot-rag"]
links:
  spec: specs/002-chatbot-rag/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-rag/plan.md
tests:
  - "None (plan stage — no code written yet)"
---

## Prompt

/sp.plan 002-chatbot-rag

Generate architecture decisions and implementation plan for RAG chatbot streaming + FAQ expansion. The spec is at specs/002-chatbot-rag/spec.md.

Key decisions needed:
1. Streaming protocol: SSE vs WebSocket vs polling
2. Next.js stream proxy pattern in App Router route handler
3. PostgreSQL save timing (before stream, after stream, or fire-and-forget)

## Response snapshot

Plan created at `specs/002-chatbot-rag/plan.md` with 3 documented decisions:

**Decision 1 — Streaming Protocol: SSE (chosen)**
- WebSocket: blocked on HF Spaces free tier, complex setup. Rejected.
- Polling: high latency, wasteful. Rejected.
- SSE: HTTP/1.1 compatible, FastAPI StreamingResponse native, one-directional sufficient. CHOSEN.
📋 Architectural decision: SSE over WebSocket — driven by HF Spaces constraint.

**Decision 2 — Next.js Stream Proxy: route handler (chosen)**
- Direct browser → FastAPI: exposes BACKEND_URL, CORS issues. Rejected.
- Next.js route handler: hides backend URL, consistent with existing pattern. CHOSEN.
- Pattern: `return new Response(upstream.body, { headers: { 'Content-Type': 'text/event-stream' } })`

**Decision 3 — PostgreSQL Save Timing: after stream (chosen)**
- Save before: can't record token count yet. Rejected.
- Fire-and-forget: data loss risk. Rejected.
- Buffer full response in generator, save after exhaustion. CHOSEN.

**File change map**:
- backend/app/routers/chat.py: dict → StreamingResponse + async generator
- frontend/src/app/api/chat/route.ts: JSON proxy → ReadableStream proxy
- frontend/src/components/chat/ChatWidget.tsx: response.json() → ReadableStream reader + typing indicator

Constitution Check: ALL principles verified (Spec-First ✅, Content Authenticity ✅, Type Safety ✅, Accessibility ✅, RAG Grounding ✅).

## Outcome

- ✅ Impact: Full architecture plan with 3 justified decisions — immediately implementable
- 🧪 Tests: No tests at plan stage — acceptance criteria defined in spec.md
- 📁 Files: specs/002-chatbot-rag/plan.md
- 🔁 Next prompts: /sp.tasks 002-chatbot-rag — generate implementation task list
- 🧠 Reflection: All 3 architectural unknowns resolved before writing the plan. HF Spaces constraint drove the SSE decision — documented to prevent future agents from switching to WebSocket without understanding the constraint.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check PASS (all principles verified inline)
- Prompt variant (if applicable): null
- Next experiment: /sp.tasks to generate ordered implementation tasks with acceptance checks
