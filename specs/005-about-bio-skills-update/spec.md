# Feature Specification: About Bio & Skills Update

**Feature Branch**: `005-about-bio-skills-update`
**Created**: 2026-04-16
**Status**: Approved
**Feature**: about-bio-skills-update

## User Scenarios & Testing

### User Story 1 — Accurate About Bio (Priority: P1)

A recruiter or client opens the portfolio, scrolls to the About section, and reads a bio that is honest, professional, and personal — reflecting who Murad actually is, what he has built, and how he works.

**Why this priority**: The About section is the primary trust-building section. Inaccurate or generic bio immediately reduces credibility.

**Independent Test**: Visit `/` → scroll to `#about` → read bio text and badge.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** user scrolls to About, **Then** bio shows the approved 3-paragraph text starting with "I started my AI engineering journey in 2023 through GIAIC"
2. **Given** the About section is visible, **When** user reads the badge below the location, **Then** it reads "AI Engineer" (not "AI Engineering Graduate")

---

### User Story 2 — Accurate Stats (Priority: P2)

The stats row in the About section shows numbers that match the actual portfolio content.

**Why this priority**: Mismatched stats (e.g., "4 Hackathons" when they are projects) erode trust with technical recruiters who cross-check.

**Independent Test**: Visit `#about` → inspect the 4 stat boxes.

**Acceptance Scenarios**:

1. **Given** the About section loads, **When** user reads the stat boxes, **Then** the 4th stat reads "4" with label "Projects" (not "Hackathons")
2. **Given** the stat boxes are visible, **Then** other stats remain unchanged: "2+" Years Experience, "5+" Projects Completed, "20+" Technologies

---

### User Story 3 — Accurate Skills (Priority: P3)

The Skills section shows only technologies actually used in projects. Prompt Engineering and Context Engineering are added as they were taught and practised through GIAIC.

**Why this priority**: A recruiter who reads project case studies and then sees "LangChain" in skills — which appears in no project — loses trust.

**Independent Test**: Visit `#skills` → click "AI & Agents" tab → verify items.

**Acceptance Scenarios**:

1. **Given** the Skills section loads and AI & Agents tab is active, **When** user scans the list, **Then** "LangChain" is NOT present
2. **Given** the AI & Agents tab is active, **Then** "Prompt Engineering" appears with level "advanced"
3. **Given** the AI & Agents tab is active, **Then** "Context Engineering" appears with level "intermediate"

---

### Edge Cases

- Skills manifest has two copies (`context/` and `frontend/context/`) — both must be updated or they will diverge again on next deploy.
- Bio paragraphs contain apostrophes — must use `&apos;` in JSX or template literals.

## Requirements

### Functional Requirements

- **FR-001**: About bio MUST be replaced with the approved 3-paragraph text (verbatim)
- **FR-002**: "AI Engineering Graduate" badge MUST change to "AI Engineer"
- **FR-003**: Stats "4 Hackathons" label MUST change to "4 Projects"
- **FR-004**: "LangChain" MUST be removed from `ai_and_agents` skills
- **FR-005**: "Prompt Engineering" (advanced) MUST be added to `ai_and_agents` skills
- **FR-006**: "Context Engineering" (intermediate) MUST be added to `ai_and_agents` skills
- **FR-007**: Both `context/skills-manifest.json` AND `frontend/context/skills-manifest.json` MUST be kept in sync

### Key Entities

- **About.tsx**: `frontend/src/components/sections/About.tsx` — contains bio paragraphs, badge text, and stats array (all hardcoded)
- **skills-manifest.json**: `context/skills-manifest.json` + `frontend/context/skills-manifest.json` — source of truth for Skills section

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero console errors on `#about` and `#skills` sections after deploy
- **SC-002**: Bio text matches the approved copy exactly
- **SC-003**: "AI Engineering Graduate" badge no longer appears anywhere on the page
- **SC-004**: "LangChain" no longer appears in any skills tab
- **SC-005**: "Prompt Engineering" and "Context Engineering" visible in AI & Agents tab
