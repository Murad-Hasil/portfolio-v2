# Implementation Plan: Content Copy Update

**Branch**: `007-content-copy-update` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-content-copy-update/spec.md`

## Summary

Replace three hardcoded string literals in two frontend components — hero subtext in `Hero.tsx` (lines 195–198), the bio paragraphs in `About.tsx` (lines 143–167, expanded from 3 to 4 paragraphs), and the 4th stat entry label in `About.tsx` (line 16). No structural, styling, or layout changes.

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 16.2.1 (App Router)  
**Primary Dependencies**: React 19, Framer Motion (no changes to dependencies)  
**Storage**: N/A — no data layer involved  
**Testing**: Visual inspection via Playwright MCP screenshots at 1440px and 375px  
**Target Platform**: Vercel (frontend)  
**Project Type**: Web application (frontend only)  
**Performance Goals**: N/A — string-only change  
**Constraints**: No JSX structure, CSS classes, or component props may be altered  
**Scale/Scope**: 2 files, 3 string literal locations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | ✅ PASS | spec.md exists and is complete |
| II. Content Authenticity — copy | ✅ PASS | Hero subtext and bio are marketing copy, not data |
| II. Content Authenticity — stats | ⚠️ JUSTIFIED DEVIATION | See below |
| III. Design System Compliance | ✅ PASS | Zero UI changes |
| IV. Type Safety & Code Quality | ✅ PASS | String literal change only; `as const` preserved |
| V. Accessibility & Responsiveness | ✅ PASS | No layout or interactive element changes |
| VI–VII | ✅ PASS | Not applicable to this feature |

**Deviation — Principle II (Stats):**

Constitution mandates: `"Experience: 2+ Years, Projects Completed: 10+, Technologies Used: 20+, Hackathons Completed: 4"` read from `context/murad-profile.md`.

The current `stats` array in `About.tsx` is already hardcoded (pre-existing deviation). The user explicitly requests changing the 4th stat from `"4" / "Projects"` to `"100%" / "Self-Taught"` — a branding decision that intentionally diverges from the murad-profile.md stat list. This is an owner-authorized override. The deviation is scoped to this one stat entry and does not affect the other three cards.

*Recommendation for a future task: migrate the About stats array to read from `context/murad-profile.md` to fully comply with Principle II.*

## Project Structure

### Documentation (this feature)

```text
specs/007-content-copy-update/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── quickstart.md        ← Phase 1 output
└── checklists/
    └── requirements.md
```

### Source Code (affected files only)

```text
frontend/src/components/sections/
├── Hero.tsx             ← Change 1: hero subtext (lines 195–198)
└── About.tsx            ← Change 2: stats line 16 | Change 3: bio lines 143–167
```

No new files. No new directories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Hardcoded stat value `"100%" / "Self-Taught"` (Principle II) | Owner explicitly requested this branding stat; no equivalent field exists in murad-profile.md | Adding a new field to murad-profile.md and wiring it through the frontend would require backend/API changes — out of scope for a copy-only update |
