---
id: "004"
title: Tech Stack Integration Research
stage: general
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: brownie
command: research task (inline prompt)
labels: ["research","nextjs","fastapi","qdrant","fastembed","groq","sqlmodel","neon","rate-limiting","cors"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - null
tests:
  - null
---

## Prompt

Research the following for a portfolio web app plan. Do NOT write any code. Return concise findings only.

**Context**: Building Murad Hasil's portfolio — Next.js 15 (App Router) frontend on Vercel, FastAPI (Python 3.12) backend on Railway, Neon PostgreSQL, Qdrant Cloud vector DB, Groq (Llama 3.3 70B) LLM, fastembed local embeddings.

**Research tasks:**

1. **Next.js 15 App Router + FastAPI**: What is the standard pattern for Next.js App Router to call a FastAPI backend? Should API route handlers proxy the backend, or should the frontend call FastAPI directly? What are the CORS implications?

2. **FastAPI rate limiting**: What is the simplest production-ready approach for rate limiting POST endpoints in FastAPI without Redis (we want to avoid extra infra)? Options: slowapi, in-memory with TTL cache, or other.

3. **fastembed + Qdrant integration**: What is the correct way to use fastembed (BAAI/bge-small-en-v1.5, 384 dims) with qdrant-client for upsert and search? Any gotchas with the collection creation (distance metric, vector config)?

4. **Groq Python SDK**: What is the correct import and basic chat completion call for the Groq Python SDK? What model ID string for Llama 3.3 70B versatile?

5. **SQLModel with Neon PostgreSQL**: Any known compatibility issues with SQLModel + asyncpg + Neon? Is sync or async recommended for a simple portfolio backend?

Return findings as: Decision / Rationale / Alternatives for each topic. Be concise — 3-5 lines per topic max.

## Response snapshot

Five research findings returned (no code written):

1. **Next.js → FastAPI**: Use Next.js Route Handlers as a proxy. Keeps FastAPI URL server-side, eliminates browser CORS. FastAPI CORS only needs to allow Vercel server-to-server origin. Alternatives: direct browser fetch (requires permissive CORS), or next.config.ts rewrites.

2. **Rate limiting**: Use `slowapi` with `MemoryStorage` — zero extra infra, decorator-based (`@limiter.limit("5/minute")`), handles 429 natively. Per-process state is fine for a single Railway dyno. Alternative: manual `TTLCache` middleware.

3. **fastembed + Qdrant**: `TextEmbedding("BAAI/bge-small-en-v1.5")`, collection with `VectorParams(size=384, distance=Distance.COSINE)`. Key gotchas: call `.tolist()` on numpy vectors before upsert; `recreate_collection` deprecated in qdrant-client ≥1.7 — use `create_collection` with guard instead.

4. **Groq SDK**: `from groq import Groq` (or `AsyncGroq`). Model ID: `"llama-3.3-70b-versatile"`. API key read from `GROQ_API_KEY` env automatically. Streaming supported via `stream=True`.

5. **SQLModel + Neon**: Prefer sync + psycopg2. Async is possible but requires raw SQLAlchemy patterns; asyncpg has a known Neon PgBouncer incompatibility requiring `prepared_statement_cache_size=0` in DSN.

## Outcome

- Impact: Five concrete integration decisions documented for the planning phase; unblocks spec/plan authoring for portfolio backend and frontend.
- Tests: none (research task, no code)
- Files: none created/modified
- Next prompts: /sp.plan for portfolio-vision feature using these findings; /sp.adr for Next.js proxy pattern and sync vs async DB decisions
- Reflection: All five topics answered from training knowledge (August 2025 cutoff); MCP context7 and WebSearch were denied in this environment. Findings should be validated against official docs before implementation.

## Evaluation notes (flywheel)

- Failure modes observed: External tool access (context7, WebSearch) denied — fell back to training knowledge. Knowledge may lag library releases post-August 2025.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): enable WebSearch or context7 permissions to verify qdrant-client version ≥1.7 API and Neon asyncpg DSN param name
