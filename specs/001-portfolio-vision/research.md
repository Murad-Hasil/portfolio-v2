# Research: Portfolio Vision

**Feature**: 001-portfolio-vision
**Date**: 2026-03-23
**Sources**: Training knowledge (August 2025 cutoff) — web search unavailable in agent env.
**Spot-check flag**: Verify `qdrant-client` `create_collection` API and Groq model ID
string before implementation begins.

---

## Decision 1: API Call Pattern — Next.js Route Handlers as Proxy

**Decision**: All frontend → backend calls go through Next.js Route Handlers
(`/app/api/.../route.ts`). The browser never calls FastAPI directly.

**Rationale**:
- Keeps `BACKEND_URL` server-side only (not exposed to browser bundle).
- Eliminates CORS entirely: browser talks same-origin (Vercel), FastAPI's CORS only
  needs to allowlist the Railway → Vercel server-to-server call.
- Supports future auth header injection or response caching without touching FastAPI.
- Next.js 15 Route Handlers support `ReadableStream` pass-through for SSE streaming
  (useful if Groq streaming is added later).

**Alternatives considered**:
- Direct browser → FastAPI: simpler but leaks backend URL and requires permissive CORS.
- `next.config.ts` rewrites: CDN-edge proxying, less control over headers.

---

## Decision 2: Rate Limiting — slowapi with MemoryStorage

**Decision**: Use `slowapi` with `limits.storage.MemoryStorage` for `/contact` rate
limiting (3 requests per IP per hour). No Redis.

**Rationale**:
- Zero infrastructure overhead — in-memory, single Railway dyno.
- `slowapi` is the de facto FastAPI rate-limiting library (port of Flask-Limiter).
- Integrates via `app.state.limiter` + `@limiter.limit("3/hour")` decorator.
- Handles `429` responses and error handlers cleanly.

**Alternatives considered**:
- Manual `TTLCache` (cachetools): more code, same result.
- Redis-backed slowapi / fastapi-limiter: correct for multi-instance, overkill here.

**Caveat**: In-memory state is lost on dyno restart. Acceptable for a personal
portfolio — a few extra submissions after restart are not a business risk.

---

## Decision 3: fastembed + Qdrant Integration

**Decision**: `fastembed.TextEmbedding("BAAI/bge-small-en-v1.5")` — 384 dims, Cosine
distance. Use `QdrantClient` with `VectorParams(size=384, distance=Distance.COSINE)`.

**Key implementation details**:
- `embed()` returns a generator of numpy arrays — MUST call `.tolist()` before
  passing to qdrant-client (does not accept numpy directly).
- Use Cosine distance — BGE models are trained for Cosine similarity; Dot or Euclidean
  will produce incorrect ranking.
- `recreate_collection` is deprecated in qdrant-client ≥ 1.7 — use delete-then-create
  or `create_collection` with `if_not_exists=True` guard.
- For provider switch (fastembed → OpenAI): delete collection and recreate with size=1536.
  The `rebuild_rag()` MCP tool handles this.

**Alternatives considered**:
- qdrant-client built-in fastembed integration (`client.add()` / `client.query()`):
  hides the embedding step — less transparent, harder to debug provider switching.

---

## Decision 4: Groq Python SDK

**Decision**: `from groq import Groq` (sync) or `from groq import AsyncGroq` (async).
Model ID: `"llama-3.3-70b-versatile"`.

**Key implementation details**:
- `Groq()` reads `GROQ_API_KEY` from env automatically if not passed explicitly.
- Use `AsyncGroq` for FastAPI async endpoints to avoid blocking the event loop.
- Streaming: pass `stream=True` for `StreamingResponse` — returns `ChatCompletionChunk`.
- Do NOT use `"llama3-70b-8192"` — that is Llama 3.0; `"llama-3.3-70b-versatile"`
  is the correct Llama 3.3 identifier.

**Spot-check**: Verify model ID string is still active on Groq dashboard before
implementing — Groq occasionally aliases or renames models.

---

## Decision 5: SQLModel + Neon PostgreSQL — Sync Engine

**Decision**: Use synchronous SQLModel with `psycopg2` driver. No async SQLAlchemy.

**Rationale**:
- SQLModel async support requires raw SQLAlchemy `async_sessionmaker` — defeats
  SQLModel's ergonomic value.
- Neon + pgbouncer (transaction mode) has a known incompatibility with `asyncpg`
  prepared statements. Sync psycopg2 avoids this entirely.
- Portfolio backend has simple CRUD — no concurrency benefit from async DB.

**Connection string format (Neon direct, non-pooled)**:
```
postgresql://user:pass@ep-<id>.region.aws.neon.tech/dbname?sslmode=require
```

**Key rules**:
- Use the **direct** (non-pooled) URL for FastAPI — Railway manages its own process
  pool; pgbouncer endpoint is for serverless/edge functions only.
- `sslmode=require` is mandatory — Neon enforces TLS.
- Use Alembic for migrations; env var: `DATABASE_URL`.

**Alternatives considered**:
- Async SQLModel + asyncpg: more complexity, prepared-statement cache issue with Neon.
- Neon's Vercel integration injects `POSTGRES_URL` — use `DATABASE_URL` for consistency
  across local dev and Railway.

---

## Decision 6: Dockerfile + Railway Deployment

**Decision**: Minimal Dockerfile with `python:3.12-slim`, `uvicorn` entrypoint.
`railway.json` with healthcheck on `/health`.

**Key details**:
```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "DOCKERFILE" },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30
  }
}
```

**Alternatives considered**:
- Railway Nixpacks (auto-detect): works but less predictable for Python + system deps
  (fastembed may need `libgomp`). Dockerfile is explicit and reproducible.

---

## Decision 7: GitHub Actions CI/CD

**Decision**: Single workflow — lint + test on PR; lint + test + deploy on `main` push.

**Required GitHub Secrets**:

| Secret | Source |
|---|---|
| `VERCEL_TOKEN` | Vercel account → Settings → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |
| `RAILWAY_TOKEN` | Railway → Account → Tokens |
| `RAILWAY_SERVICE_ID` | Railway → Project → Service → Settings |

**Deploy commands**:
- Vercel: `npx vercel --prod --token $VERCEL_TOKEN`
- Railway: `npx @railway/cli@latest redeploy --service $RAILWAY_SERVICE_ID`

---

## Open Spots to Verify Before Implementation

1. Confirm `qdrant-client` version in `requirements.txt` — use `create_collection`
   with `if_not_exists=True` if ≥ 1.7, or `recreate_collection` if < 1.7.
2. Confirm `"llama-3.3-70b-versatile"` is the active Groq model ID at time of
   implementation (check Groq console → Models).
3. Confirm Neon connection string format matches current Neon dashboard (direct URL,
   not pooled, for Railway FastAPI).
