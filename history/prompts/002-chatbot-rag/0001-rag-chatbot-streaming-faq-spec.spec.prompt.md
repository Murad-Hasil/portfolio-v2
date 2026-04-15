---
id: "0001"
title: RAG Chatbot Streaming FAQ Spec
stage: spec
date: 2026-04-01
surface: agent
model: claude-sonnet-4-6
feature: 002-chatbot-rag
branch: main
user: brownie
command: /sp.specify
labels: ["spec","chatbot","rag","streaming","sse","faq","002-chatbot-rag"]
links:
  spec: specs/002-chatbot-rag/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-chatbot-rag/spec.md
tests:
  - none
---

## Prompt

/sp.specify 002-chatbot-rag

The RAG chatbot was shipped in v1.2 as a stateless, batch-response system. Define the spec for two targeted improvements:

1. FAQ knowledge base expansion — add 15+ recruiter/client Q&As to faq.md covering: projects, tech stack, freelancing, pricing, methodology, education categories.
2. Streaming responses — tokens must stream to the browser word-by-word via SSE (Server-Sent Events), not return a full JSON blob.

CONSTRAINTS:
- No changes to Qdrant collection schema (dimensions stay 384, provider stays fastembed)
- No changes to PostgreSQL schema
- SSE must be compatible with Hugging Face Spaces free tier (no WebSocket)
- Must not break existing session_id and history storage
- Conversation memory, hybrid search, reranking are OUT OF SCOPE for this spec

## Response snapshot

Spec created at `specs/002-chatbot-rag/spec.md`.

**Current state documented**: stateless batch chatbot, 15 vectors, sparse faq.md, no streaming.

**Target state defined**:
- FAQ expansion: 15+ Q&As across 6 categories (projects, tech stack, freelancing, pricing, methodology, education)
- Streaming backend: POST /chat returns StreamingResponse with Content-Type text/event-stream. SSE format: `data: {"token": "<text>", "done": false}\n\n`, final event: `data: {"token": "", "done": true, "session_id": "...", "sources": [...]}\n\n`
- Streaming frontend: ReadableStream reader in ChatWidget, typing indicator until first token, token-by-token state update

**7 acceptance criteria defined** across 3 groups (FAQ, backend, frontend).

**Risks identified**: HF Spaces SSE timeout (mitigation: max 300 tokens), Next.js App Router stream proxy, Groq SDK stream API differences.

**Deferred explicitly**: conversation memory, hybrid search, reranking, query expansion, OpenAI embeddings upgrade.

## Outcome

- ✅ Impact: Spec fully defined for v1.3 chatbot improvements — 2 user-facing improvements scoped with clear acceptance criteria
- 🧪 Tests: none (specification document)
- 📁 Files: specs/002-chatbot-rag/spec.md
- 🔁 Next prompts: /sp.plan 002-chatbot-rag — generate SSE architecture decisions
- 🧠 Reflection: SSE chosen over WebSocket due to HF Spaces constraint. Deferred items explicitly listed to prevent scope creep. Conversation memory deferred until after streaming ships.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): requirements checklist — all items pass
- Prompt variant (if applicable): null
- Next experiment: Run /sp.plan to document SSE vs WebSocket decision formally as ADR candidate
