---
id: "0005"
title: US2 Chatbot Implementation T040-T044
stage: green
date: 2026-03-24
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T038 T039
labels: ["chatbot","rag","fastapi","nextjs","chatwidget","playwright","us2"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/database.py
  - backend/app/routers/chat.py
  - frontend/src/app/api/chat/route.ts
  - frontend/src/components/ChatWidget.tsx
  - frontend/src/app/page.tsx
  - tests/e2e/results.md
  - tests/e2e/screenshots/desktop-1440-chatwidget-response.png
  - tests/e2e/screenshots/mobile-375-chatwidget.png
  - specs/001-portfolio-vision/tasks.md
tests:
  - Playwright MCP E2E — 8/8 checks pass (T044)
  - Backend /chat curl — returns real project details from RAG
  - Unknown question fallback verified (correct email in response)
  - Mobile 375px panel opens with suggested questions
---

## Prompt

T038 T039

(Continued from context-compacted session — T038/T039 were already complete; this session implemented T040-T044)

## Response snapshot

**T040**: Created `backend/app/routers/chat.py`:
- POST /chat: validates UUID session_id + message (Pydantic), saves to chat_messages, embeds with get_embedding(), searches Qdrant top 5, builds prompt (system + context + history), calls Groq LLM (max_tokens=300, temp=0.3), saves response + tokens_used, returns {message, session_id, sources}
- GET /chat/{session_id}: returns full message history or 404
- DB operations wrapped in try/except for fault tolerance; 503 only on Qdrant/LLM failure
- Also created `backend/app/database.py` with lazy singleton engine + SQLModel.metadata.create_all() for dev setup

**T041**: Created `frontend/src/app/api/chat/route.ts` — POST proxy to backend /chat; returns 503 on fetch failure

**T042**: Created `frontend/src/components/ChatWidget.tsx`:
- Floating FAB (bottom-right, "Ask me anything" label)
- Slide-up panel (min(400px, calc(100vw-2rem)) × min(520px, calc(100vh-7rem)))
- Header: "Ask about Murad" + "AI assistant · online" + close button
- 4 suggested questions when empty
- MessageBubble: user right (--accent-indigo), bot left (M avatar, --bg-elevated)
- TypingIndicator: 3 bouncing dots animation via Framer Motion
- sessionStorage UUID, Framer Motion AnimatePresence slide-up

**T043**: Updated `frontend/src/app/page.tsx` — imported and added <ChatWidget /> (replaced TODO comment)

**T044**: Playwright MCP E2E — 8/8 checks pass:
1. FAB renders at 1440px
2. Panel opens with correct header
3. 4 suggested questions visible
4. "What AI projects have you built?" → all 4 projects named in response
5. Unknown question → fallback with email address
6-8. Mobile 375px: FAB visible, panel opens, questions rendered

## Outcome

- ✅ Impact: US2 chatbot complete — floating widget answers from Qdrant RAG knowledge base via Groq LLM; handles unknown questions gracefully
- 🧪 Tests: 8/8 Playwright MCP checks PASS
- 📁 Files: 5 new/modified source files + 2 screenshots + results.md updated
- 🔁 Next prompts: T045 (contact form backend), T046 (contact route.ts), T047 (Contact.tsx), T048 (Playwright US3)
- 🧠 Reflection: Wrapping DB operations in try/except allowed the chatbot to function even before Alembic migration runs formally (T059). SQLModel.metadata.create_all() serves as dev-time table creation. The session_id in sessionStorage correctly persists conversation history within a browser session.

## Evaluation notes (flywheel)

- Failure modes observed: none — backend responded correctly on first attempt after Qdrant fix from T039
- Graders run and results (PASS/FAIL): Playwright MCP 8/8 PASS; curl /chat PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Implement US3 contact form (T045-T048)
