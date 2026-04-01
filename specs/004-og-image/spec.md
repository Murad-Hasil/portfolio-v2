# Feature 004 — Dynamic OG Image

| Field | Value |
|---|---|
| **Status** | In Progress (v1.4) |
| **Priority** | High — every share on LinkedIn/WhatsApp/Twitter shows this |
| **Portfolio-Spec ref** | Section 23, FR-015 |
| **Constitution ref** | Principle III (Design System — OG Images) |
| **Branch** | main |
| **Date** | 2026-04-02 |

---

## 1. Problem Statement

When Murad shares the portfolio link on LinkedIn or a client pastes the URL in
WhatsApp, the platform fetches the OG image at `/opengraph-image`. Currently
that image is **fully hardcoded** — skills, tags, and URL are static strings.
Adding a new skill to `skills-manifest.json` does not update the OG image.

Each project case study page has **no OG image at all** — sharing
`/projects/crm-digital-fte` shows a blank card.

---

## 2. User Stories

**US-1 — LinkedIn share looks professional**
As Murad sharing his portfolio link on LinkedIn,
I want the preview card to show my actual top skills and branding,
So that recruiters see a polished first impression before clicking.

**US-2 — Per-project share shows project context**
As Murad sharing a case study link in a client conversation,
I want the preview to show the project title, tech stack, and a key metric,
So that the client knows what the link is about without clicking.

---

## 3. Acceptance Criteria

- [ ] `GET /opengraph-image` returns 1200×630 PNG with skills from
  `skills-manifest.json` (all `advanced`-level, max 6).
- [ ] `GET /projects/[slug]/opengraph-image` returns unique 1200×630 PNG
  for every slug in `projects-manifest.json`.
- [ ] Per-project image shows: title, category badge, first 4 tech tags,
  first metric — all sourced from `projects-manifest.json`.
- [ ] No skill name, project title, or tech string is hardcoded in any
  `opengraph-image.tsx` file.
- [ ] Only portfolio design tokens are used (no new colours).
- [ ] `next build` completes with zero TypeScript/lint errors.
- [ ] `next.config.ts` has `outputFileTracingRoot` set to repo root.

---

## 4. Design Spec

### 4.1 Shared Design Tokens

```
Background:  #08080F
Accent cyan: #00D4FF
Accent indigo: #6366F1
Accent green: #10B981
Text primary: #E2E8F0
Text muted:   #64748B
Top bar: linear-gradient(90deg, #00D4FF, #6366F1, #10B981)  3px height
Grid overlay: rgba(99,102,241,0.04) 1px lines, 60px spacing
```

### 4.2 Homepage OG Layout (1200×630)

```
┌─────────────────────────────────────────────────────────┐
│▓▓▓ 3px cyan→indigo gradient bar ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                                         │
│  // AI Automation Engineer          ┌──────────────┐   │
│                                     │ agent network │   │
│  Murad Hasil                        │ SVG (right)   │   │
│                                     │               │   │
│  AI Agents · RAG · Full-Stack       │               │   │
│                                     └──────────────┘   │
│  [skill1] [skill2] [skill3]                             │
│  [skill4] [skill5] [skill6]  ← from skills-manifest    │
│                                                         │
│  mbmuradhasil@gmail.com   muradhasil.vercel.app         │
└─────────────────────────────────────────────────────────┘
```

Tag colours alternate: odd = indigo tint, even = cyan tint.

### 4.3 Per-Project OG Layout (1200×630)

```
┌─────────────────────────────────────────────────────────┐
│▓▓▓ 3px cyan→indigo gradient bar ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                                         │
│  [AI Agents]                     ← category badge       │
│                                                         │
│  CRM Digital FTE                 ← title (large)        │
│  Omnichannel AI Customer...      ← description (small)  │
│                                                         │
│  [OpenAI Agents] [FastAPI] [Kubernetes] [Kafka]         │
│                                                         │
│  ✦ Handles 3 channels simultaneously  ← first metric   │
│                                                         │
│  mbmuradhasil@gmail.com   muradhasil.vercel.app/projects│
└─────────────────────────────────────────────────────────┘
```

Category → colour mapping:

| Category | Colour |
|---|---|
| AI Agents | indigo `#6366F1` |
| AI Automation | indigo `#6366F1` |
| Full-Stack + AI | cyan `#00D4FF` |
| Full-Stack | cyan `#00D4FF` |

---

## 5. Files Touched

| File | Change |
|---|---|
| `frontend/next.config.ts` | Add `outputFileTracingRoot` |
| `frontend/src/app/opengraph-image.tsx` | nodejs runtime, dynamic skills |
| `frontend/src/app/projects/[slug]/opengraph-image.tsx` | New file |
