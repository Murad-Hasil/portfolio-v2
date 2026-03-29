---
id: "0004"
title: Seed RAG Qdrant Knowledge Base
stage: green
date: 2026-03-24
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T038 T039
labels: ["rag","qdrant","seed","embeddings","fastembed","chatbot"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - scripts/seed-rag.py
  - backend/.env
tests:
  - Qdrant collection "portfolio-knowledge" seeded — 12 vectors confirmed via get_collection()
---

## Prompt

T038 T039

## Response snapshot

T038: Created `scripts/seed-rag.py` — standalone Python script that:
- Adds `backend/` to `sys.path` and loads `backend/.env` via `python-dotenv`
- Imports `app.providers.embeddings.get_embedding` for fastembed BAAI/bge-small-en-v1.5 (384-dim)
- Reads all 6 `.md` files from `context/rag-knowledge-base/` (about, contact, faq, projects, services, skills)
- Chunks each file with word-count proxy (375 words/chunk, 40-word overlap ≈ 500-token/50-token spec)
- Uses delete-then-create pattern for Qdrant collection (recreate_collection deprecated in ≥1.7)
- Upserts `PointStruct` with payload `{text, source, chunk_index, embedding_provider}`

T039: Ran `backend/.venv/bin/python scripts/seed-rag.py` from repo root.
- First attempt failed: `403 Forbidden` — `QDRANT_API_KEY` in `backend/.env` had spurious `key=` prefix
- Fixed: removed `key=` prefix, leaving bare JWT token
- Second run succeeded: **12 vectors upserted** (about=1, contact=1, faq=3, projects=3, services=2, skills=2)
- Verified via `client.get_collection()` → points_count=12

Both tasks marked [x] in specs/001-portfolio-vision/tasks.md.

## Outcome

- ✅ Impact: US2 RAG data layer ready — "portfolio-knowledge" Qdrant collection has 12 vectors searchable by cosine similarity; chat endpoint can query immediately
- 🧪 Tests: Qdrant get_collection() confirms 12 vectors, dim=384, COSINE distance
- 📁 Files: scripts/seed-rag.py created; backend/.env QDRANT_API_KEY corrected
- 🔁 Next prompts: T040 (POST /chat backend endpoint), T041 (Next.js /api/chat route), T042 (ChatWidget component), T043 (wire into page.tsx), T044 (Playwright verification)
- 🧠 Reflection: Qdrant API key format issue (bare JWT vs `key=JWT`) is easy to miss when copying from dashboard — always test with a direct `qdrant_client.get_collections()` call before bulk seeding. Word-count proxy chunking works well without requiring a tokenizer dependency.

## Evaluation notes (flywheel)

- Failure modes observed: QDRANT_API_KEY had `key=` prefix causing 403 — fixed by stripping prefix
- Graders run and results (PASS/FAIL): Qdrant get_collection() points_count=12 PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Run T040-T044 to complete US2 chatbot pipeline
