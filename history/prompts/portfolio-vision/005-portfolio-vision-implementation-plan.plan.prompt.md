---
id: 005
title: Portfolio Vision Implementation Plan
stage: plan
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.plan 001-portfolio-vision
labels: ["plan","architecture","fastapi","nextjs","rag","qdrant","mcp","deployment"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-portfolio-vision/plan.md
  - specs/001-portfolio-vision/research.md
  - specs/001-portfolio-vision/data-model.md
  - specs/001-portfolio-vision/quickstart.md
  - specs/001-portfolio-vision/contracts/backend-api.md
  - specs/001-portfolio-vision/contracts/mcp-tools.md
  - CLAUDE.md (agent context updated)
tests:
  - none
---

## Prompt

Ready. (triggering /sp.plan for 001-portfolio-vision)

## Response snapshot

Generated full implementation plan for Portfolio Vision at specs/001-portfolio-vision/plan.md.

**Constitution Check**: All 7 gates passed (Spec-First, Content Authenticity, Design System,
Type Safety, Accessibility, RAG Grounding, Secrets Hygiene). No violations.

**Technical Context**:
- Backend: Python 3.12 + FastAPI + SQLModel (sync) + slowapi + Alembic
- Frontend: TypeScript + Next.js 15 App Router + Tailwind CSS 4 + shadcn/ui + Framer Motion
- RAG: fastembed BAAI/bge-small-en-v1.5 (384 dims) + qdrant-client + Groq AsyncGroq
- Storage: Neon PostgreSQL (direct, non-pooled, psycopg2) + Qdrant Cloud
- Deploy: Vercel (frontend) + Railway Dockerfile (backend) + GitHub Actions

**5 Architecture Decisions documented**:
1. API Proxying: Next.js Route Handlers proxy to FastAPI (backend URL stays server-side)
2. Rate Limiting: slowapi + MemoryStorage — no Redis needed
3. Embeddings: fastembed default (384 dims) → OpenAI upgrade path via env var
4. LLM: Groq Llama 3.3 70B (free tier) → OpenAI GPT-4o-mini upgrade path
5. DB ORM: Sync SQLModel + psycopg2 (avoids asyncpg/Neon pgbouncer incompatibility)

**Artifacts created**:
- plan.md: full project structure, tech context, architecture decisions
- research.md: 7 researched decisions with rationale + alternatives
- data-model.md: 4 DB entities + 2 file-based entities + KnowledgeChunk vector entity
- contracts/backend-api.md: 8 endpoints with request/response shapes + error taxonomy
- contracts/mcp-tools.md: 6 MCP tools with input/output schemas
- quickstart.md: local dev setup guide + env var reference

## Outcome

- ✅ Impact: Full architecture plan for portfolio — ready for /sp.tasks
- 🧪 Tests: Constitution Check post-design — all 7 gates PASS
- 📁 Files: 6 plan artifacts created, CLAUDE.md agent context updated
- 🔁 Next prompts: /sp.tasks for 001-portfolio-vision
- 🧠 Reflection: Research agents confirmed key decisions (sync SQLModel over async,
  slowapi over Redis, Route Handler proxy pattern). All architecture decisions
  justified with alternatives documented in research.md.

## Evaluation notes (flywheel)

- Failure modes observed: Research agent tool access denied (WebSearch + context7) —
  fell back to training knowledge. Spot-check flags added to research.md.
- Graders run and results (PASS/FAIL): Constitution Check PASS (7/7)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): run /sp.tasks to generate actionable task list
