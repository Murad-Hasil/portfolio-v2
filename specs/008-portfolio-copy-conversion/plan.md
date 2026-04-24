# Implementation Plan: Portfolio Copy Conversion

**Branch**: `008-portfolio-copy-conversion` | **Date**: 2026-04-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/008-portfolio-copy-conversion/spec.md`

## Summary

Copy-only update across 11 files (9 component/data files + 2 RAG knowledge base files), 35 functional requirements. Goal: raise portfolio conversion rating from 5.5/10 to 8–9/10 by replacing developer-facing language with client-facing language throughout. Zero UI changes, zero routing changes, zero schema changes. Constitution mandate requires RAG knowledge base sync and Qdrant re-seed after KB file edits.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 22 (frontend components), Markdown (context files), JSON (manifest)
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19, react-type-animation, Framer Motion — all unchanged
**Storage**: N/A — this feature touches no database, no API, no server-side logic
**Testing**: TypeScript compiler (`tsc --noEmit`) for type safety; manual visual verification via Playwright screenshot at 1440px and 375px
**Target Platform**: Vercel (frontend auto-deploys on push to main)
**Performance Goals**: No impact — copy changes only
**Constraints**: Zero routing breakage, zero TypeScript errors, bio paragraphs and form schema preserved
**Scale/Scope**: 11 files, 35 FRs, all text-node edits

## Constitution Check

*GATE: Must pass before implementation.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First | ✅ PASS | Spec exists at specs/008-portfolio-copy-conversion/spec.md with 35 locked FRs |
| II. Content Authenticity — copy quality | ✅ PASS | All copy targets international clients, no placeholders |
| II. Content Authenticity — stats match murad-profile.md | ✅ PASS (with condition) | About.tsx stats and murad-profile.md Stats section updated together in the same feature — they will match after FR-007 + FR-029 both execute |
| II. Content Authenticity — hardcoded content | ⚠️ PRE-EXISTING VIOLATION | About.tsx stats, Hero.tsx pills/TypeAnimation, Services.tsx data are hardcoded in components rather than read from context/ files. This is a pre-existing violation that this feature does NOT worsen and is NOT tasked to fix (architectural refactor is a separate feature). |
| III. Design System Compliance | ✅ PASS | No UI/styling changes — design system untouched |
| IV. Type Safety | ✅ PASS | techPills is `string[]`, stats is `{value: string, label: string}[]`, SUGGESTED is `string[]` — all type-safe after value replacement |
| V. Accessibility | ✅ PASS | No interactive elements changed |
| VI. RAG Chatbot Grounding | ✅ PASS (with action) | RAG KB files contain stale copy. FR-031–035 mandate KB sync. scripts/seed-rag.py must run after all KB edits. |
| VII. Secrets | ✅ PASS | No secrets involved |

**Gate decision**: PROCEED. Pre-existing hardcoding violation documented; does not block this copy-only feature.

## Project Structure

### Documentation (this feature)

```text
specs/008-portfolio-copy-conversion/
├── plan.md              ← this file
├── research.md          ← Phase 0 output (N/A — no unknowns)
├── spec.md              ← 35 locked FRs
├── checklists/
│   └── requirements.md  ← all pass
└── tasks.md             ← Phase 2 output (/sp.tasks)
```

### Source Files (all edits)

```text
frontend/src/components/sections/
├── Hero.tsx             ← FR-001, FR-004, FR-005
├── About.tsx            ← FR-007
├── Services.tsx         ← FR-009, FR-010
└── Contact.tsx          ← FR-012, FR-013, FR-014, FR-015

frontend/src/components/layout/
└── Footer.tsx           ← FR-021, FR-022

frontend/src/components/
└── ChatWidget.tsx       ← FR-023

frontend/src/components/sections/
└── Skills.tsx           ← FR-025

context/
├── projects-manifest.json    ← FR-017, FR-018
├── murad-profile.md          ← FR-027, FR-028, FR-029
└── rag-knowledge-base/
    ├── about.md              ← FR-031
    ├── services.md           ← FR-032
    ├── contact.md            ← FR-033
    └── faq.md                ← FR-034
