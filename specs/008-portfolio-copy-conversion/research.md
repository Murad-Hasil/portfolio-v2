# Research: Portfolio Copy Conversion

**Feature**: 008-portfolio-copy-conversion
**Date**: 2026-04-24
**Status**: N/A — No Unknowns

## Summary

All 35 functional requirements have locked before/after values confirmed across a multi-session audit workflow (2026-04-23 to 2026-04-24). No technology choices, no new dependencies, no architecture decisions required.

## Decisions

| Decision | Value | Rationale |
|----------|-------|-----------|
| Edit approach | Surgical text replacement | Copy-only changes; no structural edits needed |
| Execution order | Standalone → Hero → Services/Contact → Data files → RAG KB | Groups by file risk; RAG KB last (triggers Qdrant re-seed) |
| TypeAnimation | Keep component, replace sequence only | Removing the component would be a UI change (out of scope) |
| Tech pills | Replace array values in-place | Changing array length (5→4) is type-safe for string[] |
| RAG sync | Update KB files + re-run seed-rag.py | Constitution mandate — non-negotiable |
| Contact WhatsApp note | Conditional render inside map | Only WhatsApp gets the supporting line; text-only approach cannot target one map item |

## Alternatives Considered

**Remove TypeAnimation entirely (FR-005 Option C)**
- Rejected: Removing a component is a UI structural change, outside copy-only scope
- Chosen: Replace sequence strings only

**Use "potential yearly cost reduction" for stat label (ChatGPT suggestion)**
- Rejected: "Potential" language weakens trust signal significantly
- Chosen: "human FTE vs. this AI system" — accurately describes the system's design purpose without claiming unverified client results
