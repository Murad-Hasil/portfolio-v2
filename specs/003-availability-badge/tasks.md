# Tasks — Feature 003: Availability Status Badge

| Field | Value |
|---|---|
| **Status** | ✅ Shipped (2026-04-02) |
| **Date** | 2026-04-02 |
| **Spec ref** | `specs/003-availability-badge/spec.md` |
| **Plan ref** | `specs/003-availability-badge/plan.md` |

---

## Tasks

- [x] **Task 1** — Add `## Availability` block to `context/murad-profile.md`
  - Fields: Status, Label, Note, Hours per week
  - Done: 2026-04-02

- [x] **Task 2** — Create `backend/app/routers/profile.py` ✅ Done: 2026-04-02
  - `GET /profile` reads and parses `context/murad-profile.md`
  - Returns `ProfileResponse` with `name`, `title`, `availability` object
  - Use Pydantic model for response validation
  - Test: `curl http://localhost:8000/profile` returns correct JSON

- [x] **Task 3** — Register profile router in `backend/app/main.py` ✅ Done: 2026-04-02
  - `app.include_router(profile.router)`
  - Test: `GET /profile` accessible and returns 200

- [x] **Task 4** — Create `frontend/src/app/api/profile/route.ts` ✅ Done: 2026-04-02
  - Reads murad-profile.md directly via `fs.readFileSync` (skips backend proxy)
  - Uses `path.resolve(process.cwd(), "..", "context", "murad-profile.md")`
  - Note: direct fs access works because `outputFileTracingRoot` bundles context/ in Vercel serverless
  - Test: `curl http://localhost:3000/api/profile` returns correct JSON

- [x] **Task 5** — Update `frontend/src/components/sections/Hero.tsx` ✅ Done: 2026-04-02
  - `useEffect` fetch `/api/profile` on mount
  - Store `availability` in local state (null initially)
  - Render badge between `<h1>` and `<TypeAnimation>` when data present
  - Badge: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border`
  - Colour map: available=emerald, busy=amber, unavailable=red
  - Dot: `w-2 h-2 rounded-full` + `motion-safe:animate-pulse` for available only
  - No badge rendered on loading/error (silent degradation)

- [x] **Task 6** — Verification ✅ 2026-04-02
  - Screenshots taken at 375px, 768px, 1440px via Playwright MCP
  - Badge renders correctly at all breakpoints: green dot + "Available for Freelance Work"
  - TypeAnimation rotating roles visible below badge
  - Build: zero TypeScript/lint errors (`next build` clean)
