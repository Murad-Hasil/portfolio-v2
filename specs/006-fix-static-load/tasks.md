# Tasks: Fix Static Load — Vercel Path Resolution

**Input**: Design documents from `specs/006-fix-static-load/`  
**Branch**: `006-fix-static-load`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no mutual dependencies)
- **[Story]**: User story this task satisfies (US1, US2)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Scan & Confirm Scope)

**Purpose**: Confirm no other `process.cwd()` path calls exist outside the known files before making changes.

- [x] T001 Grep for all `process.cwd()` usages in `frontend/src/` — run `grep -rn "process.cwd" frontend/src/` and confirm only `page.tsx`, `api/projects/route.ts`, `api/skills/route.ts`, `opengraph-image.tsx`, and `projects/[slug]/opengraph-image.tsx` appear. Document any unexpected hits before proceeding.

**Checkpoint**: Scope confirmed — 7 files found (2 additional: `api/profile/route.ts` uses `..`, `projects/[slug]/page.tsx` uses no `..`). Plan updated accordingly.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Apply all code and config changes that enable both US1 and US2. MUST complete before verification phases.

**⚠️ CRITICAL**: Phases 3 and 4 cannot be verified until this phase is complete and deployed.

- [x] T002 Create `vercel.json` at the repository root (`/vercel.json`) with the following exact content:
  ```json
  {
    "buildCommand": "npm run build --prefix frontend",
    "outputDirectory": "frontend/.next",
    "installCommand": "npm install --prefix frontend",
    "framework": "nextjs"
  }
  ```

- [ ] T003 [P] Add `outputFileTracingRoot` to `frontend/next.config.ts`
- [x] T003b [P] Fix path call in `frontend/src/app/api/profile/route.ts` — remove `".."` from `path.resolve(process.cwd(), "..", "context", "murad-profile.md")` (discovered during T001 scope scan; required to prevent Hero availability badge breaking after CWD shift). — import `path` at the top and add `outputFileTracingRoot: path.resolve(__dirname, "..")` to the `nextConfig` object so Vercel bundles `context/` into serverless function packages. Final file:
  ```ts
  import path from "path";
  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    outputFileTracingRoot: path.resolve(__dirname, ".."),
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "github.com" },
        { protocol: "https", hostname: "avatars.githubusercontent.com" },
        { protocol: "https", hostname: "raw.githubusercontent.com" },
      ],
    },
  };

  export default nextConfig;
  ```

- [x] T004 [P] Fix path call in `frontend/src/app/opengraph-image.tsx` — on the `fs.readFileSync` call (line ~26), change `path.resolve(process.cwd(), "..", "context", "skills-manifest.json")` to `path.resolve(process.cwd(), "context", "skills-manifest.json")` (remove the `".."`).

- [x] T005 [P] Fix path call in `frontend/src/app/projects/[slug]/opengraph-image.tsx` — on the `fs.readFileSync` call (line ~26), change `path.resolve(process.cwd(), "..", "context", "projects-manifest.json")` to `path.resolve(process.cwd(), "context", "projects-manifest.json")` (remove the `".."`).

- [x] T006 Run local build test from repo root — execute `npm run build --prefix frontend` from the repository root directory (NOT from inside `frontend/`). Confirm: (a) build completes without `ENOENT` errors, (b) Next.js output shows homepage classified as `Static` (○ symbol), (c) no "Failed to load projects" or "Failed to load skills" errors in build output.

**Checkpoint**: All file changes applied, local build passes with `Static` homepage — ready for Vercel deployment.

---

## Phase 3: User Story 1 — Visitor Sees Project Cards Instantly (Priority: P1) 🎯 MVP

**Goal**: All 4 project cards visible on the Vercel deployment with no spinner, no blank section.

**Independent Test**: Load the Vercel preview URL → scroll to Projects section → all 4 project cards appear immediately with no "Loading projects…" message at any point.

### Verify Source Files (read-only, no code changes expected)

- [x] T007 [P] [US1] Verify `frontend/src/app/page.tsx` — read the `readJson` function (lines 15–18) and confirm it uses `path.resolve(process.cwd(), "context", filename)` with no `..` segment. No code change needed; this is the reference implementation.

- [x] T008 [P] [US1] Verify `frontend/src/app/api/projects/route.ts` — read the `readProjectsFromJson` function (lines 5–12) and confirm it uses `path.resolve(process.cwd(), "context", "projects-manifest.json")` with no `..`. No change needed.

### Deploy & Smoke Test

- [ ] T009 [US1] Complete the manual Vercel dashboard step — go to Vercel project Settings → General → Root Directory → change value from `frontend` to `.` (single dot representing repo root) → click Save. **This step is blocking: without it, `vercel.json` has no effect and the fix will not apply.**

- [ ] T010 [US1] Push branch `006-fix-static-load` to origin and wait for Vercel preview build to complete. Confirm in the build log that the install command is `npm install --prefix frontend` (not a bare `npm install`) — this proves Vercel is now building from the repo root.

