# Plan — Feature 003: Availability Status Badge

| Field | Value |
|---|---|
| **Status** | In Progress |
| **Date** | 2026-04-02 |
| **Spec ref** | `specs/003-availability-badge/spec.md` |

---

## Architecture Decision

**Option A — Static import at build time**
Import `murad-profile.md` content at build time (Next.js RSC). Zero runtime cost.
Downside: requires redeploy to change status.

**Option B — Backend endpoint (chosen)**
`GET /profile` reads `murad-profile.md` at request time. Change status → restart
backend → badge updates. Consistent with how projects/skills/chat routers work.
No special build step needed.

Chosen: **Option B** — consistent with existing architecture pattern.

---

## Layer-by-layer plan

### Layer 1: context/murad-profile.md ✅ (already done)

`## Availability` block added with fields: Status, Label, Note, Hours per week.

---

### Layer 2: backend/app/routers/profile.py

Parse `murad-profile.md` for the `## Availability` section using regex (same
file-read pattern as `projects.py` reads `projects-manifest.json`).

```python
import re, os
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

PROFILE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "context", "murad-profile.md"
)

class Availability(BaseModel):
    status: str       # available | busy | unavailable
    label: str
    note: str
    hours_per_week: int

class ProfileResponse(BaseModel):
    name: str
    title: str
    availability: Availability

def _parse_profile() -> ProfileResponse:
    with open(PROFILE_PATH, encoding="utf-8") as f:
        content = f.read()
    # parse fields with regex
    ...

@router.get("/profile", response_model=ProfileResponse)
def get_profile():
    return _parse_profile()
```

Register in `main.py`:
```python
from app.routers import profile
app.include_router(profile.router)
```

---

### Layer 3: frontend/src/app/api/profile/route.ts

```ts
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000"

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/profile`, { next: { revalidate: 60 } })
  if (!res.ok) return NextResponse.json({}, { status: res.status })
  const data = await res.json()
  return NextResponse.json(data)
}
```

Revalidate every 60 seconds (status won't change faster than that).

---

### Layer 4: frontend/src/components/sections/Hero.tsx

Add a `useEffect` fetch to `/api/profile` on mount. Store result in local state.
Render badge between `<h1>` and `<TypeAnimation>`.

Status → Tailwind colour map:
```ts
const BADGE_STYLES = {
  available: {
    wrapper: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400 motion-safe:animate-pulse",
  },
  busy: {
    wrapper: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
  unavailable: {
    wrapper: "border-red-500/30 bg-red-500/10 text-red-400",
    dot: "bg-red-400",
  },
} as const
```

No badge rendered until data is fetched; no skeleton; degrades silently on error.

---

## Risk

| Risk | Likelihood | Mitigation |
|---|---|---|
| murad-profile.md parse fails (regex) | Low | Log warning server-side, return 500 |
| BACKEND_URL not set in Vercel | Low | Already set for other routes |
| Badge shifts Hero layout on mobile | Low | `inline-flex` doesn't affect block flow |
