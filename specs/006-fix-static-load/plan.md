# Implementation Plan: Fix Projects & Skills Instant Load

**Branch**: `006-fix-static-load` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-fix-static-load/spec.md`

## Summary

Projects and Skills sections were Client Components fetching static JSON via `useEffect + fetch()` on every page load, causing visible loading spinners. The fix moves data reading to the Server Component (`page.tsx`) at build time and passes pre-loaded data as props — eliminating all loading states and converting the homepage to a fully static prerendered page.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19, Framer Motion
**Storage**: `context/projects-manifest.json`, `context/skills-manifest.json` (static JSON files, read via `fs.readFileSync` at build time)
**Testing**: Playwright MCP (visual verification), `npx tsc --noEmit` (type check), `npm run build` (build classification)
**Target Platform**: Vercel (static export, `○ Static` classification)
**Project Type**: Web application — frontend only (`/frontend/`)
**Performance Goals**: Homepage Projects and Skills sections visible with zero additional network requests on page load
**Constraints**: Filter interactivity (Projects) and tab interactivity (Skills) must remain fully functional — cannot convert to pure Server Components
**Scale/Scope**: Single-page portfolio; 4–5 projects, ~20 skills across 4 categories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Spec-First Mandate | Plan backed by spec.md ✓ | ✅ PASS |
| II. Content Authenticity | Data still sourced from `context/` JSON files — no hardcoding ✓ | ✅ PASS |
| III. Design System Compliance | No UI changes — existing components unchanged ✓ | ✅ PASS |
| IV. Type Safety | Exported `Project` and `SkillsData` types; no `any` used ✓ | ✅ PASS |
| V. Accessibility | No HTML structure changes ✓ | ✅ PASS |
| VI. RAG Chatbot | `/api/projects` and `/api/skills` routes untouched — chatbot unaffected ✓ | ✅ PASS |
| VII. Secrets & Env | No environment variables involved ✓ | ✅ PASS |

**Result**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-fix-static-load/
├── plan.md              ← This file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output (N/A — no new entities)
├── checklists/
│   └── requirements.md  ← Spec quality checklist (complete)
└── tasks.md             ← Phase 2 output (/sp.tasks)
```

### Source Code (affected files only)

```text
frontend/
├── src/
│   ├── app/
│   │   └── page.tsx                          ← MODIFIED: async, reads manifests, passes props
│   └── components/
│       └── sections/
│           ├── Projects.tsx                  ← MODIFIED: prop-driven, no useEffect
│           └── Skills.tsx                    ← MODIFIED: prop-driven, no useEffect
└── context/
    ├── projects-manifest.json                ← READ at build time (unchanged)
    └── skills-manifest.json                  ← READ at build time (unchanged)
```

**Structure Decision**: Frontend-only change. Backend and API routes untouched. No new files created — only three existing files modified.
