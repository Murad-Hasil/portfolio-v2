# Tasks: Fix Projects & Skills Instant Load

**Input**: Design documents from `/specs/006-fix-static-load/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓
**Tests**: No test tasks — visual verification via Playwright MCP and `npm run build` classification check.
**Feature Branch**: `006-fix-static-load`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites — manifests exist, build passes baseline.

- [x] T001 Confirm `frontend/context/projects-manifest.json` exists and is valid JSON
- [x] T002 Confirm `frontend/context/skills-manifest.json` exists and is valid JSON
- [x] T003 Confirm `frontend/src/app/page.tsx` is a Server Component (no `"use client"` directive)

**Checkpoint**: Manifests verified, page.tsx confirmed as Server Component — implementation can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Export types from component files so `page.tsx` can type props without duplication.

**⚠️ CRITICAL**: Both User Stories depend on `page.tsx` reading manifests and passing typed props — type exports must be in place first.

- [x] T004 Export `Project` type from `frontend/src/components/sections/Projects.tsx`
- [x] T005 [P] Export `SkillsData`, `SkillCategory`, `SkillItem` types from `frontend/src/components/sections/Skills.tsx`

**Checkpoint**: Types exported — `page.tsx` can now import and use them for prop typing.

---

## Phase 3: User Story 1 — Visitor Sees Project Cards Instantly (Priority: P1) 🎯 MVP

**Goal**: Projects section renders with pre-loaded data — no `useEffect`, no `fetch`, no loading state.

**Independent Test**: Load homepage → scroll to Projects → project cards visible immediately. Open DevTools Network tab → no request to `/api/projects` on page load. Click filter tab → cards update instantly.

- [x] T006 [US1] In `frontend/src/app/page.tsx`: add `fs` and `path` imports; add `readJson<T>()` helper that reads from `frontend/context/`
- [x] T007 [US1] In `frontend/src/app/page.tsx`: call `readJson` for `projects-manifest.json`; sort by `featured` descending; pass as `initialProjects` prop to `<Projects />`
- [x] T008 [US1] In `frontend/src/components/sections/Projects.tsx`: add `ProjectsProps` interface with `initialProjects: Project[]`; update function signature to accept prop
- [x] T009 [US1] In `frontend/src/components/sections/Projects.tsx`: remove `useState` for `loading` and `error`; remove `useEffect` + `fetch` block; initialize filter state only
- [x] T010 [US1] In `frontend/src/components/sections/Projects.tsx`: replace `loading ? … : error ? … : <grid>` with direct `<AnimatePresence>` grid — no loading/error branches
- [x] T011 [US1] Run `npx tsc --noEmit` in `frontend/` — zero TypeScript errors on modified files
- [x] T012 [US1] Run `npm run build` in `frontend/` — verify homepage route shows `○ (Static)` in build output

---

## Phase 4: User Story 2 — Visitor Sees Skill Tabs & Cards Instantly (Priority: P2)

**Goal**: Skills section renders with pre-loaded data — no `useEffect`, no `fetch`, tabs active from first render.

**Independent Test**: Load homepage → scroll to Skills → tabs and skill cards visible immediately. Open DevTools Network tab → no request to `/api/skills` on page load. Click different tab → skills switch instantly.

- [x] T013 [US2] In `frontend/src/app/page.tsx`: call `readJson` for `skills-manifest.json`; pass result as `initialData` prop to `<Skills />`
- [x] T014 [US2] In `frontend/src/components/sections/Skills.tsx`: add `SkillsProps` interface with `initialData: SkillsData`; update function signature to accept prop
- [x] T015 [US2] In `frontend/src/components/sections/Skills.tsx`: remove `useState` for `data` and `error`; remove `useEffect` + `fetch` block; initialise `activeTab` with `Object.keys(initialData.skills)[0]`
- [x] T016 [US2] In `frontend/src/components/sections/Skills.tsx`: remove `if (error)` early-return branch; replace `data?.skills` / `data?.skills[activeTab]` reads with `initialData.skills` directly
- [x] T017 [US2] Run `npx tsc --noEmit` in `frontend/` — zero TypeScript errors across all modified files
- [x] T018 [US2] Run `npm run build` in `frontend/` — homepage still `○ (Static)`, no build errors

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Visual verification and final acceptance check.

- [ ] T019 [P] Use Playwright MCP to screenshot homepage at 1440px — confirm Projects section shows cards (not spinner), Skills section shows tabs and cards
- [ ] T020 [P] Use Playwright MCP to screenshot homepage at 375px (mobile) — confirm same instant render on mobile viewport
- [ ] T021 Open browser DevTools Network tab on live/local homepage — confirm zero requests to `/api/projects` or `/api/skills` on initial page load
- [ ] T022 Verify `/api/projects` and `/api/skills` routes still respond correctly (chatbot dependency check) — `curl` or browser fetch to confirm 200 OK

---

## Dependencies

```
T001, T002, T003          ← Phase 1: no deps
T004, T005                ← Phase 2: depends on Phase 1
T006 → T007 → T008–T010  ← US1 sequential within phase
T011, T012                ← US1 verification: depends on T006–T010
T013 → T014 → T015–T016  ← US2 sequential within phase (can start after T005)
T017, T018                ← US2 verification: depends on T013–T016
T019, T020, T021, T022    ← Polish: depends on all phases complete
```

## Parallel Opportunities

**After Phase 2 complete:**
- US1 (T006–T012) and US2 (T013–T018) can run in parallel — they modify different files (`Projects.tsx` vs `Skills.tsx`) and both depend only on `page.tsx` which handles both at once.

**Within Polish:**
- T019 and T020 (screenshots) can run in parallel
- T021 and T022 (network checks) can run in parallel

## Implementation Strategy

**MVP scope**: US1 only (T001–T012) — Projects section instant load is the highest-priority trust signal.

**Full delivery**: US1 + US2 together (T001–T022) — both sections fixed in one deployment, since `page.tsx` change is shared.

**Recommended**: Deliver US1 + US2 together — `page.tsx` is modified for both; splitting into two deployments adds unnecessary risk.
