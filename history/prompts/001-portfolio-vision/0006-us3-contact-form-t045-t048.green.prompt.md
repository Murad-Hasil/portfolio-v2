---
id: "0006"
title: US3 Contact Form T045-T048
stage: green
date: 2026-03-24
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T045 to T048
labels: ["contact","form","rate-limit","zod","react-hook-form","fastapi","playwright","us3"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/_limiter.py
  - backend/app/routers/contact.py
  - backend/app/main.py
  - frontend/src/app/api/contact/route.ts
  - frontend/src/components/sections/Contact.tsx
  - frontend/src/app/page.tsx
  - tests/e2e/results.md
  - tests/e2e/screenshots/desktop-1440-contact-success.png
  - tests/e2e/screenshots/desktop-1440-contact-validation-errors.png
  - tests/e2e/screenshots/desktop-1440-contact-rate-limit.png
  - specs/001-portfolio-vision/tasks.md
tests:
  - Playwright MCP E2E — 8/8 checks pass (T048)
  - Backend /contact curl — returns 201 with reference 20260324-0001
  - Zod inline validation — email, subject, service, message errors all fire correctly
  - Rate limit 429 — triggered on 4th submission within 1 hour
---

## Prompt

T045 to T048

## Response snapshot

**T045**: Created `backend/app/_limiter.py` (shared slowapi Limiter singleton) + `backend/app/routers/contact.py`:
- POST /contact with Pydantic ContactForm (name max 100, email EmailStr, subject max 200, service enum, message min 20)
- HTML-tag sanitisation with regex before storage
- Reference generation: YYYYMMDD-XXXX format, count today's existing contacts for sequential suffix
- @limiter.limit("3/hour") decorator on async endpoint
- Saves to contacts table via SQLModel; returns 201 {success, reference, message}
- Updated main.py to import shared limiter from _limiter.py

**T046**: Created `frontend/src/app/api/contact/route.ts` — POST proxy to backend /contact; forwards all status codes including 422 and 429

**T047**: Created `frontend/src/components/sections/Contact.tsx`:
- Left panel: Email/WhatsApp/Location contact info, GitHub/LinkedIn icons, "// Available for freelance" note
- Right panel: react-hook-form + zod schema (same validation rules as backend)
- States: idle → loading (spinner) → success (reference number + "Send another message") | error | ratelimit
- Field components: Field helper with label + inline error, inputClass() for border color
- Wired Contact into frontend/src/app/page.tsx (replaced TODO comment)

**T048**: Playwright MCP E2E — 8/8 checks pass:
1. Contact section renders with all info
2. Valid submission → success state with reference 20260324-0002
3. Success state displays reference in JetBrains Mono cyan
4-7. Invalid inputs → inline red errors (email/subject/service/message)
8. 4th submission → "Too Many Requests" state with email fallback

## Outcome

- ✅ Impact: US3 contact form complete — visitors can submit enquiries, receive YYYYMMDD-XXXX reference numbers; validation and rate limiting both work end-to-end
- 🧪 Tests: 8/8 Playwright MCP checks PASS
- 📁 Files: 6 new/modified source files + 3 screenshots + results.md updated
- 🔁 Next prompts: T049 (analytics router), T050-T052 (MCP server US4), T059 (Alembic migration), T060-T063 (Phase 7 Polish)
- 🧠 Reflection: Extracting the limiter to _limiter.py avoids circular import between main.py and routers. Zod client-side validation mirrors Pydantic server-side rules — zero wasted API calls for obviously invalid inputs. Sequential reference counter (COUNT per today) is simple and collision-free for personal portfolio scale.

## Evaluation notes (flywheel)

- Failure modes observed: none — all checks passed first run
- Graders run and results (PASS/FAIL): Playwright MCP 8/8 PASS; curl /contact 201 PASS; rate limit 429 PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Implement Phase 7 Polish (T059 Alembic migration, T060 full E2E suite, T061 production build)