- [ ] T011 [US1] Smoke test projects — open the Vercel preview URL in a browser, scroll to the Projects section. Verify: (a) all 4 project cards render immediately with no spinner, (b) no "Loading projects…" text appears at any point, (c) clicking a filter tab (e.g., "AI Agents") instantly shows matching cards with no loading state.

**Checkpoint**: US1 complete — 4 project cards visible on Vercel. SC-001, SC-003, SC-004, SC-006 satisfied.

---

## Phase 4: User Story 2 — Visitor Sees Skill Tabs & Cards Instantly (Priority: P2)

**Goal**: Skill category tabs and skill cards visible on Vercel with no loading state.

**Independent Test**: Load the Vercel preview URL → scroll to Skills section → all skill category tabs and the first tab's skill cards appear immediately with no blank area.

### Verify Source File (read-only, no code change expected)

- [ ] T012 [US2] Verify `frontend/src/app/api/skills/route.ts` — read the `readSkillsFromJson` function (lines 5–12) and confirm it uses `path.resolve(process.cwd(), "context", "skills-manifest.json")` with no `..`. No change needed.

### Smoke Test

- [ ] T013 [US2] Smoke test skills — on the same Vercel preview URL from T011, scroll to the Skills section. Verify: (a) skill category tabs are visible immediately with no blank area, (b) the first tab's skill cards render without delay, (c) clicking a different category tab switches skills instantly with no loading state.

**Checkpoint**: US2 complete — skills data visible on Vercel. SC-002, SC-004, SC-005 satisfied.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: OG image regression check and production promotion.

- [ ] T014 [P] Verify OG image routes after fix — open the Vercel preview URL `/opengraph-image` and one project OG URL (e.g., `/projects/crm-digital-fte/opengraph-image`) in a browser or via `curl -I`. Confirm both return HTTP 200 and a valid image. This verifies the `..` removal in T004 and T005 did not break OG generation.

- [ ] T015 Merge `006-fix-static-load` to `main` via pull request. Confirm the production auto-deploy completes. Open the live production URL and repeat T011 and T013 smoke tests to confirm SC-006 on production.

- [ ] T016 Update `specs/006-fix-static-load/spec.md` — change `Status: In Progress` to `Status: Implemented` and update the checklist notes in `checklists/requirements.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Starts after T001 confirms scope. T003, T004, T005 run in parallel. T006 requires T002+T003+T004+T005 all done.
- **Phase 3 (US1)**: Depends on Phase 2 complete. T007, T008 can run in parallel. T009 is blocking manual step before T010. T011 depends on T010.
- **Phase 4 (US2)**: Depends on Phase 2 complete. T012 can run in parallel with T007/T008. T013 depends on T011 (same deployment).
- **Phase 5 (Polish)**: Depends on T011 and T013 both passing.

### Critical Path

```
T001 → T002 + T003 + T004 + T005 (parallel) → T006 → T009 (manual) → T010 → T011 + T013 → T014 → T015 → T016
```

### Parallel Opportunities

- **T003, T004, T005**: Different files — apply all three edits simultaneously.
- **T007, T008, T012**: Read-only verifications — run simultaneously or skip if confident.
- **T012**: Can be done while T010 (Vercel build) is running.
- **T014**: Can run while T015 PR is under review.

---

## Parallel Example: Phase 2

```bash
# Open three files simultaneously in editor:
# frontend/next.config.ts                               → T003
# frontend/src/app/opengraph-image.tsx                  → T004
# frontend/src/app/projects/[slug]/opengraph-image.tsx  → T005
# Then run: npm run build --prefix frontend             → T006
```

---

## Implementation Strategy

### MVP First (US1 — Project Cards on Vercel)

1. T001: Scope scan
2. T002–T005: Apply all file changes (parallel)
3. T006: Local build passes
4. T009: Manual dashboard step (critical gate)
5. T010–T011: Push, deploy, verify 4 project cards
6. **STOP and VALIDATE**: SC-001, SC-003, SC-004, SC-006 satisfied

### Incremental Delivery

1. Phase 2 complete → both US1 and US2 infrastructure in place (one set of changes fixes both)
2. US1 verified (T011) → project cards confirmed
3. US2 verified (T013) → skills confirmed (same deployment, no extra work)
4. OG check + production merge (T014–T016)

### Single-Developer Execution Order (Recommended)

```
T001 → T002 → T003+T004+T005 → T006 → T007+T008+T012 → T009 (manual) → T010 → T011 → T013 → T014 → T015 → T016
```

---

## Notes

- **T009 is the most likely failure point** — Vercel dashboard Root Directory must be changed to `.` before deployment; `vercel.json` alone is not sufficient.
- **T006 is the local confidence gate** — if `npm run build --prefix frontend` fails from repo root, do not push to Vercel.
- [P] = different files, no mutual dependencies — safe to apply in one editor session.
- No automated tests in scope — acceptance is via manual browser smoke tests (FR-008, SC-006).
- Total tasks: 16 | US1 tasks: 5 | US2 tasks: 2 | Foundational: 5 | Polish: 3 | Setup: 1
