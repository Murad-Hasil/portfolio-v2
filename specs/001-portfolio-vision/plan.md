# Implementation Plan: Portfolio Vision

**Branch**: `001-portfolio-vision` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-portfolio-vision/spec.md`

## Summary

Build Murad Hasil's professional portfolio — a full-stack web application targeting
international freelancing clients on Upwork and Fiverr. The portfolio demonstrates
the same technologies Murad sells (Next.js, FastAPI, RAG, MCP) by being built with
them. A floating AI chatbot powered by a RAG pipeline answers visitor questions from
a curated knowledge base. A custom MCP server allows Murad to update portfolio content
without touching code. Deployed to Vercel (frontend) + Railway (backend) with GitHub
Actions CI/CD.

## Technical Context

**Language/Version**: Python 3.12 (backend), TypeScript / Node.js 22 (frontend)
**Primary Dependencies**:
  - Frontend: Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui, Framer Motion
  - Backend: FastAPI, SQLModel, Pydantic v2, Alembic, slowapi (rate limiting)
  - RAG: fastembed (BAAI/bge-small-en-v1.5, 384 dims), qdrant-client, groq SDK
  - MCP: Python MCP SDK (`mcp`)

**Storage**: Neon PostgreSQL (relational data), Qdrant Cloud (vector embeddings)
**Testing**: pytest + httpx (backend API), Playwright MCP (E2E browser)
**Target Platform**: Web — Vercel (frontend), Railway (backend); WSL Ubuntu for dev
**Project Type**: Web application (frontend + backend + MCP server)
**Performance Goals**: Interactive state < 3s, Lighthouse ≥ 90, chat response p95 < 3s
**Constraints**: Groq free tier (1000 req/day limit), fastembed runs locally (zero API
  cost for embeddings), Qdrant free tier (1 collection, 1M vectors)
**Scale/Scope**: Personal portfolio — ~100–500 visitors/month, 4 projects (growing),
  5 skill categories, 4 services, 1 chatbot collection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Gate | Status |
|---|---|---|
| I. Spec-First Mandate | spec.md exists with FRs, SCs, user stories | ✅ PASS |
| II. Content Authenticity | `context/` files are source of truth — no hardcoded content | ✅ PASS |
| III. Design System | CSS tokens defined, Playwright verify per component | ✅ PASS |
| IV. Type Safety | TypeScript strict + Pydantic models on all endpoints | ✅ PASS |
| V. Accessibility | WCAG 2.1 AA, 375px mobile-first, 44px tap targets | ✅ PASS |
| VI. RAG Grounding | KB-only answers, LLM/embed provider via env vars | ✅ PASS |
| VII. Secrets Hygiene | `.env` only, `.env.example` committed, no hardcoded keys | ✅ PASS |

All 7 gates pass. No complexity violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-vision/
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions & rationale
├── data-model.md        # Phase 1 — database schema & entity relationships
├── quickstart.md        # Phase 1 — local dev setup guide
├── contracts/           # Phase 1 — API endpoint contracts
│   ├── backend-api.md
│   └── mcp-tools.md
└── tasks.md             # Phase 2 — created by /sp.tasks (NOT this command)
```

### Source Code (repository root)

