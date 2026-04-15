# Tasks: 002-chatbot-rag
## RAG Chatbot — Streaming + FAQ Expansion

---

| Field | Value |
|---|---|
| **Feature ID** | 002-chatbot-rag |
| **Status** | ✅ Shipped (2026-04-01) |
| **Date** | 2026-04-01 |
| **Spec** | specs/002-chatbot-rag/spec.md |
| **Plan** | specs/002-chatbot-rag/plan.md |

---

## Task 1 — Update FAQ Knowledge Base

**Status:** ✅ Completed (2026-04-01)
**File:** `context/rag-knowledge-base/faq.md`

### What
Add ≥15 Q&A pairs across 6 categories: projects, tech stack, freelancing,
pricing, methodology, education.

### Acceptance Checks
- [x] faq.md has comprehensive recruiter/client Q&As
- [x] seed-rag.py ran successfully (15 vectors → 17+ vectors expected after)
- [x] No unresolved placeholders in faq.md

---

## Task 2 — Add Streaming to LLM Providers

**Status:** ✅ Completed (2026-04-01)
**File:** `backend/app/providers/llm.py`

### What
Add `stream=True` support to both Groq and OpenAI provider functions so they
yield token chunks instead of returning a full string.

### Implementation
```python
# New function signature
async def stream_llm_response(messages: list[dict]) -> AsyncGenerator[str, None]:
    if LLM_PROVIDER == "groq":
        stream = client.chat.completions.create(
            model=GROQ_MODEL, messages=messages, stream=True, max_tokens=300
        )
        for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            if token:
                yield token
    # OpenAI: same pattern
```

### Acceptance Checks
- [x] Groq provider yields tokens in chunks
- [x] OpenAI provider yields tokens in chunks
- [x] Empty/None delta content handled gracefully (skip, don't yield)
- [x] Generator exhausts cleanly (no dangling connections)

---

## Task 3 — Change /chat Endpoint to StreamingResponse

**Status:** ✅ Completed (2026-04-01)
**File:** `backend/app/routers/chat.py`

### What
Replace `return JSONResponse(...)` with `return StreamingResponse(generator, media_type="text/event-stream")`.
The generator yields SSE-formatted events, saves to DB after completion.

### SSE Format
```
data: {"token": "Hello", "done": false}\n\n
data: {"token": " world", "done": false}\n\n
data: {"token": "", "done": true, "session_id": "uuid", "sources": ["projects.md"]}\n\n
```

### Implementation Notes
- RAG retrieval (embedding + Qdrant search) happens BEFORE streaming starts
- Prompt is built BEFORE streaming starts
- Only the LLM generation step streams
- Full response is accumulated in generator, saved to DB on final event
- `tokens_used` = approximate word count of full response

### Acceptance Checks
- [x] `Content-Type: text/event-stream` in response headers
- [x] `Cache-Control: no-cache` in response headers
- [x] Each data event is valid JSON
- [x] Final event has `done: true` with session_id and sources
- [x] chat_messages row saved to PostgreSQL after stream ends
- [x] Rate limiter still applies (20/hour)
- [x] Invalid session_id still returns 400 (before streaming starts)

---

## Task 4 — Update Next.js API Route to Proxy Stream

**Status:** ✅ Completed (2026-04-01)
**File:** `frontend/src/app/api/chat/route.ts`

### What
Change the route handler from `return NextResponse.json(data)` to passing through
the `ReadableStream` from the FastAPI response.

### Implementation
```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const upstream = await fetch(`${BACKEND_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Acceptance Checks
- [x] Response has `Content-Type: text/event-stream`
- [x] Stream is proxied correctly (not buffered)
- [x] Backend errors (400, 422) are still forwarded with correct status codes
- [x] BACKEND_URL env var used (not hardcoded)

---

## Task 5 — Update ChatWidget to Consume SSE Stream

**Status:** ✅ Completed (2026-04-01)
**File:** `frontend/src/components/chat/ChatWidget.tsx`

### What
Replace the fetch-then-JSON pattern with a ReadableStream reader that appends
tokens to the assistant message as they arrive.

### Implementation Sketch
```typescript
// Replace current fetch logic with:
const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ session_id, message }) });
const reader = response.body!.getReader();
const decoder = new TextDecoder();

// Add placeholder assistant message
setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value);
  // Parse SSE lines: "data: {...}\n\n"
  for (const line of text.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    const event = JSON.parse(line.slice(6));
    if (!event.done) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content += event.token;
        return updated;
      });
    }
    // on done: true — store sources, session_id
  }
}
```

### Acceptance Checks
- [x] Tokens appear word by word in the chat panel
- [x] Typing indicator (3 dots) shows until first token arrives
- [x] Typing indicator disappears on first token (not on done)
- [x] Partial message visible during streaming (not blank then full)
- [x] No layout jump when message grows
- [x] Works on mobile 375px
- [x] Handles stream interruption gracefully (shows partial, no white screen)
- [x] Suggested questions still show on first load

---

## Task 6 — Playwright MCP Verification

**Status:** ✅ Completed (2026-04-01)

### What
Use Playwright MCP to verify the streaming chatbot end-to-end on the live site.

### Test Steps
1. Open https://murad-hasil-portfolio-v2-xi.vercel.app
2. Click the chat widget button
3. Type: "What hackathons have you completed?"
4. Verify: typing indicator appears, then tokens stream in
5. Verify: final answer is accurate (mentions Panaversity Hackathon I and II)
6. Type: "Do you have a live demo for the Todo project?"
7. Verify: chatbot returns the live URL
8. Screenshot: desktop (1440px) and mobile (375px)

### Acceptance Checks
- [x] Streaming visible (tokens arrive progressively)
- [x] Typing indicator behaves correctly
- [x] Answers accurate from updated FAQ
- [x] Mobile layout intact

---

## Completion Criteria

All 6 tasks complete AND:
- CI/CD passes (ESLint + pytest + HF deploy)
- Portfolio-Spec.md v1.3 status updated to SHIPPED
- PHR created for this feature

---

## Deferred Tasks (not in this spec)

| Task | Spec to Create |
|---|---|
| Conversation memory (last 5 turns) | 003-chatbot-memory |
| Hybrid search (BM25 + vector) | 004-chatbot-hybrid-search |
