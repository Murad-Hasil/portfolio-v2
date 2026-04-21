# Research: Content Copy Update

**Feature**: 007-content-copy-update  
**Date**: 2026-04-21  
**Status**: Complete — no unknowns

## Findings

### Decision 1: Change scope is string literals only

- **Decision**: Limit all edits to string content within existing JSX text nodes. No JSX restructuring, no className changes, no prop changes.
- **Rationale**: The spec and user input both state "no styling, layout, or component changes." Framer Motion animation variants, CSS custom properties, and Tailwind classes must be left untouched.
- **Alternatives considered**: None — scope is explicit.

### Decision 2: 4th paragraph in bio uses same `<p>` pattern as existing paragraphs

- **Decision**: The 4th bio paragraph MUST use the identical JSX shape as the existing 3 paragraphs (`<p className="text-base leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>`). The 3rd existing paragraph currently has no `mb-3` — the new 4th paragraph will be the final one and should also omit `mb-3` to preserve spacing.
- **Rationale**: Visual consistency. The last paragraph in the current bio has no bottom margin; the new 4th paragraph takes that role.
- **Alternatives considered**: Adding `mb-3` to all paragraphs uniformly — rejected, unnecessary structural change.

### Decision 3: Apostrophes use JSX escape entity

- **Decision**: Apostrophes in bio copy (e.g., "didn't", "that's", "let's") MUST be written as `&apos;` to match the existing pattern in the file and avoid ESLint/React quote-in-JSX warnings.
- **Rationale**: The existing file already uses `&apos;` consistently (lines 144, 163, 165). Consistency prevents lint errors.
- **Alternatives considered**: Using standard `'` inside JSX string — rejected, triggers React JSX lint rule.

### Decision 4: Stats `as const` — no type changes needed

- **Decision**: The `stats` array uses `as const`. Changing string values from `"4"` / `"Projects"` to `"100%"` / `"Self-Taught"` requires no type annotation changes; the inferred literal types simply update.
- **Rationale**: TypeScript `as const` infers the literal type from the value. Changing the value changes the inferred type without any explicit type annotation edit.
- **Alternatives considered**: None.

## NEEDS CLARIFICATION resolved

None — all details were fully specified in the user's plan input.