```

## Phase 0: Research

No unknowns exist. All 35 FRs have locked before/after values confirmed across multi-session audit. No research tasks required.

**Output**: research.md — marked N/A (all decisions pre-resolved).

## Phase 1: Implementation Design

### Editing Strategy

All edits are **surgical text replacements** — find the exact current string, replace with exact new string. No structural changes to any file.

### Execution Order (dependency-safe)

**Group A — Standalone components (no interdependencies, can execute in any order):**
1. `Skills.tsx` — FR-025 (single h2 text node, lowest risk)
2. `Footer.tsx` — FR-021, FR-022 (tagline + copyright)
3. `ChatWidget.tsx` — FR-023 (SUGGESTED array, 4 strings)
4. `About.tsx` — FR-007 (stats array replacement)

**Group B — Hero (3 related changes in one file):**
5. `Hero.tsx` — FR-001 (H1), FR-004 (TypeAnimation sequence), FR-005 (techPills array)

**Group C — Services and Contact:**
6. `Services.tsx` — FR-009 (RAG name), FR-010 (sub-heading)
7. `Contact.tsx` — FR-012 (H2), FR-013 (sub-copy), FR-014 (WhatsApp note), FR-015 (availability note)

**Group D — Data/context files:**
8. `context/projects-manifest.json` — FR-017, FR-018 (two problem fields)
9. `context/murad-profile.md` — FR-027, FR-028, FR-029

**Group E — RAG Knowledge Base (constitution mandate — must run after all other edits):**
10. `context/rag-knowledge-base/about.md` — FR-031
11. `context/rag-knowledge-base/services.md` — FR-032
12. `context/rag-knowledge-base/contact.md` — FR-033
13. `context/rag-knowledge-base/faq.md` — FR-034
14. Run `scripts/seed-rag.py` — FR-035 (Qdrant re-seed, mandatory per constitution)

### TypeScript Safety Notes

- `techPills` in Hero.tsx is typed as `string[]` — replacing 5 items with 4 items is type-safe
- `stats` in About.tsx is typed as `readonly { value: string; label: string }[]` (const assertion) — replacement is type-safe as long as both fields remain strings
- `SUGGESTED` in ChatWidget.tsx is typed as `string[]` — replacement is type-safe
- No type changes required in any file

### Invariants Verification (must check before each edit)

Before writing any edit, verify:
1. The exact before-value string is present in the file at the expected location
2. No other occurrence of the same string exists that should NOT be changed
3. The after-value does not introduce any TypeScript syntax errors

### Contact.tsx — FR-014 Implementation Detail

FR-014 requires adding a new `<p>` line below the WhatsApp contact entry. The WhatsApp entry is inside `CONTACT_LINKS.map()`. The supporting line should be added as a conditional render specifically for the WhatsApp entry — only the WhatsApp item gets the supporting line.

Pattern: inside the map, detect `label === "WhatsApp"` and render the supporting paragraph after the link.

## Complexity Tracking

| Item | Why | Simpler Alternative Rejected Because |
|------|-----|--------------------------------------|
| FR-014 (WhatsApp note) | Requires conditional render inside a `.map()` — not a simple text replacement | The supporting line applies only to WhatsApp, not to Email or Location. A text-only approach cannot target a single map item. Minimal JSX addition is the smallest viable diff. |
| FR-035 (seed-rag.py) | Shell command required after KB edits | RAG chatbot will answer from stale vectors if not re-seeded. Constitution mandates this. Cannot be skipped. |

## Acceptance Verification

After all 35 FRs are implemented:

1. **TypeScript check**: `cd frontend && npx tsc --noEmit` — must pass with zero errors
2. **Visual check via Playwright**: Screenshot homepage at 1440px and 375px — verify H1, pills, stats, footer all show new copy
3. **Routing check**: Navigate to `#services`, `#about`, `#contact`, `/projects/crm-digital-fte` — all must load without error
4. **RAG check**: Open chat widget, send "What is Murad's title?" and "What services do you offer?" — responses must not contain "Full-Stack Developer" as primary identity or "RAG / Knowledge Base Systems"
5. **Bio check**: About section bio paragraphs must be word-for-word identical to pre-implementation state
6. **Schema check**: Contact form must accept valid submission and reject invalid — Zod schema unchanged
