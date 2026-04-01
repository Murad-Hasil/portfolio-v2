# Feature Spec: 002-chatbot-rag
## RAG Chatbot — Streaming + FAQ Expansion

---

| Field | Value |
|---|---|
| **Feature ID** | 002-chatbot-rag |
| **Status** | In Progress |
| **Author** | Murad Hasil |
| **Date** | 2026-04-01 |
| **Constitution Version** | 1.2.0 |
| **Portfolio-Spec Version** | 1.3 |
| **Depends On** | 001-portfolio-vision (shipped) |

---

## 1. Executive Summary

The RAG chatbot was shipped in Portfolio-Spec v1.2 as a stateless, batch-response
system. This spec defines two targeted improvements for v1.3 that deliver the
highest UX impact with the lowest added complexity:

1. **FAQ knowledge base expansion** — 15+ recruiter/client Q&As added to `faq.md`
2. **Streaming responses** — tokens stream to the browser as they are generated

Improvements explicitly deferred from this scope (tracked below under Out of Scope):
conversation memory, hybrid/BM25 search, reranking, query expansion.

---

## 2. Current State (As-Is)

### 2.1 RAG Pipeline

```
User message
    → fastembed (local, 384-dim BAAI/bge-small-en-v1.5)
    → Qdrant cosine search (top 5 chunks)
    → Build prompt (system + context chunks + user message)
    → Groq Llama 3.3 70B (or OpenAI via LLM_PROVIDER)
    → Return full response as JSON { message, session_id, sources }
    → Save to PostgreSQL chat_messages
```

### 2.2 Known Limitations

| Limitation | Impact | Priority |
|---|---|---|
| No streaming — user waits for full response | Poor UX on long answers | High |
| FAQ.md has sparse content | Chatbot can't answer common recruiter Qs | High |
| No conversation memory | Follow-ups ("tell me more") fail | Medium |
| Pure vector search (no BM25) | Exact keyword misses on small corpus | Low (15 vectors) |

### 2.3 Corpus State

- 15 vectors in Qdrant `portfolio-knowledge` collection
- 6 KB files: `about.md`, `skills.md`, `projects.md`, `services.md`, `faq.md`, `contact.md`
- Chunking: word-count (375 words, 40-word overlap)
- `projects.md`: 6 chunks — fully updated with hackathon context, phases, modules
- `faq.md`: sparse — the main gap for recruiter queries

---

## 3. Target State (To-Be)

### 3.1 FAQ Expansion

`context/rag-knowledge-base/faq.md` updated with Q&As in these categories:

- **Projects** — "What is your strongest project?", "Tell me about the Todo hackathon", "Do you have live demos?"
- **Tech stack** — "Have you worked with Kubernetes?", "What AI frameworks do you use?", "Do you know RAG?"
- **Freelancing** — "Are you available for hire?", "What is your timezone?", "Do you work with international clients?"
- **Pricing** — "What is your rate?", "What do you charge for a chatbot?"
- **Methodology** — "What is spec-driven development?", "Do you use Claude Code?"
- **Education** — "Where did you study?", "Are you GIAIC student?"

After updating, re-run `scripts/seed-rag.py` to refresh Qdrant vectors.

### 3.2 Streaming — Backend

`POST /chat` endpoint changes:
- Return `StreamingResponse` with `Content-Type: text/event-stream`
- Each SSE event: `data: {"token": "<text>", "done": false}\n\n`
- Final event: `data: {"token": "", "done": true, "session_id": "...", "sources": [...]}\n\n`
- PostgreSQL save happens after generator exhausts (tokens_used calculated from full response)
- Groq and OpenAI providers both support `stream=True` on chat completions

### 3.3 Streaming — Frontend

`/frontend/src/app/api/chat/route.ts`:
- Proxy SSE stream from FastAPI to browser using `ReadableStream`
- Pass through `Content-Type: text/event-stream` header

`/frontend/src/components/chat/ChatWidget.tsx`:
- Replace `response.json()` with `ReadableStream` reader
- Append tokens to assistant message as they arrive
- Show typing indicator until first token received, then hide
- On `done: true`: finalise, store sources

---

## 4. Acceptance Criteria

### 4.1 FAQ Expansion
- [ ] `faq.md` contains ≥15 Q&A pairs across 6 categories
- [ ] `seed-rag.py` completes without errors after update
- [ ] Chatbot correctly answers: "What hackathons have you done?"
- [ ] Chatbot correctly answers: "What is your timezone?"
- [ ] Chatbot correctly answers: "Do you have a live demo for the Todo project?"

### 4.2 Streaming Backend
- [ ] `POST /chat` returns `Content-Type: text/event-stream`
- [ ] Tokens arrive in chunks (not one big response)
- [ ] Final event contains `done: true` with `session_id` and `sources`
- [ ] Message saved to PostgreSQL after stream ends
- [ ] Works with `LLM_PROVIDER=groq` (default) and `LLM_PROVIDER=openai`

### 4.3 Streaming Frontend
- [ ] ChatWidget shows tokens arriving word by word
- [ ] Typing indicator visible before first token, disappears on first token
- [ ] No layout jump or flicker during streaming
- [ ] Works on mobile (375px viewport)
- [ ] Works if stream is interrupted (shows partial message, no crash)

---

## 5. Out of Scope

The following are NOT part of this spec. They are explicitly deferred.

| Item | Reason Deferred | When to Revisit |
|---|---|---|
| Conversation memory (last N turns) | Requires Redis or DB session logic — separate scope | After streaming ships |
| Hybrid search (BM25 + vector) | Marginal gain at 15 vectors, significant complexity | When corpus > 200 vectors |
| Reranking (Cohere/Groq) | Same — overkill at current scale | When corpus > 200 vectors |
| Query expansion | Adds latency, limited gain on portfolio Q&A | Future |
| OpenAI embeddings upgrade | Requires full Qdrant collection recreate | When upgrading LLM provider |

---

## 6. Constraints

- No changes to Qdrant collection schema (dimensions stay 384, provider stays fastembed)
- No changes to PostgreSQL schema for this phase
- SSE streaming must be compatible with Hugging Face Spaces (no WebSocket — HF Spaces blocks long-lived WS on free tier)
- Frontend streaming must work with Next.js App Router `route.ts` handlers
- Must not break existing `/chat` session_id and history storage

---

## 7. Risks

1. **HF Spaces SSE timeout**: HF Spaces free tier may kill long-lived connections after 60s. Mitigation: keep responses concise (max 300 tokens), add timeout handling in frontend.
2. **Next.js route handler stream proxy**: App Router `route.ts` has specific requirements for streaming. Must use `Response` with `ReadableStream`, not a plain `NextResponse`.
3. **Groq stream API changes**: Groq's Python SDK streaming interface may differ from OpenAI's. Verify both providers during implementation.
