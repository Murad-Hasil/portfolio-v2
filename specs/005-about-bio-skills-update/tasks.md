# Tasks: About Bio & Skills Update

**Input**: specs/005-about-bio-skills-update/plan.md + spec.md
**Feature**: 005-about-bio-skills-update

---

## Phase 1: About.tsx — Bio, Badge, Stats

**File**: `frontend/src/components/sections/About.tsx`

- [ ] T001 [US1] Replace bio paragraphs (lines 143–155) with approved 3-paragraph copy
- [ ] T002 [US1] Change badge text from "AI Engineering Graduate" → "AI Engineer" (line 178)
- [ ] T003 [US2] Change stats label from "Hackathons" → "Projects" in the stats array (line 16)

**Checkpoint**: About section shows correct bio, badge reads "AI Engineer", 4th stat reads "4 Projects"

---

## Phase 2: Skills Manifest — Both Copies

**Files**: `context/skills-manifest.json` AND `frontend/context/skills-manifest.json`

- [ ] T004 [P] [US3] Remove "LangChain" entry from `ai_and_agents.items` in root manifest
- [ ] T005 [P] [US3] Add "Prompt Engineering" (advanced) to `ai_and_agents.items` in root manifest
- [ ] T006 [P] [US3] Add "Context Engineering" (intermediate) to `ai_and_agents.items` in root manifest
- [ ] T007 [US3] Copy root manifest to `frontend/context/skills-manifest.json` (keep in sync)

**Checkpoint**: Both manifest copies identical; AI & Agents tab shows Prompt Engineering + Context Engineering, no LangChain

---

## Phase 3: Commit & Deploy

- [ ] T008 git add + commit all 3 files with clear message
- [ ] T009 git push → Vercel auto-deploy triggers
- [ ] T010 Playwright verification: visit `#about` and `#skills` — confirm all SC-001 through SC-005 pass

---

## Dependencies & Execution Order

- T001, T002, T003 → can all be done in one file edit (same file, sequential)
- T004, T005, T006 → parallel (same file, but simple JSON — do in one pass)
- T007 → after T004/T005/T006
- T008 → after all above
- T009 → after T008
- T010 → after Vercel build completes (~30s after T009)
