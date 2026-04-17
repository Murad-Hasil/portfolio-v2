# Research: Fix Projects & Skills Instant Load

**Feature**: 006-fix-static-load
**Date**: 2026-04-17
**Status**: Complete — no open questions

## Decision 1: Data Loading Strategy

**Decision**: Read manifest JSON in the Server Component (`page.tsx`) at build time using `fs.readFileSync`, pass data as props to Client Components.

**Rationale**:
- `page.tsx` is already a Server Component (no `"use client"` directive). It can use Node.js `fs` directly with zero additional setup.
- `next.config.ts` already sets `outputFileTracingRoot` to the repo root, which bundles `context/` files into the Vercel serverless function. The same config that enables `/api/projects` also enables `page.tsx` to read the same files.
- Passing pre-loaded data as props is the standard Next.js App Router pattern for hydrating Client Components with server-fetched data — no additional libraries needed.

**Alternatives Considered**:

| Option | Description | Rejected Because |
|--------|-------------|-----------------|
| Convert to Server Components | Remove `"use client"`, make Projects/Skills async server components | Cannot use `useState` for filter/tab interactivity in Server Components |
| Static import JSON | `import data from "../../context/projects-manifest.json"` | Next.js bundles imported JSON into the client JS bundle — increases client payload |
| Keep client fetch, add skeleton UI | Replace spinner with shimmer skeleton cards | Still introduces a loading state; data is static and can be pre-loaded for free |
| SWR / React Query with prefetch | Use data-fetching libraries with server-side prefetch | Adds library dependency for a problem that `fs.readFileSync` in a Server Component solves natively |

## Decision 2: Type Exports

**Decision**: Export `Project` type from `Projects.tsx` and `SkillsData`/`SkillCategory`/`SkillItem` types from `Skills.tsx` for use in `page.tsx`.

**Rationale**:
- `page.tsx` needs to type the props it passes. Re-declaring the types in `page.tsx` would create duplication and drift risk.
- Exporting from the component file keeps types co-located with the data shape they describe.

**Alternatives Considered**:

| Option | Description | Rejected Because |
|--------|-------------|-----------------|
| Declare types in a shared `types.ts` file | Central type file | Creates a new file for a simple change — over-engineering for 2 types |
| Use `any` for props in page.tsx | No typing | Violates Constitution Principle IV (no `any`) |

## Decision 3: API Routes Preservation

**Decision**: `/api/projects` and `/api/skills` routes are left completely unchanged.

**Rationale**:
- The RAG chatbot backend calls these routes at runtime.
- Other potential consumers (OG image routes, future pages) may depend on them.
- Removing them would be a breaking change with no benefit to this feature.

## Resolved: No Open Questions

All decisions above were clear from existing codebase context. No external research was required.