```text
portfolio-v2/
├── CLAUDE.md                          ← SDD agent constitution (existing)
├── Portfolio-Spec.md                  ← Requirements source of truth (existing)
├── .specify/                          ← SpecKit Plus templates & scripts (existing)
├── .env.example                       ← Root-level env documentation
│
├── context/                           ← Single source of truth for all content
│   ├── murad-profile.md
│   ├── skills-manifest.json
│   ├── projects-manifest.json
│   ├── services-manifest.json
│   ├── brand-voice.md
│   └── rag-knowledge-base/
│       ├── about.md
│       ├── skills.md
│       ├── projects.md
│       ├── services.md
│       ├── faq.md
│       └── contact.md
│
├── specs/                             ← SDD specs per feature
│
├── frontend/                          ← Next.js 15 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             ← Root layout + ThemeProvider + SEO
│   │   │   ├── page.tsx               ← Single-page home (all sections)
│   │   │   ├── projects/[slug]/
│   │   │   │   └── page.tsx           ← Project case study
│   │   │   └── api/                   ← Route handlers (proxy to FastAPI)
│   │   │       ├── projects/route.ts
│   │   │       ├── projects/[slug]/route.ts
│   │   │       ├── skills/route.ts
│   │   │       ├── contact/route.ts
│   │   │       └── chat/route.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── Skills.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   └── Contact.tsx
│   │   │   ├── ui/                    ← shadcn/ui components
│   │   │   └── ChatWidget.tsx         ← Floating RAG chatbot
│   │   ├── lib/
│   │   │   ├── api.ts                 ← Typed API client
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css            ← CSS custom properties (design tokens)
│   ├── public/
│   │   ├── profile/murad.jpg
│   │   └── projects/                  ← Project screenshots
│   ├── .env.local.example
│   ├── next.config.ts
│   └── tsconfig.json                  ← strict: true
│
├── backend/                           ← FastAPI + SQLModel
│   ├── app/
│   │   ├── main.py                    ← FastAPI app, CORS, lifespan
│   │   ├── models.py                  ← SQLModel table definitions
│   │   ├── routers/
│   │   │   ├── projects.py
│   │   │   ├── skills.py
│   │   │   ├── contact.py
│   │   │   ├── chat.py
│   │   │   └── analytics.py
│   │   └── providers/
│   │       ├── llm.py                 ← get_llm_client() — Groq or OpenAI
│   │       └── embeddings.py          ← get_embedding() — fastembed or OpenAI
│   ├── tests/
│   │   └── test_endpoints.py
│   ├── Dockerfile
│   ├── railway.json
│   ├── requirements.txt
│   └── .env.example
│
├── mcp-server/                        ← Custom MCP server (Python MCP SDK)
│   ├── server.py                      ← 6 MCP tools
│   ├── requirements.txt
│   └── README.md
│
├── scripts/
│   ├── seed-rag.py                    ← Load knowledge base → Qdrant
│   └── update-project.py             ← Convenience wrapper for add_project
│
└── .github/
    └── workflows/
        └── deploy.yml                 ← CI/CD: lint + test → Vercel + Railway
```

**Structure Decision**: Web application — Option 2 (frontend + backend). Chosen
because the portfolio has distinct UI concerns (Next.js, SSR/SEO) and API concerns
(FastAPI, Python RAG pipeline) that benefit from clear separation. The MCP server is
a third sub-project under `/mcp-server/` serving portfolio management CLI use cases.

## Architecture Decisions

### 1. API Proxying Strategy — Next.js Route Handlers
**Decision**: All frontend-to-backend calls go through Next.js API Route Handlers
(`/app/api/...`), NOT direct browser → FastAPI calls.
**Rationale**: Keeps `BACKEND_URL` server-side only (not exposed to browser). Allows
adding auth headers, caching, or response transformation without touching FastAPI.
The browser only ever knows the Vercel domain.
**Trade-off**: Adds a proxy hop (~10-20ms). Acceptable for a portfolio with no
sub-100ms SLA.

### 2. Rate Limiting — slowapi (in-process)
**Decision**: Use `slowapi` (built on `limits` library) with in-memory storage for
rate limiting the `/contact` endpoint (3 req/IP/hour).
**Rationale**: No Redis needed — this is a personal portfolio with low traffic.
`slowapi` integrates cleanly with FastAPI middleware. Simple, zero extra infra.
**Trade-off**: Rate limit state is lost on backend restart. Acceptable for a personal
portfolio; not acceptable for high-traffic production.

### 3. Embedding Provider Default — fastembed local
**Decision**: Default to `fastembed` with `BAAI/bge-small-en-v1.5` (384 dims).
**Rationale**: Zero API cost, runs in the Railway container, good quality for the
small portfolio knowledge base (~10-20 chunks). Switching to OpenAI requires only
`EMBEDDING_PROVIDER=openai` env var change + re-running `seed-rag.py`.
**Trade-off**: 384-dim vectors have lower retrieval quality than 1536-dim OpenAI
embeddings. Acceptable given the small, focused knowledge base.

### 4. LLM Default — Groq Llama 3.3 70B
**Decision**: Default LLM is Groq (`llama-3.3-70b-versatile`) on free tier.
**Rationale**: 1000 req/day is sufficient for a personal portfolio chatbot. Very fast
responses (LPU chip). Easy upgrade path to OpenAI GPT-4o-mini via env var.
**Trade-off**: 1000 req/day hard cap. If portfolio goes viral, chatbot degrades. The
`LLM_PROVIDER=openai` upgrade path is the mitigation.

### 5. Database ORM — SQLModel (sync)
**Decision**: Use SQLModel with synchronous SQLAlchemy engine (not async).
**Rationale**: Portfolio backend has simple CRUD operations with no concurrency
requirements. Sync SQLModel is simpler to configure with Alembic migrations and
avoids async session management complexity. Neon PostgreSQL works fine with sync psycopg2.
**Trade-off**: Cannot use async DB operations. Not a concern at portfolio traffic scale.

## Complexity Tracking

No constitution violations. No complexity justification needed.
