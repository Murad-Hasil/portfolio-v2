# Tasks: Content Copy Update

**Input**: Design documents from `/specs/007-content-copy-update/`  
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | quickstart.md ✅  
**Tests**: No automated tests — verification is visual (Playwright screenshots + build check)  
**Organization**: Tasks grouped by user story; US1 (Hero) is parallel to US2/US3 (About)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files or independent sections)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Web app — all changes are in:  
`frontend/src/components/sections/`

---

## Phase 1: Setup

**Purpose**: Confirm working directory and existing copy before editing

- [x] T001 Confirm branch is `007-content-copy-update` (`git branch --show-current`)
- [x] T002 [P] Read current hero subtext in `frontend/src/components/sections/Hero.tsx` lines 190–198 to confirm baseline
- [x] T003 [P] Read current stats array and bio paragraphs in `frontend/src/components/sections/About.tsx` lines 12–17 and 138–168 to confirm baseline

---

## Phase 2: Foundational

*Not applicable — no shared infrastructure, migrations, or blocking dependencies for this feature. Proceed directly to user story implementation.*

---

## Phase 3: User Story 1 — Hero Value Proposition (Priority: P1) 🎯 MVP

**Goal**: Replace the hero subtext with new human-centric copy that leads with client value.

**Independent Test**: Run `npm run dev` in `/frontend`, open `http://localhost:3000`, read the paragraph beneath the hero headline — it must show the new copy with no layout changes.

### Implementation for User Story 1

- [x] T004 [P] [US1] In `frontend/src/components/sections/Hero.tsx` lines 195–198, replace the inner text of the existing `<motion.p>` with: `I help businesses save time and cut costs by replacing repetitive work with AI systems that run automatically—so you can stop managing manual tasks and focus on growing your business.` — keep all `variants`, `className`, and `style` props unchanged

**Checkpoint**: Hero subtext updated. Old "fraction of the cost" copy is gone. No JSX structure changed.

---

## Phase 4: User Story 3 — 4th Stat Card (Priority: P3)

**Goal**: Update the 4th stat entry to show `100%` / `Self-Taught` instead of `4` / `Projects`.

**Independent Test**: View the About section stat cards — the 4th card must show `100%` as the value and `Self-Taught` as the label. The other 3 cards must be unchanged.

### Implementation for User Story 3

> **Note**: Done before US2 (bio) because it is a single-line change on a different line in the same file, reducing the risk of a diff conflict when the bio edit is applied next.

- [x] T005 [P] [US3] In `frontend/src/components/sections/About.tsx` line 16, change `{ value: "4", label: "Projects" }` to `{ value: "100%", label: "Self-Taught" }` — leave the surrounding `as const` array and the other 3 stat entries untouched

**Checkpoint**: 4th stat card data updated. Other stats unchanged.

---

## Phase 5: User Story 2 — About Bio (Priority: P2)

**Goal**: Replace the 3-paragraph bio with 4 refined paragraphs. All JSX structure, className, and style props must remain identical.

**Independent Test**: Scroll to the About section — exactly 4 `<p>` elements must be visible with the new copy. No layout, spacing, or animation change is detectable.

### Implementation for User Story 2

- [x] T006 [US2] In `frontend/src/components/sections/About.tsx` lines 143–167, replace the existing 3 `<p>` elements with the following 4, preserving the wrapping `<motion.div>` and all surrounding markup:

  **Paragraph 1** (`mb-3` class, same `style` prop):
  ```
  I started my journey as a full-stack developer, but I kept noticing a recurring problem: businesses didn&apos;t just need more apps, they needed their work done faster and without the manual headache. That&apos;s what pushed me into the world of AI automation.
  ```

  **Paragraph 2** (`mb-3` class, same `style` prop):
  ```
  Since 2023, I&apos;ve been building production-ready AI systems that handle real tasks—like customer support, internal workflows, and data processing. My focus is simple: build something that actually works in the real world, not just a demo.
  ```

  **Paragraph 3** (`mb-3` class, same `style` prop):
  ```
  What makes my approach different is how I plan before building. I follow a &apos;spec-driven&apos; workflow where requirements, architecture, and edge cases are defined upfront. This reduces surprises, keeps systems clean, and makes them easier to scale.
  ```

  **Paragraph 4** (no `mb-3` — this is the final paragraph, same `style` prop):
  ```
  I care about keeping things simple, reliable, and genuinely useful. If repetitive work is slowing your team down or you want to add AI to your workflow, let&apos;s talk.
  ```

  All 4 paragraphs use: `className="text-base leading-relaxed"` (+ `mb-3` for first 3) and `style={{ color: "var(--text-secondary)" }}`.

**Checkpoint**: Bio shows exactly 4 paragraphs. All apostrophes use `&apos;`. No className or style props changed.

---

## Phase 6: Build Verification & Visual Sign-Off

**Purpose**: Confirm zero TypeScript errors and no visual regressions

- [x] T007 Run `cd frontend && npm run build` — must exit 0 with no TypeScript or JSX errors
- [x] T008 [P] Screenshot the hero section at 1440px width via Playwright MCP — confirm new subtext is visible, layout unchanged
- [x] T009 [P] Screenshot the About section at 1440px width via Playwright MCP — confirm 4 bio paragraphs and correct 4th stat card
- [x] T010 [P] Screenshot the About section at 375px width via Playwright MCP — confirm no wrapping issues on mobile for `Self-Taught` label or new bio paragraphs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T002 and T003 run in parallel
- **US1 (Phase 3)**: No dependencies on US2/US3 — can start after T001 completes
- **US3 (Phase 4)**: No dependencies on US1 — can run in parallel with Phase 3 (different lines in `About.tsx`)
- **US2 (Phase 5)**: Must run after T005 (US3) to avoid diff conflicts in the same file
- **Build & Visual (Phase 6)**: Depends on T004, T005, T006 all complete

### User Story Dependencies

- **US1 (P1)**: Independent — touches only `Hero.tsx`
- **US3 (P3)**: Independent from US1 — single line in `About.tsx`; run after T003 baseline read
- **US2 (P2)**: Touches same file as US3 — run US3 first to keep diffs clean

### Parallel Opportunities

- T002 + T003 (baseline reads) — parallel
- T004 (US1) + T005 (US3) — parallel (different files / different line ranges)
- T008 + T009 + T010 (screenshots) — parallel

---

## Parallel Example: Phases 3 + 4

```bash
# These two tasks touch different files and can run simultaneously:
Task A: T004 — Edit Hero.tsx lines 195–198
Task B: T005 — Edit About.tsx line 16
# Then sequentially:
Task C: T006 — Edit About.tsx lines 143–167 (after T005)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup reads (T001–T003)
2. Complete T004: Hero copy update
3. **STOP and VALIDATE**: Run dev server, confirm hero subtext
4. Continue with About changes if hero passes

### Incremental Delivery

1. T001–T003 → baseline confirmed
2. T004 + T005 (parallel) → Hero and stat updated
3. T006 → Bio updated
4. T007–T010 → Build + screenshots pass
5. Feature complete — open PR

---

## Notes

- `&apos;` must be used for all apostrophes in JSX text nodes (ESLint rule: `react/no-unescaped-entities`)
- The 4th bio paragraph intentionally has no `mb-3` — it is the terminal paragraph in the block
- `as const` on the stats array requires no type annotation changes — changing the literal values is sufficient
- No files other than `Hero.tsx` and `About.tsx` are touched by this feature
