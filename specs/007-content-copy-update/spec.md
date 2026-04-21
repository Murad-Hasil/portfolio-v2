# Feature Specification: Content Copy Update

**Feature Branch**: `007-content-copy-update`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Update 3 pieces of hardcoded copy in the portfolio frontend to give it a more human and professional feel."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Reads Hero Value Proposition (Priority: P1)

A first-time visitor lands on the portfolio homepage and reads the hero subtext. The text should immediately communicate Murad's value in a human, approachable tone — not a sales pitch.

**Why this priority**: The hero is the first thing any visitor sees. If this copy is off, nothing else matters.

**Independent Test**: Open the homepage, read the paragraph beneath the headline, and confirm it reflects the new human-centric copy.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** they read the hero subtext, **Then** they see the new human-centric copy — not the old "24/7 fraction of cost" text.
2. **Given** the hero subtext is updated, **When** the page is inspected, **Then** no layout, font, spacing, or animation changes are present.

---

### User Story 2 - Visitor Reads the About Bio (Priority: P2)

A recruiter or potential client scrolls to the About section and reads Murad's bio. The updated copy presents 4 well-structured paragraphs that feel personal, credible, and refined.

**Why this priority**: The About section is where intent becomes conviction — it shapes trust.

**Independent Test**: Scroll to About, read all bio paragraphs, confirm 4 paragraphs exist with the updated content.

**Acceptance Scenarios**:

1. **Given** a visitor reaches the About section, **When** they read the bio, **Then** they see exactly 4 paragraphs with new refined copy.
2. **Given** the bio is updated, **When** the section renders, **Then** no structural, styling, or layout changes are introduced.

---

### User Story 3 - Visitor Reads the 4th Stat Card (Priority: P3)

A visitor glances at the stat cards in the About section. The 4th card should read `100%` / `Self-Taught` — a more authentic signal than a raw project count.

**Why this priority**: The stat card is a quick-read credential signal. "Self-Taught" communicates character more meaningfully than "4 Projects".

**Independent Test**: View the About section stat cards and confirm the 4th card shows `100%` and `Self-Taught`.

**Acceptance Scenarios**:

1. **Given** a visitor views the About stat cards, **When** they read the 4th card, **Then** they see `100%` as the value and `Self-Taught` as the label.
2. **Given** the stat is updated, **When** the section renders, **Then** no other stat cards change and no layout shifts occur.

---

### Edge Cases

- If the new bio paragraphs are significantly longer than the originals, does the layout remain intact on all screen sizes?
- If the stat label `Self-Taught` wraps to two lines on small screens, does the card still render correctly?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The hero subtext in `Hero.tsx` (lines 195–198) MUST be replaced with the new human-centric copy provided at implementation time.
- **FR-002**: The About bio block in `About.tsx` (lines 143–167) MUST be updated from 3 paragraphs to 4 paragraphs with refined copy.
- **FR-003**: The 4th stat entry in `About.tsx` (line 16) MUST change its value from `"4"` to `"100%"` and its label from `"Projects"` to `"Self-Taught"`.
- **FR-004**: No component structure, CSS classes, animations, or layout elements MUST be altered as part of this update.
- **FR-005**: All changes MUST be confined to the string literals at the three identified copy locations only.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor reading the hero subtext sees the new human-centric message — the old cost-efficiency framing is gone.
- **SC-002**: The About bio renders exactly 4 paragraphs with the new refined text.
- **SC-003**: The 4th stat card displays `100%` as its value and `Self-Taught` as its label.
- **SC-004**: A visual comparison of the page before and after shows zero layout, styling, or structural changes — only text content differs.

## Assumptions

- The actual new copy text for the hero and bio will be supplied by the user before or during implementation.
- All copy remains hardcoded in the component files — no CMS or external data source is involved.
- The `stats` array uses `as const`; changing string literals requires no type-level changes beyond the literal values themselves.
