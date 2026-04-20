# Feature Specification: Fix Projects & Skills Instant Load

**Feature Branch**: `006-fix-static-load`
**Created**: 2026-04-17
**Status**: In Progress
**Input**: Fix projects and skills section loading spinners by eliminating client-side data fetching. Follow-up: Vercel production still shows blank Projects section — manifest files are not found at deploy time due to monorepo working-directory mismatch.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Sees Project Cards Instantly (Priority: P1)

A potential client or recruiter opens the portfolio homepage. They scroll down to the Projects section and all project cards are visible immediately — no spinner, no blank area, no delay.

**Why this priority**: The Projects section is the primary conversion point on the portfolio. A loading spinner is a trust-killing signal — potential clients are evaluating whether to hire this developer, and any sign of a broken or slow page reduces that confidence immediately.

**Independent Test**: Open the homepage and scroll to the Projects section. Project cards must appear with no "Loading projects…" message visible at any point.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** all project cards are already visible — no loading state appears at any point.
2. **Given** a visitor loads the homepage, **When** inspecting the network tab in browser DevTools, **Then** no separate API request is made for `/api/projects` on page load.
3. **Given** a visitor clicks a filter tab (e.g., "AI Agents"), **When** the filter activates, **Then** matching cards appear instantly with no loading state.

---

### User Story 2 — Visitor Sees Skill Tabs & Cards Instantly (Priority: P2)

A visitor scrolls to the Skills section. Skill category tabs and the default tab's skill cards are visible immediately — no blank area while data loads in the background.

**Why this priority**: A skills section that loads blank and then populates creates a visually broken impression, even if the visitor doesn't know why — it reduces trust in the portfolio's quality.

**Independent Test**: Open the homepage and scroll to the Skills section. Tabs and skill cards must appear without any loading delay.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** skill category tabs and the first tab's skill cards are already visible.
2. **Given** a visitor loads the homepage, **When** inspecting the network tab in browser DevTools, **Then** no separate API request is made for `/api/skills` on page load.
3. **Given** a visitor clicks a different skill category tab, **When** the tab activates, **Then** skills for that category switch instantly with no loading state.

---

### Edge Cases

- What happens if `projects-manifest.json` is missing or malformed at build time? → Build fails immediately with a clear error — better than a broken production page showing a spinner indefinitely.
- What if the build environment's working directory is not the repository root? → The manifest-reading code must resolve file paths relative to the source file itself (not the working directory), so that the correct manifest is found regardless of where the build process is launched from.
- What if a new project is added to the manifest? → The next deployment picks it up automatically — no component code changes required.
- What if the visitor has JavaScript disabled? → Static HTML already contains all project and skills data, so both sections remain fully visible — no JS required for initial content.
- Do the `/api/projects` and `/api/skills` routes need to stay? → Yes — the RAG chatbot and any other runtime consumers still use them. These routes are unaffected by this change.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage MUST deliver project card data as part of the initial HTML response — no separate network request for project data after page load.
- **FR-002**: The homepage MUST deliver skill tab and card data as part of the initial HTML response — no separate network request for skills data after page load.
- **FR-003**: Visitors MUST be able to filter projects by category — clicking a filter tab MUST show only matching projects without a page reload or loading state.
- **FR-004**: Visitors MUST be able to switch skill categories — clicking a tab MUST switch visible skills without a loading state.
- **FR-005**: Project data MUST remain sourced from `projects-manifest.json` — no project content hardcoded in component files.
- **FR-006**: Skills data MUST remain sourced from `skills-manifest.json` — no skills content hardcoded in component files.
- **FR-007**: The homepage MUST be classified as static (prerendered at build time) — not dynamically server-rendered on each request.
- **FR-008**: The manifest file resolution MUST succeed regardless of the working directory at build time — the correct files MUST be found whether the build is run from the repository root, the `frontend/` subdirectory, or any other location.

### Key Entities

- **projects-manifest.json**: Source of truth for all project data. Attributes: title, description, tech stack, links, category, featured flag, screenshots.
- **skills-manifest.json**: Source of truth for all skills data. Attributes: skill categories, skill names, proficiency levels.
- **Home Page**: Entry point that reads both manifests at build time and passes data to child sections as props.
- **Projects Section**: Handles filter interactivity. Receives pre-loaded project list; renders immediately without fetching.
- **Skills Section**: Handles tab interactivity. Receives pre-loaded skills data; renders immediately without fetching.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Project cards are visible to the visitor in the same render as the rest of the page — no measurable delay specific to the Projects section on any connection speed.
- **SC-002**: Skill tabs and cards are visible to the visitor in the same render as the rest of the page — no measurable delay specific to the Skills section.
- **SC-003**: Homepage build output is classified as `Static` (prerendered) — verified in Next.js build output on every deployment.
- **SC-004**: Zero additional network requests fire on page load for projects or skills data — confirmed via browser DevTools Network tab.
- **SC-005**: Filter and tab interactions respond in under 100ms perceived time — no loading states triggered by any user interaction within these sections.
- **SC-006**: The production deployment on Vercel shows all 4 project cards and all skill data with zero blank sections — verified by loading the live URL after deployment.
- **SC-007**: Manifest file resolution succeeds when the build is triggered from the `frontend/` subdirectory — no "file not found" build errors on any hosting environment.

## Assumptions

- Both manifest JSON files are valid and present at build time. The build pipeline is responsible for this guarantee.
- Project categories in `projects-manifest.json` match the filter label values defined in the Projects section component.
- The `/api/projects` and `/api/skills` API routes remain in the codebase for the RAG chatbot and any other runtime consumers.
- The `context/` folder stays at the repository root — no structural reorganisation is in scope.
- On Vercel, the build is launched from the `frontend/` subdirectory, so `process.cwd()` returns `frontend/` rather than the repository root. File path resolution must account for this deployment constraint.
