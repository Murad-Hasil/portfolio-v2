---
id: "0001"
title: Availability Badge Spec
stage: spec
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 003-availability-badge
branch: main
user: brownie
command: /sp.specify
labels: ["spec","availability-badge","hero","profile","003-availability-badge"]
links:
  spec: specs/003-availability-badge/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/003-availability-badge/spec.md
tests:
  - none
---

## Prompt

/sp.specify 003-availability-badge

A potential client lands on the portfolio. Hero shows name, role, tech stack — but nothing tells them if Murad is open to work right now. They have to scroll to Contact or send a message.

Define the spec for a colour-coded availability badge in the Hero section:
- Sourced from context/murad-profile.md → ## Availability block (single source of truth)
- Three states: available (green pulsing dot), busy (amber static), unavailable (red static)
- Data contract: backend GET /profile endpoint → Next.js proxy → Hero.tsx useEffect fetch
- Zero hardcoded status strings — only murad-profile.md controls the badge text
- prefers-reduced-motion must stop the pulse animation

CONSTRAINTS:
- No real-time polling or WebSocket — status is per-deploy
- No admin UI — edit murad-profile.md directly
- No calendar integration

## Response snapshot

Spec created at `specs/003-availability-badge/spec.md`.

**Problem documented**: clients have no instant visual signal of availability on landing.

**User story**: As a prospective client, I want to see availability status at a glance in the hero, so I know whether to reach out now or bookmark for later.

**Data contract defined**:
- Source: `context/murad-profile.md` → `## Availability` block with Status, Label, Note, Hours per week fields
- Backend: `GET /profile` → `{"name": "...", "title": "...", "availability": {"status": "available", "label": "Available for Freelance Work", ...}}`
- Frontend: Next.js proxy at `/api/profile`

**Visual design documented**: badge between `<h1>` and `<TypeAnimation>` in Hero. Tailwind classes for all 3 states. Dot: `w-2 h-2 rounded-full` + `motion-safe:animate-pulse` for available only.

**8 acceptance criteria**: badge visible at 375px/768px/1440px, data from profile.md, 3 colour states, no hardcoding, prefers-reduced-motion respected.

**Files touched**: murad-profile.md, profile.py (new), main.py, api/profile/route.ts (new), Hero.tsx.

## Outcome

- ✅ Impact: Spec fully defined — single-glance availability signal for clients, zero hardcoding, data-driven from markdown file
- 🧪 Tests: none (specification document)
- 📁 Files: specs/003-availability-badge/spec.md
- 🔁 Next prompts: /sp.plan 003-availability-badge
- 🧠 Reflection: Static import at build time was considered (Option A) but rejected — requires redeploy to change status and is inconsistent with existing pattern (other data comes from API). Option B (backend endpoint) chosen for architectural consistency.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): requirements checklist PASS
- Prompt variant (if applicable): null
- Next experiment: /sp.plan to document Option A vs Option B decision as ADR candidate
