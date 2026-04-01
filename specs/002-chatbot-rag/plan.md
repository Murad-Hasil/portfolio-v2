# Architecture Plan: 002-chatbot-rag
## RAG Chatbot — Streaming + FAQ Expansion

---

| Field | Value |
|---|---|
| **Feature ID** | 002-chatbot-rag |
| **Status** | Approved |
| **Date** | 2026-04-01 |
| **Spec** | specs/002-chatbot-rag/spec.md |

---

## 1. Decision 1 — Streaming Protocol: SSE vs WebSocket

**Options considered:**

| Option | Pros | Cons |
|---|---|---|
| Server-Sent Events (SSE) | Simple, HTTP/1.1 compatible, works on HF Spaces | One-directional only |
| WebSocket | Bi-directional, low latency | Blocked on HF Spaces free tier, complex setup |
| Polling | Works everywhere | High latency, wasteful |

**Decision: Server-Sent Events (SSE)**

**Rationale:** HF Spaces free tier blocks persistent WebSocket connections. SSE
works over standard HTTP, is natively supported by FastAPI's `StreamingResponse`,
and is sufficient for the one-directional use case (server → client tokens). The
frontend can use the standard `ReadableStream` API.

📋 Architectural decision detected: SSE over WebSocket for streaming — driven by HF Spaces constraints.

---

## 2. Decision 2 — Stream Proxy in Next.js

**Options considered:**

| Option | Pros | Cons |
|---|---|---|
| Direct browser → FastAPI | No proxy overhead | Exposes backend URL, CORS issues |
| Next.js route handler proxy | Hides backend URL, same-origin | Must forward stream correctly |
| Next.js middleware proxy | Transparent | Complex configuration |

**Decision: Next.js route handler proxy (`/api/chat/route.ts`)**

**Rationale:** Consistent with existing pattern — all other API calls go through
Next.js route handlers. The App Router `route.ts` supports `ReadableStream`
responses via the standard `Response` constructor. Backend URL stays private.

**Implementation pattern:**
```typescript
// Pass-through stream from FastAPI
const upstream = await fetch(backendUrl, { method: 'POST', body, headers });
return new Response(upstream.body, {
  headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
});
```

---

## 3. Decision 3 — PostgreSQL Save Timing

**Options considered:**

| Option | Pros | Cons |
|---|---|---|
| Save before streaming starts | Simple | Can't save token count yet |
| Save after stream completes | Accurate token count | Must buffer full response |
| Fire-and-forget background task | Non-blocking | Loses data if process crashes |

**Decision: Save after stream completes (buffer full response in generator)**

**Rationale:** The generator already yields tokens sequentially. Accumulate them
in a list, join after exhaustion, then save to DB. Token count = `len(full_response.split())`.
This is straightforward and keeps the DB accurate. HF Spaces processes rarely
crash mid-stream.

---

## 4. File Change Map

### Backend
```
backend/app/routers/chat.py
  - Change return type: dict → StreamingResponse
  - Add generator function: stream_chat_response()
  - providers/llm.py: add stream=True support for both Groq and OpenAI
```

### Frontend
```
frontend/src/app/api/chat/route.ts
  - Change: parse JSON → proxy ReadableStream

frontend/src/components/chat/ChatWidget.tsx
  - Change: response.json() → ReadableStream reader
  - Add: token-by-token state update
  - Add: typing indicator logic (show until first token)
```

### Knowledge Base
```
context/rag-knowledge-base/faq.md
  - Add: 15+ Q&A pairs across 6 categories
  - Then: re-run scripts/seed-rag.py
```

---

## 5. Non-Goals (explicitly excluded from this plan)

- No schema migrations
- No new dependencies beyond what is already installed
- No changes to Qdrant collection (dimensions, provider)
- No changes to rate limiting logic
- No changes to other endpoints (/contact, /projects, /skills, /health)
