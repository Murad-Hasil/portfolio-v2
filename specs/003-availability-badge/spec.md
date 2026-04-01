# Feature 003 — Availability Status Badge

| Field | Value |
|---|---|
| **Status** | In Progress (v1.4) |
| **Priority** | High — first thing a client's eye hits in Hero |
| **Portfolio-Spec ref** | Section 22, FR-014 |
| **Constitution ref** | Principle II (Content Authenticity) |
| **Branch** | main |
| **Date** | 2026-04-02 |

---

## 1. Problem Statement

A potential client lands on the portfolio. The Hero section shows the name,
role, and tech stack — but nothing tells them **right now** whether Murad is
open to new work. They have to scroll to the Contact section or send a message
to find out.

The availability badge solves this in one glance: a small pill at the very top
of Hero content, before the role line, with a colour-coded dot and one line of
text.

---

## 2. User Story

**As a** prospective freelance client,  
**I want** to see Murad's availability status the moment I land on the portfolio,  
**So that** I know whether to reach out now or bookmark for later — without
reading body text or scrolling.

### Acceptance Criteria

- [ ] A badge is visible in the Hero section at all three breakpoints (375px,
  768px, 1440px) without scrolling.
- [ ] Badge shows a coloured dot + label text sourced from
  `context/murad-profile.md` → `## Availability`.
- [ ] `Status: available` → green pulsing dot + green-tinted badge.
- [ ] `Status: busy` → amber static dot + amber-tinted badge.
- [ ] `Status: unavailable` → red static dot + red-tinted badge.
- [ ] Changing the status in `murad-profile.md` and restarting the backend
  changes the badge with zero frontend code changes.
- [ ] `prefers-reduced-motion` stops the pulse animation (Tailwind
  `motion-safe:animate-pulse`).
- [ ] No status string is hardcoded in any component or API route.

---

## 3. Out of Scope

- Real-time status updates (WebSocket / polling) — status is per-deploy, not live.
- Admin UI to toggle status — edit the markdown file directly.
- Multiple availability slots or calendar integration.

---

## 4. Data Contract

### 4.1 Source of Truth

`context/murad-profile.md` → `## Availability` block:

```markdown
## Availability
- Status: available        # available | busy | unavailable
- Label: Available for Freelance Work
- Note: Open to AI automation, chatbot, and full-stack projects
- Hours per week: 40
```

### 4.2 Backend Response — GET /profile

```json
{
  "name": "Murad Hasil",
  "title": "AI Automation Engineer & Full-Stack Developer",
  "availability": {
    "status": "available",
    "label": "Available for Freelance Work",
    "note": "Open to AI automation, chatbot, and full-stack projects",
    "hours_per_week": 40
  }
}
```

### 4.3 Frontend Proxy — GET /api/profile

Next.js route handler at `frontend/src/app/api/profile/route.ts` proxies to
`BACKEND_URL/profile`. No transformation.

---

## 5. Visual Design

Placement: between `<h1>` name and `<TypeAnimation>` role line in `Hero.tsx`.

```
┌─────────────────────────────────────┐
│  Murad Hasil                        │
│                                     │
│  ● Available for Freelance Work     │  ← badge here
│                                     │
│  AI Automation Engineer ...         │  ← TypeAnimation
└─────────────────────────────────────┘
```

Badge anatomy:
```
[ ● Available for Freelance Work ]
  ^dot   ^label text
```

Tailwind classes:
```
inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
border border-emerald-500/30 bg-emerald-500/10 text-emerald-400   (available)
border border-amber-500/30   bg-amber-500/10   text-amber-400     (busy)
border border-red-500/30     bg-red-500/10     text-red-400       (unavailable)
```

Dot:
```
w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse     (available)
w-2 h-2 rounded-full bg-amber-400                                  (busy)
w-2 h-2 rounded-full bg-red-400                                    (unavailable)
```

---

## 6. Error / Loading States

- **Loading**: render nothing (no skeleton) — badge appears when data arrives.
- **Fetch error**: render nothing — Hero degrades gracefully without the badge.
- No console.log in production (constitution Principle IV).

---

## 7. Files Touched

| File | Change |
|---|---|
| `context/murad-profile.md` | Add `## Availability` block ✅ done |
| `backend/app/routers/profile.py` | New router — `GET /profile` |
| `backend/app/main.py` | Register profile router |
| `frontend/src/app/api/profile/route.ts` | New Next.js proxy |
| `frontend/src/components/sections/Hero.tsx` | Add badge JSX + fetch |
